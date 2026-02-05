import { Injectable, Logger, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ScheduledTask, TaskStatus } from './entities/scheduled-task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MailService } from '../mail/mail.service';
import { LogsService } from '../logs/logs.service';
import { EmailTemplatesService } from '../email-templates/email-templates.service';
import { LogStatus } from '../logs/entities/email-log.entity';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(ScheduledTask)
    private tasksRepository: Repository<ScheduledTask>,
    private schedulerRegistry: SchedulerRegistry,
    private mailService: MailService,
    private logsService: LogsService,
    private templatesService: EmailTemplatesService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing scheduled tasks...');
    const tasks = await this.tasksRepository.find({
      where: { status: TaskStatus.RUNNING },
      relations: ['email_template'],
    });

    for (const task of tasks) {
      this.addCronJob(task);
    }
    this.logger.log(`Initialized ${tasks.length} tasks.`);
  }

  async create(userId: number, createDto: CreateTaskDto): Promise<ScheduledTask> {
    const template = await this.templatesService.findOne(createDto.email_template_id);
    if (!template) {
      throw new NotFoundException('邮件模板不存在');
    }

    const task = this.tasksRepository.create({
      ...createDto,
      user_id: userId,
      status: TaskStatus.PENDING,
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(userId: number, page?: string, pageSize?: string, status?: string): Promise<{ data: ScheduledTask[]; total: number; page: number; pageSize: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 10;
    const query = this.tasksRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.email_template', 'email_template')
      .where('task.user_id = :userId', { userId })
      .orderBy('task.created_at', 'DESC');

    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      query.andWhere('task.status IN (:...statuses)', { statuses });
    }

    query.skip((pageNum - 1) * size)
      .take(size);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page: pageNum,
      pageSize: size,
    };
  }

  async findOne(id: number, userId: number): Promise<ScheduledTask> {
    const task = await this.tasksRepository.findOne({
      where: { id, user_id: userId },
      relations: ['email_template'],
    });
    if (!task) {
      throw new NotFoundException('任务不存在');
    }
    return task;
  }

  async update(id: number, userId: number, updateDto: UpdateTaskDto): Promise<ScheduledTask> {
    const task = await this.findOne(id, userId);
    
    // 如果任务正在运行，需要先停止旧的 Cron Job
    if (task.status === TaskStatus.RUNNING) {
      this.deleteCronJob(task.id);
    }

    await this.tasksRepository.update(id, updateDto);
    const updatedTask = await this.findOne(id, userId);

    // 如果更新后状态仍为运行，重新添加 Cron Job
    if (updatedTask.status === TaskStatus.RUNNING) {
      this.addCronJob(updatedTask);
    }

    return updatedTask;
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    if (task.status === TaskStatus.RUNNING) {
      this.deleteCronJob(task.id);
    }
    await this.logsService.deleteByTaskId(id);
    await this.tasksRepository.delete(id);
  }

  async start(id: number, userId: number): Promise<ScheduledTask> {
    const task = await this.findOne(id, userId);
    if (task.status === TaskStatus.RUNNING) {
      return task;
    }

    task.status = TaskStatus.RUNNING;
    await this.tasksRepository.save(task);
    this.addCronJob(task);
    
    return task;
  }

  async pause(id: number, userId: number): Promise<ScheduledTask> {
    const task = await this.findOne(id, userId);
    if (task.status !== TaskStatus.RUNNING) {
      return task;
    }

    task.status = TaskStatus.PAUSED;
    await this.tasksRepository.save(task);
    this.deleteCronJob(task.id);

    return task;
  }

  private addCronJob(task: ScheduledTask) {
    const jobName = `${task.id}`;
    
    // 防止重复添加
    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.logger.warn(`Job ${jobName} already exists`);
      return;
    }

    const job = new CronJob(task.schedule, async () => {
      await this.handleCron(task.id);
    });

    this.schedulerRegistry.addCronJob(jobName, job as any);
    job.start();
    this.logger.log(`Task ${task.id} started with schedule: ${task.schedule}`);
  }

  private deleteCronJob(taskId: number) {
    const jobName = `${taskId}`;
    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.log(`Task ${taskId} stopped`);
    }
  }

  private async handleCron(taskId: number) {
    this.logger.log(`Executing task ${taskId}...`);
    
    // 重新获取任务以确保数据最新，且获取关联的模板
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['email_template'],
    });

    if (!task || !task.email_template) {
      this.logger.error(`Task ${taskId} or template not found during execution`);
      return;
    }

    try {
      await this.mailService.sendMail(
        task.email_template.to_email,
        task.email_template.subject,
        task.email_template.body,
        task.email_template.type,
        task.email_template.use_ai,
        task.email_template.prompt
      );

      await this.logsService.create({
        task_id: task.id,
        status: LogStatus.SUCCESS,
        sent_at: new Date(),
      });

      task.last_executed_at = new Date();
      await this.tasksRepository.save(task);

      this.logger.log(`Task ${taskId} executed successfully`);

      // 检查是否是单次任务
      if (this.isOnceTask(task.schedule)) {
        this.logger.log(`Task ${taskId} is a once task, marking as completed`);
        task.status = TaskStatus.COMPLETED;
        await this.tasksRepository.save(task);
        this.deleteCronJob(task.id);
      }
    } catch (error) {
      this.logger.error(`Task ${taskId} failed: ${error.message}`);
      
      await this.logsService.create({
        task_id: task.id,
        status: LogStatus.FAILURE,
        sent_at: new Date(),
        error_msg: error.message,
      });

      task.last_executed_at = new Date();
      await this.tasksRepository.save(task);
    }
  }

  private isOnceTask(cron: string): boolean {
    if (!cron) return false;
    const parts = cron.split(' ');
    // 如果有6部分（秒 分 时 日 月 周）或5部分（分 时 日 月 周）
    // 检查日和月是否都不是 *
    const offset = parts.length === 6 ? 1 : 0;
    const dayOfMonth = parts[2 + offset];
    const month = parts[3 + offset];
    return dayOfMonth !== '*' && month !== '*';
  }
}
