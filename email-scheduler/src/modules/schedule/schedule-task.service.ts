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
   * 主调度任务 - 定时扫描邮件规则并发送
   *
   * 执行频率: 每分钟执行一次 (CronExpression.EVERY_MINUTE)
   * 时区: 使用服务器时间
   *
   * 核心执行流程:
   * 1. 从数据库获取所有活跃规则 (is_rule = true 且 status != sent)
   * 2. 遍历每条规则,判断是否应该在当前分钟发送
   * 3. 防重复检查: 基于频率判断是否在本周期内已发送过
   * 4. 如果需要发送,创建实例记录并执行发送
   * 5. 发送成功后更新规则的 last_sent_at 和 next_send_at
   *
   * 容错机制:
   * - 单条规则处理失败不影响其他规则
   * - 所有异常都会被捕获并记录日志
   * - 最终输出统计信息便于监控
   */
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'scheduledEmails',
  })
  async handleScheduledEmails() {
    this.handlerSendEmails()
  }

  async handlerSendEmails() {
    // 记录当前执行时间,便于日志追踪
    const now = new Date();
    this.logger.log(`[${now.toLocaleString('zh-CN')}] 开始扫描邮件规则...`);

    try {
      // 第一步: 获取所有活跃的邮件规则
      // 查询条件: is_rule = true (只要规则,不要实例)
      //           status != 'sent' (只要活跃规则,已完成的单次规则除外)
      const rules = await this.emailService.getActiveRules();

      // 如果没有规则,直接返回
      if (rules.length === 0) {
        this.logger.debug('没有活跃的邮件规则');
        return;
      }

      this.logger.log(`找到 ${rules.length} 条邮件规则`);
      // 第二步: 初始化统计计数器
      let triggeredCount = 0;  // 触发发送的规则数
      let skippedCount = 0;    // 跳过的规则数 (时间未到或已发送)
      let successCount = 0;    // 发送成功数
      let failCount = 0;       // 发送失败数
      // 第三步: 遍历所有规则,逐个判断并处理
      for (const rule of rules) {
        try {
          // 3.1 判断是否应该在当前时间发送
          // 根据规则频率 (每小时/每天/每周/纪念日) 判断当前时间是否匹配
          const shouldSend = this.shouldSendEmail(rule, now);

          if (!shouldSend) {
            // 时间未到,跳过此规则
            skippedCount++;
            continue;
          }
          // 3.2 防重复发送检查
          // 检查该规则在本周期内是否已发送过
          // 例如: 每天任务在今天已发送过,则跳过
          if (this.isAlreadySent(rule, now)) {
            this.logger.debug(`规则已在当前时间窗口发送过，跳过，ID: ${rule.id}`);
            skippedCount++;
            continue;
          }
          // 3.3 创建实例并执行发送
          triggeredCount++;
          this.logger.log(
            `规则触发发送，ID: ${rule.id}, 收件人: ${rule.to_email}, 频率: ${rule.frequency}`,
          );

          // 处理规则: 创建实例 -> 发送邮件 -> 更新规则状态
          const success = await this.processRule(rule, now);

          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          // 3.4 错误处理
          // 单条规则失败不影响其他规则,记录错误并继续
          this.logger.error(
            `处理规则失败，ID: ${rule.id}, 错误: ${error.message}`,
            error.stack,
          );
          failCount++;
        }
      }
      // 第四步: 输出统计结果
      this.logger.log(
        `规则扫描完成，触发: ${triggeredCount}, 跳过: ${skippedCount}, 成功: ${successCount}, 失败: ${failCount}, 总计: ${rules.length}`,
      );
    } catch (error) {
      // 整个定时任务的异常捕获
      this.logger.error('定时任务执行失败', error.stack);
    }
  }

  /**
   * 处理单条规则的完整发送流程
   *
   * 执行步骤:
   * 1. 创建发送实例: 在数据库中创建一条 is_rule=false 的记录
   * 2. 更新规则状态: 创建实例后立即更新 last_sent_at，防止重复触发
   * 3. 执行邮件发送: 调用邮件服务发送邮件
   *
   * @param rule - 要处理的邮件规则
   * @param now - 当前时间
   * @returns 发送是否成功
   */
  private async processRule(rule: ScheduledEmail, now: Date): Promise<boolean> {
    // 第一步: 创建发送实例
    // 实例记录特点:
    // - is_rule = false (标识这是实例,不是规则)
    // - parent_id = rule.id (指向父规则)
    // - send_time = now (实际发送时间)
    // - status = 'pending' (待发送状态)
    const instance = await this.emailService.createEmailInstance(rule, now);

    // 第二步: 立即更新规则状态
    // 关键修改: 在发送之前更新规则状态,防止因发送耗时或失败导致规则被重复扫描
    // 规则的任务是"生成实例",一旦实例生成,规则的本周期任务即算完成
    // 更新规则:
    // - last_sent_at = now (记录最后发送时间,用于防重复)
    // - next_send_at = 计算下次发送时间 (用于优化查询)
    // - status = 'sent' (如果是单次任务,标记为已完成)
    await this.emailService.updateRuleAfterSent(rule.id, now);

    // 第三步: 执行邮件发送
    // 发送成功后会:
    // - 更新实例的 status = 'sent'
    // - 更新实例的 sent_at = now
    // - 如果发送失败,会更新 error_message 并进行重试
    const success = await this.emailService.sendEmail(instance);

    return success;
  }

  /**
   * 判断规则是否应该在当前时间发送
   *
   * 根据规则频率调用对应的检查方法:
   * - ONCE: 单次发送,检查时间是否到达且未发送过
   * - HOURLY: 每小时发送,检查当前分钟是否匹配
   * - DAILY: 每天发送,检查当前时分是否匹配
   * - WEEKLY: 每周发送,检查星期和时分是否匹配
   * - ANNIVERSARY: 纪念日发送,检查月日是否匹配
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
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
        // 未知频率,不发送
        return false;
    }
  }

  /**
   * 单次发送检查
   *
   * 判断逻辑:
   * - 配置的发送时间已经到达 (send_time <= now)
   * - 且从未发送过 (last_sent_at 为空)
   *
   * 示例:
   * - 规则配置: send_time = "2024-01-01 10:00:00"
   * - 当前时间: 2024-01-01 10:05:00
   * - last_sent_at: null
   * - 结果: 应该发送 ✅
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
   */
  private checkOnce(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const isTimeReached = sendTime <= now;       // 时间已到
    const notSentYet = !rule.last_sent_at;        // 未发送过

    return isTimeReached && notSentYet;
  }

  /**
   * 每小时发送检查
   *
   * 判断逻辑:
   * - 从 send_time 中提取分钟数 (如 00:30:00 -> 30)
   * - 检查当前分钟是否匹配
   * - 检查当前秒数是否 < 10 (避免同一分钟内多次触发)
   *
   * 示例:
   * - 规则配置: send_time = "2024-01-01 00:30:00" (注意:只取分钟30)
   * - 当前时间: 2024-01-01 10:30:05
   * - 当前分钟: 30 ✅ 匹配
   * - 当前秒数: 5 (< 10) ✅ 在时间窗口内
   * - 结果: 应该发送 ✅
   *
   * 关键点:
   * - send_time 的日期部分不重要,重要的是分钟数
   * - 秒数 < 10 确保每分钟只触发一次 (0-9秒之间)
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
   */
  private checkHourly(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const targetMinute = sendTime.getMinutes();   // 目标分钟数 (0-59)

    // 检查当前分钟是否匹配
    const currentMinute = now.getMinutes();
    const isRightMinute = currentMinute === targetMinute;

    // 检查当前秒数,确保只在每分钟的前10秒触发一次
    // 这样可以避免在同一分钟内多次触发
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightMinute && isStartOfMinute;
  }

  /**
   * 每天发送检查
   *
   * 判断逻辑:
   * - 从 send_time 中提取小时和分钟 (如 09:30:00 -> 9:30)
   * - 检查当前时间的时分是否匹配
   * - 检查当前秒数是否 < 10 (避免同一分钟内多次触发)
   *
   * 示例:
   * - 规则配置: send_time = "2024-01-01 09:30:00" (每天9:30发送)
   * - 当前时间: 2024-01-02 09:30:05
   * - 当前时分: 9:30 ✅ 匹配
   * - 当前秒数: 5 (< 10) ✅ 在时间窗口内
   * - 结果: 应该发送 ✅
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
   */
  private checkDaily(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time) return false;

    const sendTime = new Date(rule.send_time);
    const targetHour = sendTime.getHours();       // 目标小时 (0-23)
    const targetMinute = sendTime.getMinutes();   // 目标分钟 (0-59)

    // 检查当前时分是否匹配
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isRightTime = currentHour === targetHour && currentMinute === targetMinute;

    // 检查当前秒数,确保只在每分钟的前10秒触发一次
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightTime && isStartOfMinute;
  }

  /**
   * 每周发送检查
   *
   * 判断逻辑:
   * - 检查今天是星期几 (由 week_day 字段指定,1-7对应周一到周日)
   * - 检查当前时分是否匹配 send_time 中的时分
   * - 检查当前秒数是否 < 10
   *
   * 示例:
   * - 规则配置: week_day = 1 (周一), send_time = "2024-01-01 09:30:00"
   * - 当前时间: 2024-01-08 (周一) 09:30:05
   * - 今天是周一: ✅ 匹配
   * - 当前时分: 9:30 ✅ 匹配
   * - 当前秒数: 5 (< 10) ✅ 在时间窗口内
   * - 结果: 应该发送 ✅
   *
   * 注意:
   * - week_day: 1=周一, 2=周二, ..., 6=周六, 7=周日
   * - JS Date.getDay(): 0=周日, 1=周一, ..., 6=周六
   * - 需要映射: 7 -> 0, 其他保持不变
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
   */
  private checkWeekly(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.send_time || !rule.week_day) return false;

    const sendTime = new Date(rule.send_time);
    const targetHour = sendTime.getHours();       // 目标小时
    const targetMinute = sendTime.getMinutes();   // 目标分钟

    // 检查星期几 (0=周日, 1=周一, ..., 6=周六)
    const currentDay = now.getDay();
    // 将我们的1-7映射到JS的0-6 (1=周一, ..., 7=周日)
    const targetDay = rule.week_day === 7 ? 0 : rule.week_day;
    const isRightDay = currentDay === targetDay;

    // 检查时分是否匹配
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isRightTime = currentHour === targetHour && currentMinute === targetMinute;

    // 检查秒数
    const currentSecond = now.getSeconds();
    const isStartOfMinute = currentSecond < 10;

    return isRightDay && isRightTime && isStartOfMinute;
  }

  /**
   * 纪念日发送检查
   *
   * 判断逻辑:
   * - 检查今天的月日是否匹配 anniversary_month 和 anniversary_day
   * - 如果配置了 send_time,还需检查时分是否匹配
   * - 检查当前秒数是否 < 10
   *
   * 示例1 (只有月日,没有时间):
   * - 规则配置: anniversary_month = 5, anniversary_day = 20, send_time = null
   * - 当前时间: 2024-05-20 任意时间
   * - 今天是5月20日: ✅ 匹配
   * - 结果: 应该发送 ✅
   *
   * 示例2 (月日+时间):
   * - 规则配置: anniversary_month = 5, anniversary_day = 20, send_time = "2024-01-01 09:30:00"
   * - 当前时间: 2024-05-20 09:30:05
   * - 今天是5月20日: ✅ 匹配
   * - 当前时分: 9:30 ✅ 匹配
   * - 结果: 应该发送 ✅
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否应该发送
   */
  private checkAnniversary(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.anniversary_month || !rule.anniversary_day) return false;

    // 检查月日是否匹配
    const currentMonth = now.getMonth() + 1; // 0-11 -> 1-12
    const currentDay = now.getDate();
    const isRightDay = currentMonth === rule.anniversary_month && currentDay === rule.anniversary_day;

    if (!isRightDay) return false;

    // 检查时间 (如果配置了具体时间)
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
   * 核心原理:
   * 使用 last_sent_at 字段记录规则最后发送时间,检查是否在当前周期内已发送过
   *
   * 周期定义:
   * - 每小时: 如果 last_sent_at 在当前小时内,则跳过
   * - 每天: 如果 last_sent_at 在今天,则跳过
   * - 每周: 如果 last_sent_at 在本周内,则跳过
   * - 纪念日: 如果 last_sent_at 在今年,则跳过
   *
   * 示例 (每天任务):
   * - 规则: 每天早上9:30发送
   * - last_sent_at: 2024-01-01 09:30:05
   * - 当前时间: 2024-01-01 10:00:00
   * - 判断: last_sent_at 在今天 ✅ 已经发送过,跳过
   *
   * 示例2 (服务重启场景):
   * - 规则: 每天早上9:30发送
   * - last_sent_at: 2024-01-01 09:30:05
   * - 服务在 2024-01-02 09:35 重启
   * - 当前时间: 2024-01-02 09:35:10
   * - 判断: last_sent_at 是昨天 ❌ 本周期未发送,应该触发
   *        但时间已经过了9:30,所以 shouldSendEmail 会返回 false
   *
   * @param rule - 邮件规则
   * @param now - 当前时间
   * @returns 是否已在当前周期发送过
   */
  private isAlreadySent(rule: ScheduledEmail, now: Date): boolean {
    if (!rule.last_sent_at) return false;  // 从未发送过

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
   * 判断两个时间是否在同一小时
   *
   * 示例:
   * - date1: 2024-01-01 10:30:00
   * - date2: 2024-01-01 10:45:00
   * - 结果: true ✅ (同一天同一小时)
   *
   * @param date1 - 时间1
   * @param date2 - 时间2
   * @returns 是否在同一小时
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
   * 判断两个时间是否在同一天
   *
   * 示例:
   * - date1: 2024-01-01 10:30:00
   * - date2: 2024-01-01 23:59:59
   * - 结果: true ✅ (同一天)
   *
   * @param date1 - 时间1
   * @param date2 - 时间2
   * @returns 是否在同一天
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * 判断两个时间是否在同一周内
   *
   * 实现原理:
   * - 找到两个日期各自所在周的周一
   * - 比较两个周一是否是同一天
   *
   * 示例:
   * - date1: 2024-01-08 (周一)
   * - date2: 2024-01-14 (周日)
   * - 结果: true ✅ (同一周)
   *
   * @param date1 - 时间1
   * @param date2 - 时间2
   * @returns 是否在同一周内
   */
  private isSameWeek(date1: Date, date2: Date): boolean {
    // 计算某日期所在周的周一
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();  // 0=周日, 1=周一, ..., 6=周六
      // 计算到周一的差值
      // 如果是周日(0),需要回退6天到上一个周一
      // 如果是周一(1),差值为0
      // 如果是周二(2),差值为-1
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);  // 清空时分秒,只保留日期
      return d;
    };

    // 比较两个周一是否相同
    return getWeekStart(date1).getTime() === getWeekStart(date2).getTime();
  }

  /**
   * 判断两个时间是否在同一年
   *
   * 示例:
   * - date1: 2024-01-01 00:00:00
   * - date2: 2024-12-31 23:59:59
   * - 结果: true ✅ (同一年)
   *
   * @param date1 - 时间1
   * @param date2 - 时间2
   * @returns 是否在同一年
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
