import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createLogger } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV !== 'production' ? createLogger() : ['error', 'warn']
  });

  app.setGlobalPrefix('api');

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

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('定时邮件发送服务 API')
    .setDescription('提供定时邮件任务的创建、查询和管理功能')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 定时邮件发送服务启动成功！                             ║
║                                                            ║
║   📝 Swagger文档: http://localhost:${port}/api-docs         ║
║   📧 API地址:    http://localhost:${port}/api              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
