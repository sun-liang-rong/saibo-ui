import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailService } from './mail.service';
import { ScheduledEmail } from './entities/scheduled-email.entity';
import { WeatherModule } from '../weather/weather.module';
import { AuthModule } from '../auth/auth.module';

/**
 * 邮件模块
 *
 * 模块职责：
 * 1. 管理邮件相关的控制器、服务、实体
 * 2. 配置 TypeORM 实体
 * 3. 导出 EmailService 供其他模块使用（如定时任务模块）
 * 4. 导入 AuthModule 以使用 JWT 认证守卫
 *
 * 为什么需要单独的模块：
 * - 模块化设计，职责清晰
 * - 便于维护和测试
 * - 可以独立导出和导入
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledEmail]),
    WeatherModule, // 导入天气模块
    AuthModule, // 导入认证模块，以便使用 JWT 守卫
  ],
  controllers: [EmailController],
  providers: [EmailService, MailService],
  exports: [EmailService, MailService], // 导出供其他模块使用
})
export class EmailModule {}
