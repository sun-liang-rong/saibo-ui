import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

/**
 * 定时任务服务
 *
 * 使用 @nestjs/schedule 实现：
 * 1. Cron 表达式定时任务
 * 2. 自动扫描待发送的邮件
 * 3. 调用邮件服务发送邮件
 * 4. 更新邮件状态
 *
 * 为什么使用 Cron 而不是 BullMQ：
 * 初期方案：
 * - 简单易用，无需额外依赖 Redis
 * - 适合中小规模任务（每分钟几百封邮件）
 * - 开发和部署成本低
 *
 * 可扩展方案（BullMQ + Redis）：
 * - 大规模任务（每分钟几千封以上）
 * - 支持任务优先级
 * - 支持任务去重、延迟、重试等高级特性
 * - 需要额外部署 Redis
 */
@Injectable()
export class ScheduleTaskService {
  private readonly logger = new Logger(ScheduleTaskService.name);

  constructor(private readonly emailService: EmailService) {
    this.logger.log('定时任务服务初始化');
  }

  /**
   * 定时扫描并发送邮件
   *
   * Cron 表达式：每分钟执行一次
   * 格式：秒 分 时 日 月 周
   * 示例：0 * * * * * - 每分钟的第 0 秒执行
   *
   * 业务逻辑：
   * 1. 每分钟自动执行
   * 2. 扫描数据库中待发送的邮件
   * 3. 遍历邮件列表，逐个发送
   * 4. 记录发送结果
   *
   * 为什么使用 Cron 而不是 setInterval：
   * 1. Cron 表达式更灵活，可以精确控制执行时间
   * 2. NestJS 内置支持，与框架集成更好
   * 3. 支持持久化（未来可以扩展为分布式任务）
   * 4. 更好的日志和监控
   *
   * 性能考虑：
   * - 每分钟扫描一次，不会对数据库造成太大压力
   * - 使用索引查询，性能可控
   * - 如果邮件数量过多，可以改为每 30 秒或更短
   */
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'scheduledEmails',
    timeZone: 'Asia/Shanghai',
  })
  async handleScheduledEmails() {
    const now = new Date();
    this.logger.log(`[${now.toLocaleString('zh-CN')}] 开始扫描待发送的邮件任务...`);

    try {
      // 获取待发送的邮件列表
      // 查询条件已在 EmailService.getPendingEmails() 中实现
      this.logger.debug(`当前时间: ${now.toISOString()}`);
      const pendingEmails = await this.emailService.getPendingEmails();

      if (pendingEmails.length === 0) {
        this.logger.debug('没有待发送的邮件任务');
        return;
      }

      this.logger.log(`找到 ${pendingEmails.length} 个待发送的邮件任务`);

      // 统计发送结果
      let successCount = 0;
      let failCount = 0;

      // 遍历邮件列表，逐个发送
      // 使用 for...of 而不是 forEach，确保异步顺序执行
      for (const email of pendingEmails) {
        try {
          const success = await this.emailService.sendEmail(email);

          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          this.logger.error(
            `发送邮件失败，ID: ${email.id}, 错误: ${error.message}`,
            error.stack,
          );
          failCount++;
        }
      }

      // 输出统计结果
      this.logger.log(
        `邮件发送完成，成功: ${successCount}, 失败: ${failCount}, 总计: ${pendingEmails.length}`,
      );
    } catch (error) {
      this.logger.error('定时任务执行失败', error.stack);
    }
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
