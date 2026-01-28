import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScheduleTaskService } from './schedule-task.service'

@ApiTags('schedule')
@Controller('schedule')
export class AppController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Get()
  @ApiOperation({ summary: '手动调用定时任务' })
  getHello(): object {
    return this.scheduleTaskService.handlerSendEmails()
  }
}
