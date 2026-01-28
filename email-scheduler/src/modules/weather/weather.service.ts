import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface Daily_forecast {
  date: string; // 时间
  day_condition: string; // 天气
  day_condition_code: string; // 天气代码
  night_condition: string; // 天气
  night_condition_code: string; // 天气代码
  max_temperature: number; // 最高温度
  min_temperature: number; // 最低温度
  day_wind_direction: string; // 风向
  day_wind_power: string; // 风力
  night_wind_direction: string; // 风向
  night_wind_power: string; // 风力
  aqi: number; // AQI 指数
  aqi_level: number; // AQI 等级
  air_quality_level: number; // 空气质量等级
  air_quality: string; // 空气质量
  day_weather_icon: string; // 天气图标
  night_weather_icon: string; // 天气图标
}
/**
 * 天气信息接口
 */
export interface WeatherData {
  city: string;
  daily_forecast: Daily_forecast[];
}

/**
 * WeatherAPI 响应接口
 */
interface WeatherAPIResponse {
  data: {
    location: {
      name: string;
      region: string;
      country: string;
    };
    daily_forecast: Daily_forecast[];
  };
}

/**
 * 天气服务
 *
 * 功能：
 * 1. 调用 WeatherAPI 获取实时天气数据
 * 2. 返回格式化的天气信息
 * 3. 错误处理和日志记录
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://60s.viki.moe/v2/weather/forecast';

  constructor(private configService: ConfigService) {
    // 从环境变量获取 API 密钥
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY') || '';

    if (!this.apiKey) {
      this.logger.warn('未配置 WEATHER_API_KEY，天气功能将不可用');
    }
  }

  /**
   * 获取指定城市的天气信息
   *
   * @param city 城市名称（支持中文城市名）
   * @returns 天气数据
   * @throws HttpException 当 API 调用失败时
   */
  async getWeather(city: string): Promise<WeatherData> {
    // 检查 API 密钥是否配置
    if (!this.apiKey) {
      throw new HttpException('天气服务未配置，请联系管理员', 500);
    }

    try {
      this.logger.log(`正在获取城市 ${city} 的天气信息`);

      // 调用 WeatherAPI
      const response = await axios.get<WeatherAPIResponse>(this.apiUrl, {
        params: {
          query: city,
          days: 7,
        },
      });

      const data = response.data.data;
      // 格式化返回数据
      const weatherData: WeatherData = {
        city: data.location.name, // 获取城市名称
        daily_forecast: data.daily_forecast,
      };
      this.logger.log(
        `成功获取 ${weatherData.city} 的天气：${weatherData.daily_forecast[1].day_condition}，温度 ${weatherData.daily_forecast[1].min_temperature - weatherData.daily_forecast[1].max_temperature}°C`,
      );

      return weatherData;
    } catch (error) {
      // 错误处理
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          this.logger.error(`城市 ${city} 未找到`);
          throw new HttpException(`未找到城市：${city}`, 404);
        } else if (error.response?.status === 401) {
          this.logger.error('WeatherAPI 密钥无效');
          throw new HttpException('天气服务配置错误', 500);
        } else if (error.code === 'ECONNABORTED') {
          this.logger.error('WeatherAPI 请求超时');
          throw new HttpException('天气服务请求超时', 504);
        }
      }

      this.logger.error(`获取天气信息失败：${error.message}`, error.stack);
      throw new HttpException('获取天气信息失败，请稍后重试', 500);
    }
  }

  /**
   * 生成天气信息的 HTML
   *
   * @param weatherData 天气数据
   * @returns HTML 字符串
   */
  generateWeatherHTML(weatherData: WeatherData): string {
    const forecasts = weatherData.daily_forecast || [];
    const today = forecasts[1];
    const futureList = forecasts.slice(2);

    if (!today) {
      return `<div>暂无天气数据</div>`;
    }

    return `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 14px;
      margin: 20px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    ">

      <!-- 城市 + 今天 -->
      <h2 style="
        margin: 0 0 16px 0;
        font-size: 22px;
        font-weight: 600;
      ">
        📍 ${weatherData.city} · 今日天气
      </h2>

      <!-- 今日主信息 -->
      <div style="display: flex; align-items: center; gap: 18px;">
        <img
          src="${today.day_weather_icon}"
          alt="${today.day_condition}"
          style="width: 64px; height: 64px;"
        />

        <div>
          <div style="
            font-size: 40px;
            font-weight: bold;
            line-height: 1;
          ">
            ${today.min_temperature}° ~ ${today.max_temperature}°
          </div>

          <div style="
            font-size: 16px;
            margin-top: 6px;
            opacity: 0.9;
          ">
            ${today.day_condition}
          </div>
        </div>
      </div>

      <!-- 今日详情 -->
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.3);
      ">
        <div style="display: flex; gap: 10px;">
          💨
          <div>
            <div style="font-size: 12px; opacity: 0.8;">风向 / 风力</div>
            <div style="font-size: 16px; font-weight: 600;">
              ${today.day_wind_direction} ${today.day_wind_power}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          🌫️
          <div>
            <div style="font-size: 12px; opacity: 0.8;">空气质量</div>
            <div style="font-size: 16px; font-weight: 600;">
              AQI ${today.aqi} · ${today.air_quality}
            </div>
          </div>
        </div>
      </div>

      <!-- 未来天气 -->
      ${
        futureList.length
          ? `
        <div style="margin-top: 22px;">
          <div style="
            font-size: 14px;
            margin-bottom: 12px;
            opacity: 0.85;
          ">
            📆 未来天气预报
          </div>

          <div style="display: grid; gap: 10px;">
            ${futureList
              .map(
                (item) => `
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border-radius: 10px;
                background: rgba(255,255,255,0.12);
              ">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img
                    src="${item.day_weather_icon}"
                    alt="${item.day_condition}"
                    style="width: 32px; height: 32px;"
                  />
                  <div>
                    <div style="font-size: 14px;">
                      ${item.date}
                    </div>
                    <div style="font-size: 12px; opacity: 0.85;">
                      ${item.day_condition}
                    </div>
                  </div>
                </div>

                <div style="
                  font-size: 14px;
                  font-weight: 600;
                ">
                  ${item.min_temperature}° ~ ${item.max_temperature}°
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
  }

  /**
   * 检查天气服务是否可用
   *
   * @returns 是否可用
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
