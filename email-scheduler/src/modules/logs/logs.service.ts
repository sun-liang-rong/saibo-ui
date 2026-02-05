import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
console.log(1111)
@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(EmailLog)
    private logsRepository: Repository<EmailLog>,
  ) {}

  async findAll(page?: string, pageSize?: string): Promise<{ data: EmailLog[]; total: number; page: number; pageSize: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 10;

    const [data, total] = await this.logsRepository.findAndCount({
      relations: ['task'],
      order: { sent_at: 'DESC' },
      skip: (pageNum - 1) * size,
      take: size,
    });

    return {
      data,
      total,
      page: pageNum,
      pageSize: size,
    };
  }

  async findByTask(taskId: number): Promise<EmailLog[]> {
    return await this.logsRepository.find({
      where: { task_id: taskId },
      order: { sent_at: 'DESC' },
    });
  }

  async create(log: Partial<EmailLog>): Promise<EmailLog> {
    const newLog = this.logsRepository.create(log);
    return await this.logsRepository.save(newLog);
  }
  async deleteByTaskId(taskId: number): Promise<void> {
    await this.logsRepository.delete({ task_id: taskId });
  }
}
