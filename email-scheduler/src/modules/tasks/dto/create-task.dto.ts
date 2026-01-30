import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: '邮件模板ID' })
  @IsNumber()
  @IsNotEmpty()
  email_template_id: number;

  @ApiProperty({ description: 'Cron表达式' })
  @IsString()
  @IsNotEmpty()
  schedule: string;
}
