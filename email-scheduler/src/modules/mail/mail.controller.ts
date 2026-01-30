import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('weather')
  @ApiOperation({ summary: '测试天气模板' })
  @ApiResponse({ status: 200, description: '返回天气模板HTML' })
  async testWeatherTemplate() {
    try {
      const html = await this.mailService.getWeatherTemplate();
      return {
        success: true,
        data: html
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('news')
  @ApiOperation({ summary: '测试新闻模板' })
  @ApiResponse({ status: 200, description: '返回新闻模板HTML' })
  async testNewsTemplate() {
    try {
      const html = await this.mailService.getNewsTemplate();
      return {
        success: true,
        data: html
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('gold')
  @ApiOperation({ summary: '测试黄金模板' })
  @ApiResponse({ status: 200, description: '返回黄金模板HTML' })
  async testGoldTemplate() {
    try {
      const html = await this.mailService.getGoldTemplate();
      return {
        success: true,
        data: html
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
