import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { TimeoutError } from 'rxjs';

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly defaultTimeout: number;
  private readonly maxRetries: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get('OLLAMA_URL', 'http://localhost:11434');
    this.model = this.configService.get('OLLAMA_MODEL', 'llama2');
    this.defaultTimeout = this.configService.get<number>('OLLAMA_TIMEOUT', 60000);
    this.maxRetries = 3;
  }

  async generateText(prompt: string, options?: Partial<OllamaGenerateRequest>): Promise<string> {
    const request: OllamaGenerateRequest = {
      model: options?.model || this.model,
      prompt,
      stream: false
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`Generating text (attempt ${attempt}/${this.maxRetries})`);
        this.logger.debug(`Prompt: ${prompt.substring(0, 100)}...`);

        const response = await firstValueFrom(
          this.httpService.post<OllamaGenerateResponse>(
            `${this.baseUrl}/api/generate`,
            request,
          ).pipe(
            timeout({
              each: this.defaultTimeout,
            }),
            catchError((error: Error) => {
              if (error instanceof TimeoutError) {
                throw new InternalServerErrorException(
                  'Ollama 服务响应超时，请检查网络或增加超时时间',
                );
              }
              if (error instanceof AxiosError) {
                if (error.code === 'ECONNREFUSED') {
                  throw new InternalServerErrorException(
                    '无法连接到 Ollama 服务，请确保 Ollama 已启动并运行',
                  );
                }
                throw new InternalServerErrorException(
                  `Ollama API 调用失败: ${error.message}`,
                );
              }
              throw new InternalServerErrorException(
                `Ollama API 调用失败: ${error.message}`,
              );
            }),
          ),
        );
        console.log(response, 'response')
        const generatedText = (response as any).data?.response || '';
        this.logger.log(`Text generated successfully (${generatedText.length} chars)`);

        return generatedText;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Attempt ${attempt} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );

        if (attempt < this.maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000;
          this.logger.log(`Retrying in ${delayMs}ms...`);
          await this.sleep(delayMs);
        }
      }
    }

    this.logger.error(`All ${this.maxRetries} attempts failed`);
    throw new InternalServerErrorException(
      `AI 文本生成失败: ${lastError?.message || '未知错误'}`,
    );
  }

  async generateTextWithFallback(
    prompt: string,
    fallbackText: string,
    options?: Partial<OllamaGenerateRequest>,
  ): Promise<string> {
    try {
      return await this.generateText(prompt, options);
    } catch (error) {
      this.logger.warn(`AI generation failed, using fallback text: ${error.message}`);
      return fallbackText;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api/tags`).pipe(timeout({ each: 5000 })),
      );
      return true;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api/tags`).pipe(timeout({ each: 5000 })),
      );
      return (response as any).data?.models?.map((m: any) => m.name) || [];
    } catch (error) {
      this.logger.error('Failed to get models', error);
      return [];
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
