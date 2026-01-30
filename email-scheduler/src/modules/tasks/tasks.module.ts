import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ScheduledTask } from './entities/scheduled-task.entity';
import { MailModule } from '../mail/mail.module';
import { LogsModule } from '../logs/logs.module';
import { EmailTemplatesModule } from '../email-templates/email-templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledTask]),
    MailModule,
    LogsModule,
    EmailTemplatesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
