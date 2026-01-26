import { EmailStatus, ScheduleFrequency } from '../entities/scheduled-email.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 邮件响应 DTO
 *
 * 用于返回邮件数据给前端
 * 不包含敏感信息，只包含必要的业务数据
 */
export class EmailResponseDto {
  @ApiProperty({
    description: '邮件ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '收件人邮箱',
    example: 'user@example.com',
  })
  to_email: string;

  @ApiProperty({
    description: '邮件标题',
    example: '欢迎使用定时邮件服务',
  })
  subject: string;

  @ApiProperty({
    description: '邮件内容',
    example: '<h1>您好！</h1><p>这是一封测试邮件。</p>',
  })
  content: string;

  @ApiProperty({
    description: '定时发送时间',
    example: '2024-12-31T10:30:00Z',
  })
  send_time: Date;

  @ApiProperty({
    description: '发送状态',
    enum: EmailStatus,
    example: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @ApiProperty({
    description: '重试次数',
    example: 0,
  })
  retry_count: number;

  @ApiProperty({
    description: '错误信息',
    example: 'SMTP connection timeout',
    required: false,
  })
  error_message: string | null;

  @ApiProperty({
    description: '实际发送时间',
    example: '2024-12-31T10:30:05Z',
    required: false,
  })
  sent_at: Date | null;

  @ApiProperty({
    description: '调度频率',
    enum: ScheduleFrequency,
    example: ScheduleFrequency.ONCE,
  })
  frequency: ScheduleFrequency;

  @ApiPropertyOptional({
    description: '星期几（1-7，仅当 frequency 为 weekly 时有值）',
    example: 1,
  })
  week_day: number | null;

  @ApiPropertyOptional({
    description: '父任务 ID',
    example: 1,
  })
  parent_id: number | null;

  @ApiProperty({
    description: '是否包含今日天气信息',
    example: false,
  })
  include_weather: boolean;

  @ApiPropertyOptional({
    description: '天气查询城市',
    example: '北京',
  })
  weather_city: string | null;

  @ApiProperty({
    description: '创建时间',
    example: '2024-12-30T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-12-30T10:00:00Z',
  })
  updated_at: Date;
}
