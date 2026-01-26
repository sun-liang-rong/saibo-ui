import { Module } from '@nestjs/common';
import { HealthController } from './health.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledEmail } from '../email/entities/scheduled-email.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ScheduledEmail])],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
