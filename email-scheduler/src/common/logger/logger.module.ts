import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * 全局日志模块
 *
 * 为什么设计为全局模块：
 * - 所有模块都需要使用日志功能
 * - 使用 @Global() 装饰器后，其他模块无需导入即可使用
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
