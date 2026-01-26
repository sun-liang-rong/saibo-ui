import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * 健康检查服务
   * 返回应用状态信息
   */
  getHello(): object {
    return {
      status: 'ok',
      message: '定时邮件发送服务运行中',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
