import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledEmail } from '../email/entities/scheduled-email.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledEmail]),
    AuthModule, // 导入认证模块，以便使用 JWT 守卫
  ],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
