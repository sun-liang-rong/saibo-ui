import { IsEmail, IsNotEmpty, IsString, IsDateString, MaxLength, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleFrequency } from '../entities/scheduled-email.entity';

/**
 * 创建定时邮件任务的 DTO
 *
 * 使用 class-validator 进行数据验证：
 * - IsNotEmpty: 不能为空
 * - IsEmail: 必须是有效的邮箱格式
 * - IsString: 必须是字符串
 * - IsDateString: 必须是有效的日期格式
 * - MaxLength: 最大长度限制
 * - IsEnum: 必须是指定的枚举值
 * - IsInt: 必须是整数
 *
 * 为什么使用装饰器验证：
 * 1. 声明式验证，代码清晰
 * 2. 自动验证，在 Controller 层自动触发
 * 3. 错误信息自动返回，无需手动处理
 * 4. 支持 Swagger 自动生成 API 文档
 */
export class CreateEmailDto {
  @ApiProperty({
    description: '收件人邮箱地址',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '收件人邮箱不能为空' })
  to_email: string;

  @ApiProperty({
    description: '邮件标题',
    example: '欢迎使用定时邮件服务',
    maxLength: 500,
  })
  @IsString({ message: '邮件标题必须是字符串' })
  @IsNotEmpty({ message: '邮件标题不能为空' })
  @MaxLength(500, { message: '邮件标题不能超过500个字符' })
  subject: string;

  @ApiProperty({
    description: '邮件内容，支持 HTML 格式',
    example: '<h1>您好！</h1><p>这是一封测试邮件。</p>',
  })
  @IsString({ message: '邮件内容必须是字符串' })
  @IsNotEmpty({ message: '邮件内容不能为空' })
  content: string;

  @ApiProperty({
    description: '定时发送时间（ISO 8601 格式）',
    example: '2024-12-31T10:30:00Z',
  })
  @IsDateString({}, { message: '请输入有效的日期时间格式' })
  @IsNotEmpty({ message: '发送时间不能为空' })
  send_time: string;

  @ApiPropertyOptional({
    description: '调度频率',
    enum: ScheduleFrequency,
    example: ScheduleFrequency.ONCE,
    default: ScheduleFrequency.ONCE,
  })
  @IsOptional()
  @IsEnum(ScheduleFrequency, { message: '调度频率必须是 once、daily 或 weekly' })
  frequency?: ScheduleFrequency;

  @ApiPropertyOptional({
    description: '星期几（1-7，仅当 frequency 为 weekly 时有效）',
    example: 1,
    minimum: 1,
    maximum: 7,
  })
  @IsOptional()
  @IsInt({ message: '星期几必须是整数' })
  @Min(1, { message: '星期几必须在 1-7 之间' })
  @Max(7, { message: '星期几必须在 1-7 之间' })
  week_day?: number;

  @ApiPropertyOptional({
    description: '父任务 ID（用于周期性任务）',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: '父任务 ID 必须是整数' })
  parent_id?: number;

  @ApiPropertyOptional({
    description: '是否包含今日天气信息',
    example: false,
    default: false,
  })
  @IsOptional()
  include_weather?: boolean;

  @ApiPropertyOptional({
    description: '天气查询城市（当 include_weather 为 true 时必填）',
    example: '北京',
  })
  @IsOptional()
  weather_city?: string;
}

/**
 * 查询邮件列表的查询参数 DTO
 */
export class QueryEmailDto {
  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '邮件状态',
    enum: ['pending', 'sent', 'failed', 'retrying'],
    example: 'pending',
  })
  @IsOptional()
  status?: string;
}
