import { IsNotEmpty, IsString, IsEmail, IsEmpty, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailTemplateDto {
  @ApiProperty({ description: '邮件主题' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: '邮件内容' })
  @IsOptional()
  body: string;

  @ApiProperty({ description: '模版类型', enum: ['weather', 'news', 'gold', 'douyin', 'moyu', 'custom', 'ai'], default: 'custom' })
  @IsString()
  @IsIn(['weather', 'news', 'gold', 'douyin', 'moyu', 'custom', 'ai'])
  @IsOptional()
  type: string;

  @ApiProperty({ description: '收件人邮箱' })
  @IsEmail()
  @IsNotEmpty()
  to_email: string;

  @ApiProperty({ description: 'AI 提示词', required: false })
  @IsString()
  @IsOptional()
  prompt: string;

  @ApiProperty({ description: '是否使用 AI 生成内容', default: false })
  @IsBoolean()
  @IsOptional()
  use_ai: boolean;
}
