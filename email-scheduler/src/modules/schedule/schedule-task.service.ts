import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { ScheduledEmail, ScheduleFrequency } from '../email/entities/scheduled-email.entity';

/**
 * 定时任务服务
 *
 * 重构说明：
 * - 旧逻辑: 扫描待发送实例,链式创建子任务
 * - 新逻辑: 扫描所有规则,动态判断是否需要发送
 *
 * 核心改进：
 * 1. 定时邮件 = 规则 + 调度器
 * 2. 数据库存的是发送规则,不是未来任务
 * 3. 调度器每分钟扫描规则,基于频率动态判断
 * 4. 支持: 单次 / 每小时 / 每天 / 每周 / 纪念日
 * 5. 防止服务重启导致的重复发送和漏发
 */
@Injectable()
export class ScheduleTaskService {
  private readonly logger = new Logger(ScheduleTaskService.name);

  constructor(private readonly emailService: EmailService) {
    this.logger.log('定时任务服务初始化');
  }

  /**
   * 定时扫描邮件规则并发送
   *
   * 重构后的逻辑:
   * 1. 每分钟扫描所有活跃的邮件规则 (is_rule = true)
   * 2. 对每条规则判断是否应该在当前时间发送
   * 3. 检查是否已发送过 (防重复发送)
   * 4. 如果应该发送且未重复,创建实例并发送
   * 5. 发送成功后更新规则的 last_sent_at 和 next_send_at
   *
   * 频率判断逻辑:
   * - 单次: send_time <= now 且未发送过
   * - 每小时: 每小时第X分钟发送 (如 00:30, 01:30, 02:30...)
   * - 每天: 每天 HH:mm 发送 (如每天 09:30)
   * - 每周: 每周星期X的 HH:mm 发送
   * - 纪念日: 每年某月某日发送
   *
   * 防重复发送机制:
   * - 使用 last_sent_at 字段记录最后发送时间
   * - 根据频率检查是否在当前周期内已发送
   * - 每小时: 检查是否在同一小时内
   * - 每天: 检查是否在同一天
   * - 每周: 检查是否在同一周内
   * - 纪念日: 检查是否在同一年内
   */
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'scheduledEmails',
    timeZone: 'Asia/Shanghai',
  })
  async handleScheduledEmails() {
    const now = new Date();
    this.logger.log(`[${now.toLocaleString('zh-CN')}] 开始扫描邮件规则...`);

    try {
      // 1. 获取所有活跃的邮件规则
      const rules = await this.emailService.getActiveRules();

      if (rules.length === 0) {
        this.logger.debug('没有活跃的邮件规则');
        return;
      }

      this.logger.log(`找到 ${rules.length} 条邮件规则`);

      // 统计结果
      let triggeredCount = 0;
      let skippedCount = 0;
      let successCount = 0;
      let failCount = 0;

      // 2. 遍历规则,判断是否需要发送
      for (const rule of rules) {
        try {
          // 判断是否应该发送
          const shouldSend = this.shouldSendEmail(rule, now);

          if (!shouldSend) {
            skippedCount++;
            continue;
          }

          // 检查是否已发送过 (防重复)
          if (this.isAlreadySent(rule, now)) {
            this.logger.debug(`规则已在当前时间窗口发送过，跳过，ID: ${rule.id}`);
            skippedCount++;
            continue;
          }

          // 应该发送,创建实例并执行发送
          triggeredCount++;
          this.logger.log(
            `规则触发发送，ID: ${rule.id}, 收件人: ${rule.to_email}, 频率: ${rule.frequency}`,
          );

          const success = await this.processRule(rule, now);

          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          this.logger.error(
            `处理规则失败，ID: ${rule.id}, 错误: ${error.message}`,
            error.stack,
          );
          failCount++;
        }
      }

      // 输出统计结果
      this.logger.log(
        `规则扫描完成，触发: ${triggeredCount}, 跳过: ${skippedCount}, 成功: ${successCount}, 失败: ${failCount}, 总计: ${rules.length}`,
      );
    } catch (error) {
      this.logger.error('定时任务执行失败', error.stack);
    }
  }

  /**
   * 处理单条规则
   * 1. 创建发送实例
   * 2. 执行发送
   * 3. 更新规则状态
   */
  private async processRule(rule: ScheduledEmail, now: Date): Promise<boolean> {
    // 1. 创建发送实例
    const instance = await this.emailService.createEmailInstance(rule, now);

    // 2. 执行发送
    const success = await this.emailService.sendEmail(instance);

    // 3. 发送成功后更新规则状态
    if (success) {
      await this.emailService.updateRuleAfterSent(rule.id, now);
    }

    return success;
  }

  /**
   * 判断规则是否应该在当前时间发送
   */
  private shouldSendEmail(rule: ScheduledEmail, now: Date): boolean {
    switch (rule.frequency) {
      case ScheduleFrequency.ONCE:
        return this.checkOnce(rule, now);

      case ScheduleFrequency.HOURLY:
        return this.checkHourly(rule, now);

      case ScheduleFrequency.DAILY:
        return this.checkDaily(rule, now);

      case ScheduleFrequency.WEEKLY:
        return this.checkWeekly(rule, now);

      case ScheduleFrequency.ANNIVERSARY:
        return this.checkAnniversary(rule, now);

      default:
        return false;
    }
  }

  /**
   * 单次发送判断
   * 规则: send_time <= now 且未发送过
   */
  private checkOnce(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const isTimeReached = sendTime <= now;
    const notSentYet = !rule.last_sent_at;

    return isTimeReached && notSentYet;
  }

  /**
   * 每小时发送判断
   * 规则: 每小时的第 X 分钟发送
   *
   * 例子: send_time = "2024-01-01 00:30:00"
   * 含义: 每小时第30分钟发送 (00:30, 01:30, 02:30...)
   * 判断: 当前分钟是否为30,且秒数<10 (避免同一分钟重复触发)
   */
  private checkHourly(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const targetMinute = sendTime.getMinutes();

    // 检查当前分钟是否匹配
    const currentMinute = now.getMinutes();
    const isRightMinute = currentMinute === targetMinute;

    // 检查当前秒数,避免同一分钟重复触发
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightMinute && isStartOfMinute;
  }

  /**
   * 每天发送判断
   * 规则: 每天的 HH:mm 发送
   *
   * 例子: send_time = "2024-01-01 09:30:00"
   * 含义: 每天早上9:30发送
   * 判断: 当前时间是否匹配9:30,且秒数<10
   */
  private checkDaily(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const targetHour = sendTime.getHours();
    const targetMinute = sendTime.getMinutes();

    // 检查当前时分是否匹配
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isRightTime = currentHour === targetHour && currentMinute === targetMinute;

    // 检查当前秒数
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightTime && isStartOfMinute;
  }

  /**
   * 每周发送判断
   * 规则: 每周星期X的 HH:mm 发送
   *
   * 例子: week_day = 1, send_time = "2024-01-01 09:30:00"
   * 含义: 每周一早上9:30发送
   * 判断: 今天是周一且时间匹配,且秒数<10
   */
  private checkWeekly(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time || !rule.week_day) return false;

    const sendTime = new Date(rule.send_time);
    const targetHour = sendTime.getHours();
    const targetMinute = sendTime.getMinutes();

    // 检查星期几 (0=周日, 1=周一, ..., 6=周六)
    const currentDay = now.getDay();
    // 将我们的1-7映射到JS的0-6 (1=周一, ..., 7=周日)
    const targetDay = rule.week_day === 7 ? 0 : rule.week_day;
    const isRightDay = currentDay === targetDay;

    // 检查时间
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isRightTime = currentHour === targetHour && currentMinute === targetMinute;

    // 检查秒数
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightDay && isRightTime && isStartOfMinute;
  }

  /**
   * 纪念日发送判断
   * 规则: 每年某月某日发送
   *
   * 例子: anniversary_month = 5, anniversary_day = 20
   * 含义: 每年5月20日发送
   * 判断: 今天是5月20日,且今年未发送过
   */
  private checkAnniversary(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.anniversary_month || !rule.anniversary_day) return false;

    // 检查月日是否匹配
    const currentMonth = now.getMonth() + 1; // 0-11 -> 1-12
    const currentDay = now.getDate();
    const isRightDay = currentMonth === rule.anniversary_month && currentDay === rule.anniversary_day;

    if (!isRightDay) return false;

    // 检查时间 (如果有配置)
    if (rule.send_time) {
      const sendTime = new Date(rule.send_time);
      const targetHour = sendTime.getHours();
      const targetMinute = sendTime.getMinutes();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const isRightTime = currentHour === targetHour && currentMinute === targetMinute;

      if (!isRightTime) return false;
    }

    // 检查当前秒数
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isStartOfMinute;
  }

  /**
   * 防重复发送检查
   *
   * 原理: 使用 last_sent_at 记录最后发送时间,检查是否在当前周期内已发送
   *
   * 例子:
   * - 每小时任务: 如果 last_sent_at 在当前小时内,则跳过
   * - 每天任务: 如果 last_sent_at 在今天,则跳过
   * - 每周任务: 如果 last_sent_at 在本周内,则跳过
   * - 纪念日任务: 如果 last_sent_at 在今年,则跳过
   */
  private isAlreadySent(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.last_sent_at) return false;

    const lastSent = new Date(rule.last_sent_at);

    switch (rule.frequency) {
      case ScheduleFrequency.HOURLY:
        return this.isSameHour(lastSent, now);

      case ScheduleFrequency.DAILY:
        return this.isSameDay(lastSent, now);

      case ScheduleFrequency.WEEKLY:
        return this.isSameWeek(lastSent, now);

      case ScheduleFrequency.ANNIVERSARY:
        return this.isSameYear(lastSent, now);

      default:
        return false;
    }
  }

  /**
   * 判断是否在同一小时内
   */
  private isSameHour(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours()
    );
  }

  /**
   * 判断是否在同一天
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * 判断是否在同一周内
   * 简单实现: 检查两个日期的周一是否相同
   */
  private isSameWeek(date1: Date, date2: Date): boolean {
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 周一作为一周的开始
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    return getWeekStart(date1).getTime() === getWeekStart(date2).getTime();
  }

  /**
   * 判断是否在同一年
   */
  private isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear();
  }

  /**
   * 每小时清理一次已发送的旧邮件（可选）
   *
   * 这个任务演示如何添加多个定时任务
   * 可根据实际需求开启或关闭
   *
   * Cron 表达式：0 0 * * * * - 每小时的第 0 分第 0 秒执行
   */
  // @Cron(CronExpression.EVERY_HOUR)
  // async cleanupOldEmails() {
  //   this.logger.log('开始清理旧邮件...');
  //
  //   // 删除 30 天前已发送的邮件
  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  //
  //   // 实现清理逻辑
  //   // await this.emailService.deleteOldSentEmails(thirtyDaysAgo);
  //
  //   this.logger.log('旧邮件清理完成');
  // }
}
