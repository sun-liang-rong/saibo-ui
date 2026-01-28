import { EmailStatus, ScheduleFrequency } from '../entities/scheduled-email.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 邮件响应 DTO
 *
 * 用于返回邮件数据给前端
 * 包含规则和实例的所有字段
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
    description: '发送时间 (规则存配置时间,实例存实际发送时间)',
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

  @ApiPropertyOptional({
    description: '错误信息',
    example: 'SMTP connection timeout',
  })
  error_message: string | null;

  @ApiPropertyOptional({
    description: '实际发送时间 (仅实例使用)',
    example: '2024-12-31T10:30:05Z',
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
    description: '父规则ID (实例指向规则,规则为null)',
    example: 1,
  })
  parent_id: number | null;

  @ApiProperty({
    description: '是否为规则记录 (true=规则, false=实例)',
    example: true,
  })
  is_rule: boolean;

  @ApiPropertyOptional({
    description: '最后发送时间 (仅规则使用,防重复发送)',
    example: '2024-12-31T10:30:05Z',
  })
  last_sent_at: Date | null;

  @ApiPropertyOptional({
    description: '下次预计发送时间 (仅规则使用)',
    example: '2025-01-01T10:30:00Z',
  })
  next_send_at: Date | null;

  @ApiPropertyOptional({
    description: '纪念日月份 (1-12, 仅anniversary频率使用)',
    example: 5,
  })
  anniversary_month: number | null;

  @ApiPropertyOptional({
    description: '纪念日日期 (1-31, 仅anniversary频率使用)',
    example: 20,
  })
  anniversary_day: number | null;

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

  @ApiPropertyOptional({
    description: '模板分类',
    example: 'greeting',
  })
  template_category: string | null;

  @ApiPropertyOptional({
    description: '模板ID (用于标识使用了哪个模板)',
    example: '1',
  })
  template_id: string | null;

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
