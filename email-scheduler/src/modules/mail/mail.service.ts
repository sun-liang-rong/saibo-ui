import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as Handlebars from 'handlebars';
import { weatherTemplate } from '../email-templates/assets/weather-template';
import { newTemplate } from '../email-templates/assets/new-template';
import * as dayjs from 'dayjs';
import { goldTemplate } from '../email-templates/assets/gold-template';
import { douyinHotSearchTemplate } from '../email-templates/assets/douyin-hot-search-template';
import { OllamaService } from '../ollama/ollama.service';
const weatherEmojiMap: Record<string, string> = {
  '00': '☀️',   // 晴
  '01': '⛅',   // 多云
  '02': '☁️',   // 阴
  '03': '🌤️',   // 少云/散云
  '04': '☁️',   // 阴天
  '05': '🌦️',   // 阵雨
  '07': '🌧️',   // 小雨
  '08': '⛈️',   // 中雨/雷阵雨
  '09': '🌨️',   // 小雪
  '10': '❄️',   // 中雪/大雪
  '13': '🌧️',   // 雨
  '14': '🌨️',   // 雪
  '53': '🌫️',   // 雾
  '54': '🌫️',   // 霾
  '55': '🌫️',   // 浮尘
  '56': '🌫️',   // 沙尘暴
  default: '🌤️', // 默认
};
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  constructor(
    private configService: ConfigService,
    private ollamaService: OllamaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });

    Handlebars.registerHelper('eq', function (a, b) {
      return a === b;
    });
    Handlebars.registerHelper('lt', function (a, b) {
      return a < b;
    });
    Handlebars.registerHelper('formatHour', function (hour) {
      return hour.padStart(2, '0');
    });
    Handlebars.registerHelper('or', function () {
      return Array.from(arguments).slice(0, -1).some(Boolean);
    });
    Handlebars.registerHelper('find', function (array, options) {
      if (!array) return options.inverse(this);
      const result = array.find(item => item.name === options.hash.name);
      return result ? options.fn(result) : options.inverse(this);
    });
    Handlebars.registerHelper('now', function (format) {
      return dayjs().format(format);
    });
    Handlebars.registerHelper('add', function (a, b) {
      return a + b;
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    type: string,
    useAI: boolean = false,
    prompt?: string,
  ): Promise<void> {
    try {
      let finalHtml = html;

      if (type === 'weather') {
        finalHtml = await this.getWeatherTemplate();
      } else if (type === 'news') {
        finalHtml = await this.getNewsTemplate();
      } else if (type === 'gold') {
        finalHtml = await this.getGoldTemplate();
      } else if (type === 'douyin') {
        finalHtml = await this.getDouyinHotSearchTemplate();
      } else if (type === 'moyu') {
        finalHtml = await this.getMoyu();
      }

      if (useAI && prompt) {
        try {
          this.logger.log('正在使用 AI 生成邮件内容...');
          const aiContent = await this.ollamaService.generateText(prompt);
          finalHtml = finalHtml.replace('{{ai_content}}', aiContent);
          this.logger.log('AI 内容生成成功');
        } catch (error) {
          this.logger.warn('AI 生成失败，使用默认内容', error.message);
          finalHtml = finalHtml.replace('{{ai_content}}', '（AI 生成内容暂时不可用，将显示默认内容）');
        }
      } else {
        finalHtml = finalHtml.replace('{{ai_content}}', '');
      }
      
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to,
        subject,
        html: finalHtml,
      });
      this.logger.log(`邮件发送成功: ${to}`);
    } catch (error) {
      this.logger.error(`邮件发送失败: ${to}`, error.stack);
      throw error;
    }
  }
  getWeatherEmoji(code: string): string {
    return weatherEmojiMap[code] || weatherEmojiMap['default'] || '🌤️';
  }
  async getWeatherTemplate(): Promise<string> {
    try {
      const response = await axios.get('https://60s.7se.cn/v2/weather/forecast', {
        params: {
          query: '合肥',
          days: 7,
        },
      });

      const weatherData = response.data.data;
      const now = dayjs();

      const compiledTemplate = Handlebars.compile(weatherTemplate);

      const templateData = {
        location: {
          name: weatherData.location.name,
          city: weatherData.location.city,
          county: weatherData.location.county
        },
        today_date: now.format('YYYY-MM-DD'),
        sunrise_sunset: weatherData.sunrise_sunset,
        daily_forecast: weatherData.daily_forecast.map((day: any, idx: number) => ({
          ...day,
          day_icon: this.getWeatherEmoji(day.day_condition_code),
          night_icon: this.getWeatherEmoji(day.night_condition_code),
        })),
        hourly_forecast: weatherData.hourly_forecast.map((hour: any) => ({
          ...hour,
          icon_url: this.getWeatherEmoji(hour.condition_code),
        })),
      };

      return compiledTemplate(templateData);
    } catch (error) {
      this.logger.error('获取天气数据失败', error.stack);
      throw error;
    }
  }

  async getNewsTemplate(): Promise<string> {
    try {
      const response = await axios.get('https://60s.viki.moe/v2/60s');

      const newsData = response.data.data;
      const compiledTemplate = Handlebars.compile(newTemplate);

      const templateData = {
        date: newsData.date,
        day_of_week: newsData.day_of_week,
        lunar_date: newsData.lunar_date,
        cover: newsData.cover,
        image: newsData.image,
        news: newsData.news,
        tip: newsData.tip,
        api_updated: newsData.api_updated
      };

      return compiledTemplate(templateData);
    } catch (error) {
      this.logger.error('获取新闻数据失败', error.stack);
      throw error;
    }
  }
  async getGoldTemplate(): Promise<string> {
    try {
      const response = await axios.get('https://60s.viki.moe/v2/gold-price');

      const goldData = response.data.data;
      const compiledTemplate = Handlebars.compile(goldTemplate);

      const templateData = {
        date: goldData.date,
        metals: goldData.metals,
        stores: goldData.stores,
        banks: goldData.banks,
        recycle: goldData.recycle,
      };

      return compiledTemplate(templateData);
    } catch (error) {
      this.logger.error('获取黄金数据失败', error.stack);
      throw error;
    }
  }

  async getDouyinHotSearchTemplate(): Promise<string> {
    try {
      const response = await axios.get('https://60s.viki.moe/v2/douyin');

      const douyinData = response.data.data;
      const compiledTemplate = Handlebars.compile(douyinHotSearchTemplate);

      const templateData = {
        data: douyinData,
      };

      return compiledTemplate(templateData);
    } catch (error) {
      this.logger.error('获取抖音热搜数据失败', error.stack);
      throw error;
    }
  }
  async getMoyu() {
    try {
      const response = await axios.get('https://60s.viki.moe/v2/moyu', {
        params: {
          encoding: 'text',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('获取摸鱼数据失败', error.stack);
      throw error;
    }
  }
}
