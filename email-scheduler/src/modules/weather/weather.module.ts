import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './weather.service';

/**
 * 天气模块
 *
 * 提供天气信息查询功能
 */
@Module({
  imports: [ConfigModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
