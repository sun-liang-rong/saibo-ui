import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Winston 日志服务
 *
 * 为什么使用 Winston：
 * 1. 支持多种日志级别（error, warn, info, debug）
 * 2. 支持多种传输方式（文件、控制台）
 * 3. 日志格式化、时间戳、颜色输出
 * 4. 生产环境友好的日志管理
 *
 * 日志级别说明：
 * - error: 错误级别，需要立即关注
 * - warn: 警告级别，可能有问题
 * - info: 信息级别，一般流程信息
 * - debug: 调试级别，开发调试用
 * - verbose: 详细级别，更详细的调试信息
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      // 日志级别
      level: process.env.LOG_LEVEL || 'info',

      // 日志格式
      format: winston.format.combine(
        // 添加时间戳
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // 添加颜色
        winston.format.colorize(),
        // 自定义格式
        winston.format.printf(({ timestamp, level, message, context, trace }) => {
          return `[${timestamp}] [${level}]${context ? ` [${context}]` : ''} ${message}${
            trace ? `\n${trace}` : ''
          }`;
        }),
      ),

      // 日志输出目标
      transports: [
        // 控制台输出
        new winston.transports.Console(),

        // 错误日志文件
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),

        // 所有日志文件
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  /**
   * 记录日志
   * @param message 日志消息
   * @param context 上下文（可选）
   */
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  /**
   * 记录错误日志
   * @param message 错误消息
   * @param trace 错误堆栈（可选）
   * @param context 上下文（可选）
   */
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  /**
   * 记录警告日志
   * @param message 警告消息
   * @param context 上下文（可选）
   */
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  /**
   * 记录调试日志
   * @param message 调试消息
   * @param context 上下文（可选）
   */
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  /**
   * 记录详细日志
   * @param message 详细消息
   * @param context 上下文（可选）
   */
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * 设置日志上下文
   * 用于区分不同模块的日志
   */
  setContext(context: string) {
    this.logger.defaultMeta = { context };
  }
}

/**
 * 创建日志实例的工厂函数
 * 在 main.ts 中使用
 */
export function createLogger() {
  return new LoggerService();
}
