import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { ScheduledEmail, EmailStatus, ScheduleFrequency } from './entities/scheduled-email.entity';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailResponseDto } from './dto/email-response.dto';
import { MailService } from './mail.service';
import { WeatherService } from '../weather/weather.service';

/**
 * 邮件服务
 *
 * 核心业务逻辑：
 * 1. 创建定时邮件任务
 * 2. 查询邮件列表
 * 3. 查询单个邮件详情
 * 4. 获取待发送的邮件（供定时任务使用）
 * 5. 发送邮件（供定时任务调用）
 * 6. 更新邮件状态
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectRepository(ScheduledEmail)
    private emailRepository: Repository<ScheduledEmail>,
    private mailService: MailService,
    private weatherService: WeatherService,
  ) {}

  /**
   * 创建定时邮件任务
   *
   * @param createEmailDto 邮件数据
   * @returns 创建的邮件任务
   *
   * 业务逻辑：
   * 1. 验证发送时间必须在未来
   * 2. 验证周期性任务的参数
   * 3. 保存到数据库
   * 4. 返回创建的任务信息
   */
  async create(createEmailDto: CreateEmailDto): Promise<EmailResponseDto> {
    this.logger.log(`创建新的定时邮件任务: ${createEmailDto.to_email}`);

    // 将字符串时间转换为 Date 对象
    const sendTime = new Date(createEmailDto.send_time);

    // 验证发送时间必须在未来
    const now = new Date();
    if (sendTime <= now) {
      throw new Error('发送时间必须在未来时间');
    }

    // 验证周期性任务参数
    const frequency = createEmailDto.frequency || ScheduleFrequency.ONCE;

    // 如果是每周任务，必须提供星期几
    if (frequency === ScheduleFrequency.WEEKLY && !createEmailDto.week_day) {
      throw new Error('每周任务必须指定星期几（1-7）');
    }

    // 如果不是每周任务，不能提供星期几
    if (frequency !== ScheduleFrequency.WEEKLY && createEmailDto.week_day) {
      throw new Error('只有每周任务才能指定星期几');
    }

    // 验证天气相关参数
    const includeWeather = createEmailDto.include_weather || false;

    // 如果包含天气，必须提供城市
    if (includeWeather && !createEmailDto.weather_city) {
      throw new Error('包含天气信息时必须指定城市');
    }

    // 创建邮件实体
    const email = this.emailRepository.create({
      to_email: createEmailDto.to_email,
      subject: createEmailDto.subject,
      content: createEmailDto.content,
      send_time: sendTime,
      status: EmailStatus.PENDING,
      retry_count: 0,
      frequency,
      week_day: createEmailDto.week_day || null,
      parent_id: createEmailDto.parent_id || null,
      include_weather: includeWeather,
      weather_city: createEmailDto.weather_city || null,
    });

    // 保存到数据库
    const saved = await this.emailRepository.save(email);

    this.logger.log(`邮件任务创建成功，ID: ${saved.id}, 频率: ${frequency}`);

    return this.toResponseDto(saved);
  }

  /**
   * 查询邮件列表（分页）
   *
   * @param page 页码
   * @param limit 每页数量
   * @param status 状态筛选（可选）
   * @returns 邮件列表
   */
  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{
    data: EmailResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(`查询邮件列表，页码: ${page}, 每页: ${limit}, 状态: ${status || '全部'}`);

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // 查询数据
    const [emails, total] = await this.emailRepository.findAndCount({
      where,
      order: { created_at: 'DESC' }, // 按创建时间倒序
      skip,
      take: limit,
    });

    return {
      data: emails.map(email => this.toResponseDto(email)),
      total,
      page,
      limit,
    };
  }

  /**
   * 查询单个邮件详情
   *
   * @param id 邮件ID
   * @returns 邮件详情
   */
  async findOne(id: number): Promise<EmailResponseDto> {
    this.logger.log(`查询邮件详情，ID: ${id}`);

    const email = await this.emailRepository.findOne({ where: { id } });

    if (!email) {
      throw new Error(`邮件任务不存在，ID: ${id}`);
    }

    return this.toResponseDto(email);
  }

  /**
   * 更新邮件任务
   *
   * @param id 邮件ID
   * @param updateEmailDto 更新数据
   * @returns 更新后的邮件任务
   *
   * 业务逻辑：
   * 1. 验证邮件是否存在
   * 2. 只能更新待发送状态的邮件
   * 3. 验证发送时间必须在未来
   * 4. 验证周期性任务的参数
   * 5. 更新邮件信息
   * 6. 返回更新后的任务信息
   */
  async update(id: number, updateEmailDto: CreateEmailDto): Promise<EmailResponseDto> {
    this.logger.log(`更新邮件任务，ID: ${id}`);

    // 查询邮件是否存在
    const email = await this.emailRepository.findOne({ where: { id } });

    if (!email) {
      throw new Error(`邮件任务不存在，ID: ${id}`);
    }

    // 只能更新待发送状态的邮件
    if (email.status !== EmailStatus.PENDING) {
      throw new Error(`只能更新待发送状态的邮件，当前状态: ${email.status}`);
    }

    // 验证发送时间必须在未来
    const sendTime = new Date(updateEmailDto.send_time);
    const now = new Date();
    if (sendTime <= now) {
      throw new Error('发送时间必须在未来时间');
    }

    // 验证周期性任务参数
    const frequency = updateEmailDto.frequency || ScheduleFrequency.ONCE;

    // 如果是每周任务，必须提供星期几
    if (frequency === ScheduleFrequency.WEEKLY && !updateEmailDto.week_day) {
      throw new Error('每周任务必须指定星期几（1-7）');
    }

    // 如果不是每周任务，不能提供星期几
    if (frequency !== ScheduleFrequency.WEEKLY && updateEmailDto.week_day) {
      throw new Error('只有每周任务才能指定星期几');
    }

    // 验证天气相关参数
    const includeWeather = updateEmailDto.include_weather || false;

    // 如果包含天气，必须提供城市
    if (includeWeather && !updateEmailDto.weather_city) {
      throw new Error('包含天气信息时必须指定城市');
    }

    // 更新邮件信息
    email.to_email = updateEmailDto.to_email;
    email.subject = updateEmailDto.subject;
    email.content = updateEmailDto.content;
    email.send_time = sendTime;
    email.frequency = frequency;
    email.week_day = updateEmailDto.week_day || null;
    email.include_weather = includeWeather;
    email.weather_city = updateEmailDto.weather_city || null;

    // 保存更新
    const updated = await this.emailRepository.save(email);

    this.logger.log(`邮件任务更新成功，ID: ${updated.id}, 频率: ${frequency}`);

    return this.toResponseDto(updated);
  }

  /**
   * 获取待发送的邮件
   *
   * 此方法供定时任务调用
   *
   * 查询条件：
   * 1. 状态为 PENDING 或 RETRYING
   * 2. 发送时间 <= 当前时间
   * 3. 重试次数 < 3（在重试逻辑中处理）
   *
   * @returns 待发送的邮件列表
   */
  async getPendingEmails(): Promise<ScheduledEmail[]> {
    this.logger.debug('扫描待发送的邮件任务...');

    const now = new Date();

    // 使用 TypeORM 的 LessThanOrEqual 查询
    const emails = await this.emailRepository.find({
      where: [
        {
          status: EmailStatus.PENDING,
          send_time: LessThanOrEqual(now) as any, // 修改为 <=
        },
        {
          status: EmailStatus.RETRYING,
          send_time: LessThanOrEqual(now) as any, // 修改为 <=
        },
      ],
      order: { send_time: 'ASC' }, // 按发送时间升序，先处理早的任务
    });

    if (emails.length > 0) {
      this.logger.log(`找到 ${emails.length} 个待发送的邮件任务`);
    }

    return emails;
  }

  /**
   * 发送邮件
   *
   * 此方法供定时任务调用
   *
   * @param email 邮件实体
   * @returns 是否发送成功
   */
  async sendEmail(email: ScheduledEmail): Promise<boolean> {
    this.logger.log(`开始发送邮件，ID: ${email.id}, 收件人: ${email.to_email}`);

    try {
      // 准备邮件内容
      let emailContent = email.content;

      // 如果需要包含天气信息，获取天气数据
      if (email.include_weather && email.weather_city) {
        try {
          this.logger.log(`正在获取 ${email.weather_city} 的天气信息`);

          // 获取天气数据
          const weatherData = await this.weatherService.getWeather(email.weather_city);

          // 生成天气 HTML
          const weatherHTML = this.weatherService.generateWeatherHTML(weatherData);

          // 将天气信息插入到邮件内容中
          // 方式1：插入到内容开头
          emailContent = weatherHTML + emailContent;

          this.logger.log(`成功将天气信息添加到邮件中，ID: ${email.id}`);
        } catch (weatherError) {
          // 天气获取失败时，记录警告但仍然发送邮件
          this.logger.warn(
            `获取天气信息失败，将发送原邮件内容。错误：${weatherError.message}`,
          );

          // 在邮件内容中添加错误提示
          const errorHTML = `
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ⚠️ <strong>天气信息获取失败：</strong> ${weatherError.message}
            </div>
          `;
          emailContent = errorHTML + emailContent;
        }
      }

      // 调用邮件服务发送邮件
      await this.mailService.sendMail({
        to: email.to_email,
        subject: email.subject,
        html: emailContent,
      });

      // 更新状态为已发送
      await this.updateStatus(email.id, EmailStatus.SENT, null);

      this.logger.log(`邮件发送成功，ID: ${email.id}, 频率: ${email.frequency}`);

      // 如果是周期性任务，创建下一次任务
      await this.scheduleNextEmail(email);

      return true;
    } catch (error) {
      this.logger.error(`邮件发送失败，ID: ${email.id}`, error.stack);

      // 判断是否需要重试
      const shouldRetry = email.retry_count < 3;

      if (shouldRetry) {
        // 更新为重试状态
        await this.incrementRetry(email.id, error.message);
        this.logger.warn(`邮件将进行重试，ID: ${email.id}, 当前重试次数: ${email.retry_count + 1}`);
      } else {
        // 重试次数用尽，标记为失败
        await this.updateStatus(email.id, EmailStatus.FAILED, error.message);
        this.logger.error(`邮件重试次数已用尽，标记为失败，ID: ${email.id}`);
      }

      return false;
    }
  }

  /**
   * 创建下一次周期性任务
   *
   * @param sentEmail 已发送的邮件
   */
  async scheduleNextEmail(sentEmail: ScheduledEmail): Promise<void> {
    // 单次任务不需要创建下一次任务
    if (sentEmail.frequency === ScheduleFrequency.ONCE) {
      this.logger.debug(`单次任务，不创建下一次任务，ID: ${sentEmail.id}`);
      return;
    }

    // 如果是子任务（parent_id 不为空），不创建新的周期性任务
    // 只由父任务创建下一次任务
    if (sentEmail.parent_id !== null) {
      this.logger.debug(`子任务，不创建下一次任务，ID: ${sentEmail.id}`);
      return;
    }

    const nextSendTime = this.calculateNextSendTime(sentEmail);

    if (!nextSendTime) {
      this.logger.warn(`无法计算下一次发送时间，ID: ${sentEmail.id}`);
      return;
    }

    // 创建下一次任务
    const nextEmail = this.emailRepository.create({
      to_email: sentEmail.to_email,
      subject: sentEmail.subject,
      content: sentEmail.content,
      send_time: nextSendTime,
      status: EmailStatus.PENDING,
      retry_count: 0,
      frequency: sentEmail.frequency,
      week_day: sentEmail.week_day,
      parent_id: sentEmail.id, // 关联父任务
      include_weather: sentEmail.include_weather,
      weather_city: sentEmail.weather_city,
    });

    await this.emailRepository.save(nextEmail);

    this.logger.log(
      `已创建下一次任务，父任务ID: ${sentEmail.id}, 新任务ID: ${nextEmail.id}, 下次发送时间: ${nextSendTime.toISOString()}`,
    );
  }

  /**
   * 计算下一次发送时间
   *
   * @param email 邮件实体
   * @returns 下一次发送时间
   */
  private calculateNextSendTime(email: ScheduledEmail): Date | null {
    const currentSendTime = new Date(email.send_time);

    if (email.frequency === ScheduleFrequency.DAILY) {
      // 每天任务：加一天
      const nextTime = new Date(currentSendTime);
      nextTime.setDate(nextTime.getDate() + 1);
      return nextTime;
    }

    if (email.frequency === ScheduleFrequency.WEEKLY && email.week_day) {
      // 每周任务：找到下一个指定星期几
      const nextTime = new Date(currentSendTime);
      nextTime.setDate(nextTime.getDate() + 1); // 从明天开始查找

      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      // 我们使用 1 = Monday, ..., 7 = Sunday
      const targetDay = email.week_day === 7 ? 0 : email.week_day;

      // 找到下一个目标星期几
      while (nextTime.getDay() !== targetDay) {
        nextTime.setDate(nextTime.getDate() + 1);
      }

      // 保持相同的时间
      nextTime.setHours(
        currentSendTime.getHours(),
        currentSendTime.getMinutes(),
        currentSendTime.getSeconds(),
      );

      return nextTime;
    }

    return null;
  }

  /**
   * 更新邮件状态
   *
   * @param id 邮件ID
   * @param status 新状态
   * @param errorMessage 错误信息（可选）
   */
  async updateStatus(id: number, status: EmailStatus, errorMessage: string | null = null): Promise<void> {
    const updateData: Partial<ScheduledEmail> = {
      status,
    };

    if (status === EmailStatus.SENT) {
      updateData.sent_at = new Date();
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    await this.emailRepository.update(id, updateData);
  }

  /**
   * 增加重试次数并更新为重试状态
   *
   * @param id 邮件ID
   * @param errorMessage 错误信息
   */
  async incrementRetry(id: number, errorMessage: string): Promise<void> {
    await this.emailRepository.increment({ id }, 'retry_count', 1);

    await this.emailRepository.update(id, {
      status: EmailStatus.RETRYING,
      error_message: errorMessage,
    });
  }

  /**
   * 删除邮件任务
   *
   * @param id 邮件ID
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`删除邮件任务，ID: ${id}`);

    const email = await this.emailRepository.findOne({ where: { id } });

    if (!email) {
      throw new Error(`邮件任务不存在，ID: ${id}`);
    }

    // 只能删除待发送或已失败的邮件
    if (email.status === EmailStatus.SENT) {
      throw new Error('已发送的邮件不能删除');
    }

    await this.emailRepository.delete(id);

    this.logger.log(`邮件任务删除成功，ID: ${id}`);
  }
  weatherTest(city) {
    return this.weatherService.getWeather(city);
  }
  /**
   * 将实体转换为响应 DTO
   *
   * @param email 邮件实体
   * @returns 响应 DTO
   */
  private toResponseDto(email: ScheduledEmail): EmailResponseDto {
    return {
      id: email.id,
      to_email: email.to_email,
      subject: email.subject,
      content: email.content,
      send_time: email.send_time,
      status: email.status,
      retry_count: email.retry_count,
      error_message: email.error_message,
      sent_at: email.sent_at,
      frequency: email.frequency,
      week_day: email.week_day,
      parent_id: email.parent_id,
      include_weather: email.include_weather,
      weather_city: email.weather_city,
      created_at: email.created_at,
      updated_at: email.updated_at,
    };
  }
}
