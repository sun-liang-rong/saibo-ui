import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ScheduledEmail, EmailStatus, ScheduleFrequency } from './entities/scheduled-email.entity';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailResponseDto } from './dto/email-response.dto';
import { MailService } from './mail.service';
import { WeatherService } from '../weather/weather.service';


/**
 * 邮件服务
 *
 * 重构说明：
 * - 旧逻辑: 创建任务 → 发送 → 创建子任务 → 链式执行
 * - 新逻辑: 创建规则 → 调度器扫描 → 动态判断 → 创建实例 → 发送
 *
 * 核心改进：
 * 1. 定时邮件 = 规则 + 调度器
 * 2. 移除 scheduleNextEmail 链式创建逻辑
 * 3. 添加 getActiveRules, createEmailInstance, updateRuleAfterSent 方法
 * 4. 支持新频率: 每小时, 纪念日
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
   * 创建邮件规则
   *
   * @param createEmailDto 邮件数据
   * @returns 创建的邮件规则
   *
   * 业务逻辑：
   * 1. 验证发送时间必须在未来 (对于单次任务)
   * 2. 验证周期性任务的参数
   * 3. 保存规则到数据库 (is_rule = true)
   * 4. 预计算 next_send_at
   * 5. 返回创建的规则信息
   */
  async create(createEmailDto: CreateEmailDto): Promise<EmailResponseDto> {
    this.logger.log(`创建新的邮件规则: ${createEmailDto.to_email}`);

    // 🔧 时区转换: 不再需要转换，直接使用传入的时间
    let sendTime: Date | null = null;
    if (createEmailDto.send_time) {
      sendTime = new Date(createEmailDto.send_time);
    }

    // 验证周期性任务参数
    const frequency = createEmailDto.frequency || ScheduleFrequency.ONCE;

    // 验证参数
    this.validateRuleParams(createEmailDto, frequency, sendTime);

    // 创建邮件规则实体
    const email = this.emailRepository.create({
      to_email: createEmailDto.to_email,
      subject: createEmailDto.subject,
      content: createEmailDto.content,
      send_time: sendTime,
      status: EmailStatus.PENDING,
      retry_count: 0,
      frequency,
      week_day: createEmailDto.week_day || null,
      parent_id: null, // 规则的 parent_id 始终为 null
      is_rule: true, // 标记为规则
      include_weather: createEmailDto.include_weather || false,
      weather_city: createEmailDto.weather_city || null,
      anniversary_month: createEmailDto.anniversary_month || null,
      anniversary_day: createEmailDto.anniversary_day || null,
      last_sent_at: null,
      next_send_at: null, // 稍后计算
      template_category: createEmailDto.template_category || null,
      template_id: createEmailDto.template_id || null,
    });

    // 预计算下次发送时间
    email.next_send_at = this.calculateNextSendTime(email);

    // 保存到数据库
    const saved = await this.emailRepository.save(email);

    this.logger.log(
      `邮件规则创建成功，ID: ${saved.id}, 频率: ${frequency}, 下次发送: ${saved.next_send_at}`,
    );

    return this.toResponseDto(saved);
  }

  /**
   * 验证规则参数
   */
  private validateRuleParams(
    createEmailDto: CreateEmailDto,
    frequency: ScheduleFrequency,
    sendTime: Date | null,
  ): void {
    // 对于单次任务，发送时间必须在未来
    if (frequency === ScheduleFrequency.ONCE) {
      if (!sendTime) {
        throw new Error('单次任务必须指定发送时间');
      }
      // 此时获取的now也需要转换时区
      const now = new Date();
      if (sendTime <= now) {
        throw new Error('发送时间必须在未来时间');
      }
    }

    // 每小时任务需要指定分钟数
    if (frequency === ScheduleFrequency.HOURLY && !sendTime) {
      throw new Error('每小时任务必须指定发送时间（用于确定分钟数）');
    }

    // 每天任务需要指定时间
    if (frequency === ScheduleFrequency.DAILY && !sendTime) {
      throw new Error('每天任务必须指定发送时间');
    }

    // 每周任务需要指定星期几和时间
    if (frequency === ScheduleFrequency.WEEKLY) {
      if (!createEmailDto.week_day) {
        throw new Error('每周任务必须指定星期几（1-7）');
      }
      if (!sendTime) {
        throw new Error('每周任务必须指定发送时间');
      }
    }

    // 纪念日任务需要指定月日
    if (frequency === ScheduleFrequency.ANNIVERSARY) {
      if (!createEmailDto.anniversary_month || !createEmailDto.anniversary_day) {
        throw new Error('纪念日任务必须指定月份和日期');
      }
    }

    // 验证天气相关参数
    const includeWeather = createEmailDto.include_weather || false;
    if (includeWeather && !createEmailDto.weather_city) {
      throw new Error('包含天气信息时必须指定城市');
    }
  }

  /**
   * 查询邮件规则列表（分页）
   *
   * @param page 页码
   * @param limit 每页数量
   * @param status 状态筛选（可选）
   * @returns 邮件规则列表
   *
   * 注意: 只返回规则 (is_rule = true),不返回实例
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Promise<{
    data: EmailResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(
      `查询邮件规则列表，页码: ${page}, 每页: ${limit}, 状态: ${status || '全部'}, 搜索: ${search || '无'}`,
    );

    const skip = (page - 1) * limit;

    // 基础条件（所有 OR 都要包含）
    const baseWhere: any = {
      is_rule: true,
    };

    // 状态条件
    if (status) {
      baseWhere.status = status;
    }

    // 最终 where
    let where: any = baseWhere;

    // 如果有搜索关键词 → OR
    if (search && search.trim()) {
      const keyword = `%${search.trim()}%`;

      where = [
        {
          ...baseWhere,
          to_email: Like(keyword),
        },
        {
          ...baseWhere,
          subject: Like(keyword),
        },
      ];
    }

    // 查询数据
    const [emails, total] = await this.emailRepository.findAndCount({
      where,
      order: { created_at: 'DESC' }, // 按创建时间倒序
      skip,
      take: limit,
    });

    return {
      data: emails.map((email) => this.toResponseDto(email)),
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
    email.template_id = updateEmailDto.template_id || null;
    email.template_category = updateEmailDto.template_category || null;
    // 保存更新
    const updated = await this.emailRepository.save(email);

    this.logger.log(`邮件任务更新成功，ID: ${updated.id}, 频率: ${frequency}`);

    return this.toResponseDto(updated);
  }

  /**
   * 获取所有活跃的邮件规则
   *
   * 此方法供调度器使用
   *
   * @returns 所有活跃的邮件规则 (is_rule = true)
   */
  async getActiveRules(): Promise<ScheduledEmail[]> {
    this.logger.debug('扫描活跃的邮件规则...');

    const rules = await this.emailRepository.find({
      where: { is_rule: true },
      order: { created_at: 'ASC' },
    });

    return rules;
  }

  /**
   * 创建邮件发送实例
   *
   * 此方法供调度器使用
   *
   * @param rule 邮件规则
   * @param sendTime 实际发送时间
   * @returns 创建的邮件实例
   */
  async createEmailInstance(rule: ScheduledEmail, sendTime: Date): Promise<ScheduledEmail> {
    this.logger.log(`创建邮件实例，规则ID: ${rule.id}, 发送时间: ${sendTime.toISOString()}`);

    const instance = this.emailRepository.create({
      to_email: rule.to_email,
      subject: rule.subject,
      content: rule.content,
      send_time: sendTime,
      status: EmailStatus.PENDING,
      retry_count: 0,
      frequency: rule.frequency, // 继承规则的频率
      week_day: rule.week_day,
      parent_id: rule.id, // 指向规则ID
      is_rule: false, // 标记为实例
      include_weather: rule.include_weather,
      weather_city: rule.weather_city,
      anniversary_month: rule.anniversary_month,
      anniversary_day: rule.anniversary_day,
    });

    const saved = await this.emailRepository.save(instance);

    this.logger.log(`邮件实例创建成功，ID: ${saved.id}`);

    return saved;
  }

  /**
   * 发送成功后更新规则状态
   *
   * 此方法供调度器使用
   *
   * @param ruleId 规则ID
   * @param sentTime 发送时间
   */
  async updateRuleAfterSent(ruleId: number, sentTime: Date): Promise<void> {
    this.logger.log(`更新规则状态，规则ID: ${ruleId}`);

    const rule = await this.emailRepository.findOne({ where: { id: ruleId } });

    if (!rule) {
      this.logger.warn(`规则不存在，ID: ${ruleId}`);
      return;
    }

    // 更新最后发送时间
    rule.last_sent_at = sentTime;

    // 如果是单次任务,标记为完成
    if (rule.frequency === ScheduleFrequency.ONCE) {
      rule.status = EmailStatus.SENT;
      rule.next_send_at = null;
    } else {
      // 周期性任务,计算下次发送时间
      rule.next_send_at = this.calculateNextSendTime(rule);
    }

    await this.emailRepository.save(rule);

    this.logger.log(
      `规则状态更新成功，ID: ${ruleId}, 最后发送: ${sentTime.toISOString()}, 下次发送: ${rule.next_send_at?.toISOString() || '无'}`,
    );
  }

  /**
   * 发送邮件
   *
   * 此方法供调度器调用,用于发送邮件实例
   *
   * @param email 邮件实例
   * @returns 是否发送成功
   *
   * 注意: 不再调用 scheduleNextEmail,由调度器负责创建下一次实例
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
          emailContent = weatherHTML + emailContent;

          this.logger.log(`成功将天气信息添加到邮件中，ID: ${email.id}`);
        } catch (weatherError) {
          // 天气获取失败时，记录警告但仍然发送邮件
          this.logger.warn(`获取天气信息失败，将发送原邮件内容。错误：${weatherError.message}`);

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

      // ❌ 移除链式创建逻辑 - 不再调用 scheduleNextEmail
      // ✅ 新架构: 由调度器负责判断和创建下一次实例

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
   * 计算下次发送时间
   *
   * @param rule 邮件规则
   * @returns 下次发送时间
   *
   * 注意: 此方法用于计算 next_send_at,不用于创建实例
   */
  private calculateNextSendTime(rule: ScheduledEmail): Date | null {
    const now = new Date();

    switch (rule.frequency) {
      case ScheduleFrequency.ONCE:
        // 单次任务: 返回配置的发送时间
        return rule.send_time;

      case ScheduleFrequency.HOURLY:
        // 每小时: 下一小时的第X分钟
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        if (rule.send_time) {
          const targetMinute = new Date(rule.send_time).getMinutes();
          nextHour.setMinutes(targetMinute);
        }
        return nextHour;

      case ScheduleFrequency.DAILY:
        // 每天: 明天的同一时间
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        if (rule.send_time) {
          const targetTime = new Date(rule.send_time);
          nextDay.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);
        }
        return nextDay;

      case ScheduleFrequency.WEEKLY:
        // 每周: 下周的星期几
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        if (rule.send_time) {
          const targetTime = new Date(rule.send_time);
          nextWeek.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);
        }
        return nextWeek;

      case ScheduleFrequency.ANNIVERSARY:
        // 纪念日: 下一年的同月同日
        const nextYear = new Date(now);
        nextYear.setFullYear(now.getFullYear() + 1);
        nextYear.setMonth(rule.anniversary_month! - 1);
        nextYear.setDate(rule.anniversary_day!);
        if (rule.send_time) {
          const targetTime = new Date(rule.send_time);
          nextYear.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);
        }
        return nextYear;

      default:
        return null;
    }
  }

  /**
   * 更新邮件状态
   *
   * @param id 邮件ID
   * @param status 新状态
   * @param errorMessage 错误信息（可选）
   */
  async updateStatus(
    id: number,
    status: EmailStatus,
    errorMessage: string | null = null,
  ): Promise<void> {
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
      is_rule: email.is_rule,
      last_sent_at: email.last_sent_at,
      next_send_at: email.next_send_at,
      anniversary_month: email.anniversary_month,
      anniversary_day: email.anniversary_day,
      created_at: email.created_at,
      updated_at: email.updated_at,
      template_category: email.template_category,
      template_id: email.template_id,
    };
  }
}
