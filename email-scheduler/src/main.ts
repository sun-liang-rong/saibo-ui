import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createLogger } from './common/logger/logger.service';

/**
 * 应用程序启动函数
 *
 * 为什么这么设计：
 * 1. 使用 NestFactory.create() 创建 NestJS 应用实例
 * 2. 启用全局验证管道，自动验证所有请求体 DTO
 * 3. 配置 Swagger API 文档，方便开发测试
 * 4. 使用 Winston 日志系统替代默认日志
 */
async function bootstrap() {
  // 创建 NestJS 应用
  const app = await NestFactory.create(AppModule, {
    // 使用自定义日志服务
    // 生产关闭日志
    logger: process.env.NODE_ENV !== 'production' ? createLogger() : null
  });

  // 启用全局验证管道
  // whitelist: true - 自动移除未在 DTO 中定义的属性
  // transform: true - 自动转换类型（比如字符串转数字）
  // forbidNonWhitelisted: true - 如果有未定义的属性，抛出错误
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 启用 CORS（如果前端需要跨域访问）
  app.enableCors();

  // 配置 Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('定时邮件发送服务 API')
    .setDescription('提供定时邮件任务的创建、查询和管理功能')
    .setVersion('1.0')
    .addTag('emails', '邮件相关接口')
    .addTag('health', '健康检查接口')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 获取配置的端口
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 定时邮件发送服务启动成功！                             ║
║                                                            ║
║   📝 Swagger文档: http://localhost:${port}/api-docs
║   📧 API地址:    http://localhost:${port}
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

// 启动应用
bootstrap();
