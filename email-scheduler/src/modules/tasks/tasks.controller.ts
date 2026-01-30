import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: '创建定时任务' })
  create(@Request() req, @Body() createDto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有定时任务' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: '每页数量' })
  findAll(@Request() req, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.tasksService.findAll(req.user.id, page, pageSize);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑定时任务' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
    return this.tasksService.update(+id, req.user.id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除定时任务' })
  remove(@Request() req, @Param('id') id: string) {
    return this.tasksService.remove(+id, req.user.id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: '启动定时任务' })
  start(@Request() req, @Param('id') id: string) {
    return this.tasksService.start(+id, req.user.id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: '暂停定时任务' })
  pause(@Request() req, @Param('id') id: string) {
    return this.tasksService.pause(+id, req.user.id);
  }
}
