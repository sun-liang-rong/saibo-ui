import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * 邮件发送选项
 */
export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 邮件发送服务
 *
 * 为什么单独设计一个 MailService：
 * 1. 职责分离：EmailService 负责业务逻辑，MailService 负责邮件发送
 * 2. 易于测试：可以 Mock MailService 进行单元测试
 * 3. 易于扩展：未来可以替换为 SendGrid、SES 等其他邮件服务
 * 4. 配置集中：邮件配置集中管理
 *
 * 使用 nodemailer：
 * - 成熟的 Node.js 邮件发送库
 * - 支持 SMTP 协议
 * - 支持多种邮件服务商（Gmail、QQ、163等）
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  /**
   * 初始化邮件传输器
   *
   * 从环境变量读取配置：
   * - MAIL_HOST: SMTP 服务器地址
   * - MAIL_PORT: SMTP 端口（通常 587 或 465）
   * - MAIL_USER: 邮箱账号
   * - MAIL_PASSWORD: 邮箱密码或应用专用密码
   * - MAIL_FROM: 发件人邮箱（可选）
   *
   * 为什么在构造函数中初始化：
   * - 应用启动时创建连接
   * - 复用连接，提高性能
   */
  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });

    // 验证配置
    this.transporter
      .verify()
      .then(() => {
        this.logger.log('邮件服务连接成功');
      })
      .catch((error) => {
        this.logger.error('邮件服务连接失败', error.stack);
      });
  }

  /**
   * 发送邮件
   *
   * @param options 邮件选项
   * @returns 发送结果
   *
   * 业务逻辑：
   * 1. 构建邮件内容
   * 2. 调用 nodemailer 发送
   * 3. 记录日志
   * 4. 返回发送结果
   *
   * 为什么使用 async/await：
   * - 邮件发送是异步操作
   * - 需要等待发送结果
   * - 统一的异步错误处理
   */
  async sendMail(options: SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    this.logger.log(`发送邮件到: ${options.to}`);

    try {
      // 构建邮件选项
      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', this.configService.get('MAIL_USER')),
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text, // 纯文本备用内容
      };

      // 发送邮件
      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`邮件发送成功: ${info.messageId}`);

      return info;
    } catch (error) {
      this.logger.error(`邮件发送失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 发送测试邮件
   *
   * 用于测试邮件配置是否正确
   *
   * @param to 收件人邮箱
   */
  async sendTestEmail(to: string): Promise<void> {
    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">测试邮件</h2>
        <p>这是一封测试邮件，用于验证邮件服务配置。</p>
        <p>如果您收到此邮件，说明邮件服务配置正确！</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 12px;">
          发送时间: ${new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    `;

    await this.sendMail({
      to,
      subject: '定时邮件服务 - 测试邮件',
      html: testHtml,
    });

    this.logger.log(`测试邮件已发送到: ${to}`);
  }
}
