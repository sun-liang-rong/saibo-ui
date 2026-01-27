import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledEmail } from '../email/entities/scheduled-email.entity';
import { EmailStatus } from '../../modules/email/entities/scheduled-email.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * 健康检查控制器
 *
 * 提供系统健康状态查询接口：
 * - GET /health - 基础健康检查
 * - GET /health/stats - 邮件任务统计信息
 *
 * 所有接口都需要 JWT 认证
 */
@ApiTags('health')
@ApiBearerAuth('JWT-auth') // 添加 Swagger JWT 认证标识
@Controller('health')
@UseGuards(JwtAuthGuard) // 全局应用 JWT 认证守卫
export class HealthController {
  constructor(
    @InjectRepository(ScheduledEmail)
    private emailRepository: Repository<ScheduledEmail>,
  ) {}

  /**
   * 基础健康检查
   *
   * GET /health
   *
   * 返回系统状态
   */
  @Get()
  @ApiOperation({ summary: '健康检查' })
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * 邮件任务统计
   *
   * GET /health/stats
   *
   * 返回邮件任务的统计信息：
   * - 总数
   * - 待发送数量
   * - 已发送数量
   * - 失败数量
   * - 重试中数量
   */
  @Get('stats')
  @ApiOperation({ summary: '获取邮件任务统计信息' })
  async getStats() {
    const total = await this.emailRepository.count();
    const pending = await this.emailRepository.count({ where: { status: EmailStatus.PENDING } });
    const sent = await this.emailRepository.count({ where: { status: EmailStatus.SENT } });
    const failed = await this.emailRepository.count({ where: { status: EmailStatus.FAILED } });
    const retrying = await this.emailRepository.count({ where: { status: EmailStatus.RETRYING } });

    return {
      total,
      pending,
      sent,
      failed,
      retrying,
      timestamp: new Date().toISOString(),
    };
  }
}
