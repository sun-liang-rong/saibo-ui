import { IsEmail, IsNotEmpty, IsString, IsDateString, MaxLength, IsOptional, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleFrequency } from '../entities/scheduled-email.entity';

/**
 * 创建邮件规则的 DTO
 *
 * 使用 class-validator 进行数据验证
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

  @ApiPropertyOptional({
    description: '发送时间配置 (ISO 8601 格式)',
    example: '2024-12-31T10:30:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: '请输入有效的日期时间格式' })
  send_time?: string;

  @ApiPropertyOptional({
    description: '调度频率',
    enum: ScheduleFrequency,
    example: ScheduleFrequency.ONCE,
    default: ScheduleFrequency.ONCE,
  })
  @IsOptional()
  @IsEnum(ScheduleFrequency, { message: '调度频率必须是 once、hourly、daily、weekly 或 anniversary' })
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
    description: '纪念日月份 (1-12, 仅当 frequency 为 anniversary 时有效)',
    example: 5,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @IsInt({ message: '纪念日月份必须是整数' })
  @Min(1, { message: '纪念日月份必须在 1-12 之间' })
  @Max(12, { message: '纪念日月份必须在 1-12 之间' })
  anniversary_month?: number;

  @ApiPropertyOptional({
    description: '纪念日日期 (1-31, 仅当 frequency 为 anniversary 时有效)',
    example: 20,
    minimum: 1,
    maximum: 31,
  })
  @IsOptional()
  @IsInt({ message: '纪念日日期必须是整数' })
  @Min(1, { message: '纪念日日期必须在 1-31 之间' })
  @Max(31, { message: '纪念日日期必须在 1-31 之间' })
  anniversary_day?: number;

  @ApiPropertyOptional({
    description: '是否包含今日天气信息',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: '是否包含天气必须是布尔值' })
  include_weather?: boolean;

  @ApiPropertyOptional({
    description: '天气查询城市（当 include_weather 为 true 时必填）',
    example: '北京',
  })
  @IsOptional()
  @IsString()
  weather_city?: string;

  @ApiPropertyOptional({
    description: '模板分类（如: greeting, birthday, reminder 等）',
    example: 'greeting',
  })
  @IsOptional()
  @IsString({ message: '模板分类必须是字符串' })
  @MaxLength(50, { message: '模板分类不能超过50个字符' })
  template_category?: string;

  @ApiPropertyOptional({
    description: '模板ID (用于标识使用了哪个模板)',
    example: 1,
  })
  @IsOptional()
  @IsString({ message: '模板ID必须是字符串' })
  template_id?: string;
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

  @ApiPropertyOptional({
    description: '搜索关键词 (同时搜索标题和收件人)',
    example: 'test',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
