import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskService } from './schedule-task.service';
import { EmailModule } from '../email/email.module';

/**
 * 定时任务模块
 *
 * 模块职责：
 * 1. 管理 @nestjs/schedule 定时任务
 * 2. 导入 EmailModule 以使用 EmailService
 * 3. 注册 ScheduleTaskService，启用定时任务
 *
 * 为什么需要单独的模块：
 * - 将定时任务逻辑与业务逻辑分离
 * - 便于管理和维护定时任务
 * - 可以独立启停定时任务
 */
@Module({
  imports: [EmailModule],
  providers: [ScheduleTaskService],
  exports: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
