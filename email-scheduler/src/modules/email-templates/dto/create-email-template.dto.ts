import { IsNotEmpty, IsString, IsEmail, IsEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailTemplateDto {
  @ApiProperty({ description: '邮件主题' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: '邮件内容' })
  @IsOptional()
  body: string;

  @ApiProperty({ description: '模版类型', enum: ['weather', 'news', 'gold', 'custom'], default: 'custom' })
  @IsString()
  @IsIn(['weather', 'news', 'gold', 'custom'])
  @IsOptional()
  type: string;

  @ApiProperty({ description: '收件人邮箱' })
  @IsEmail()
  @IsNotEmpty()
  to_email: string;
}
