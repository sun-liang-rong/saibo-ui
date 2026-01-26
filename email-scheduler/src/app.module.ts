import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './modules/email/email.module';
import { ScheduleTaskModule } from './modules/schedule/schedule.module';
import { HealthController } from './modules/health/health.controller';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
/**
 * 应用根模块
 *
 * 模块说明：
 * 1. ConfigModule: 加载环境变量配置，全局可用
 * 2. TypeOrmModule: 数据库 ORM 模块，自动连接 MySQL
 * 3. ScheduleModule: 定时任务调度器
 * 4. AuthModule: 用户认证模块（登录、注册）
 * 5. EmailModule: 邮件业务模块
 * 6. ScheduleTaskModule: 定时扫描并发送邮件的任务模块
 * 7. HealthModule: 健康检查模块
 */
@Module({
  imports: [
    // 配置模块 - 加载 .env 文件
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，其他模块不需要导入
      envFilePath: '.env', // 环境变量文件路径
    }),

    // TypeORM 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'email_scheduler'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动扫描实体
        synchronize: configService.get('NODE_ENV') === 'development', // 开发环境自动同步表结构
        logging: configService.get('NODE_ENV') === 'development', // 开发环境打印 SQL 日志
      }),
    }),

    // 定时任务模块
    // 注意：必须设置为全局，否则其他模块无法使用 @Cron() 装饰器
    ScheduleModule.forRoot(),

    // 业务模块
    AuthModule,
    EmailModule,
    ScheduleTaskModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
