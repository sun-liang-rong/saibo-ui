import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  imports: [ConfigModule, OllamaModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
