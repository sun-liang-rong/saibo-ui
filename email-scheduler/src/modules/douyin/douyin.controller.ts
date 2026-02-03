import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { DouyinService } from './douyin.service';
import { ParseVideoDto, ParseVideoResponseDto, VideoInfoDto } from './dto/parse-video.dto';

@ApiTags('抖音去水印')
@Controller('douyin')
export class DouyinController {
  constructor(private readonly douyinService: DouyinService) {}

  @Post('parse')
  @ApiOperation({
    summary: '解析抖音分享链接',
    description: '解析抖音分享链接，返回无水印视频信息。支持短链（v.douyin.com）和长链（douyin.com/video）。',
  })
  @ApiBody({ type: ParseVideoDto })
  @ApiResponse({
    status: 200,
    description: '解析成功',
    type: ParseVideoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '链接格式错误或无法解析',
  })
  @ApiResponse({
    status: 404,
    description: '视频不存在或已被删除',
  })
  async parseVideo(@Body() parseVideoDto: ParseVideoDto): Promise<ParseVideoResponseDto> {
    try {
      const videoInfo = await this.douyinService.parseVideo(parseVideoDto.url);
      return {
        success: true,
        data: videoInfo,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        error: error.message || '解析失败',
      };
    }
  }

  @Get('video/:awemeId')
  @ApiOperation({
    summary: '通过视频ID获取视频信息',
    description: '直接通过 aweme_id 获取视频的无水印下载地址。',
  })
  @ApiParam({
    name: 'awemeId',
    description: '抖音视频ID',
    example: '7351234567890123456',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ParseVideoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '视频不存在或已被删除',
  })
  async getVideoById(@Param('awemeId') awemeId: string): Promise<ParseVideoResponseDto> {
    try {
      const videoInfo = await this.douyinService.getVideoById(awemeId);
      return {
        success: true,
        data: videoInfo,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        error: error.message || '获取视频信息失败',
      };
    }
  }

  @Post('batch-parse')
  @ApiOperation({
    summary: '批量解析抖音链接',
    description: '批量解析多个抖音分享链接，返回无水印视频信息列表。',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description: '抖音分享链接列表',
          example: ['https://v.douyin.com/xxxxx/', 'https://v.douyin.com/yyyyy/'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '批量解析完成',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/VideoInfoDto' },
        },
        failed: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              error: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async batchParseVideos(@Body('urls') urls: string[]): Promise<any> {
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new HttpException('请提供有效的链接列表', HttpStatus.BAD_REQUEST);
    }

    if (urls.length > 10) {
      throw new HttpException('单次最多解析 10 个链接', HttpStatus.BAD_REQUEST);
    }

    const results: VideoInfoDto[] = [];
    const failed: { url: string; error: string }[] = [];

    // 串行处理，避免触发频率限制
    for (const url of urls) {
      try {
        const videoInfo = await this.douyinService.parseVideo(url);
        results.push(videoInfo);
      } catch (error) {
        failed.push({
          url,
          error: error.message || '解析失败',
        });
      }
    }

    return {
      success: true,
      data: results,
      failed,
      total: urls.length,
      successCount: results.length,
      failedCount: failed.length,
    };
  }
}
