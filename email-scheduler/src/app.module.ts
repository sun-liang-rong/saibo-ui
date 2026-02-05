import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EmailTemplatesModule } from './modules/email-templates/email-templates.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { LogsModule } from './modules/logs/logs.module';
import { MailModule } from './modules/mail/mail.module';
import { DouyinModule } from './modules/douyin/douyin.module';
import { OllamaModule } from './modules/ollama/ollama.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables for dev
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    EmailTemplatesModule,
    TasksModule,
    LogsModule,
    MailModule,
    DouyinModule,
    OllamaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
