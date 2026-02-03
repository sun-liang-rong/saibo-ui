import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParseVideoDto {
  @ApiProperty({
    description: '抖音分享链接',
    example: 'https://v.douyin.com/xxxxx/',
  })
  @IsString()
  @IsNotEmpty({ message: '分享链接不能为空' })
  url: string;
}

export class VideoInfoDto {
  @ApiProperty({ description: '视频标题' })
  title: string;

  @ApiProperty({ description: '作者昵称' })
  author: string;

  @ApiProperty({ description: '作者头像' })
  authorAvatar: string;

  @ApiProperty({ description: '视频封面' })
  cover: string;

  @ApiProperty({ description: '无水印视频地址' })
  videoUrl: string;

  @ApiProperty({ description: '视频ID' })
  awemeId: string;

  @ApiProperty({ description: '视频时长（秒）', required: false })
  duration?: number;

  @ApiProperty({ description: '点赞数', required: false })
  diggCount?: number;

  @ApiProperty({ description: '评论数', required: false })
  commentCount?: number;

  @ApiProperty({ description: '分享数', required: false })
  shareCount?: number;
}

export class ParseVideoResponseDto {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  @ApiProperty({ description: '视频信息', required: false })
  data?: VideoInfoDto;

  @ApiProperty({ description: '错误信息', required: false })
  error?: string;
}
