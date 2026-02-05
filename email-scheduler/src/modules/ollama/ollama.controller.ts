import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { OllamaService, OllamaGenerateRequest } from './ollama.service';
import { ApiTags, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

class GenerateTextDto {
  @ApiProperty({ description: '提示词' })
  prompt: string;

  @ApiProperty({ description: '模型名称', required: false })
  model?: string;

  @ApiProperty({ description: '温度参数 (0-1)', required: false })
  temperature?: number;

  @ApiProperty({ description: '最大生成 token 数', required: false })
  max_tokens?: number;
}

@ApiTags('Ollama AI')
@Controller('ollama')
export class OllamaController {
  private readonly logger = new Logger(OllamaController.name);

  constructor(private readonly ollamaService: OllamaService) {}

  @Post('generate')
  @ApiOperation({ summary: '生成文本' })
  @ApiResponse({ status: 200, description: '生成成功' })
  @ApiResponse({ status: 500, description: '生成失败' })
  async generateText(@Body() dto: GenerateTextDto) {
    this.logger.log(`Generating text with prompt: ${dto.prompt.substring(0, 50)}...`);
    
    const result = await this.ollamaService.generateText(dto.prompt, {
      model: dto.model,
      options: {
        temperature: dto.temperature,
        max_tokens: dto.max_tokens,
      },
    });

    return { data: result, success: true };
  }

  @Get('health')
  @ApiOperation({ summary: '检查 Ollama 服务健康状态' })
  @ApiResponse({ status: 200, description: '健康状态' })
  async checkHealth() {
    const isHealthy = await this.ollamaService.checkHealth();
    return { status: isHealthy ? 'healthy' : 'unhealthy' };
  }

  @Get('models')
  @ApiOperation({ summary: '获取可用模型列表' })
  @ApiResponse({ status: 200, description: '模型列表' })
  async getModels() {
    const models = await this.ollamaService.getModels();
    return { models };
  }
}
