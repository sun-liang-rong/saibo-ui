/**
 * 新闻通讯模板
 */
import { EmailTemplate } from './templates';

export const newsletter: EmailTemplate = {
  id: 'newsletter',
  name: '新闻通讯',
  category: '工作',
  description: '简洁的新闻通讯模板，适合发送公司动态或行业资讯',
  subject: '最新资讯速递 📰',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #f5f7fa; padding: 40px 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
    <!-- 头部 -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
      <h1 style="color: #2c3e50; font-size: 32px; margin: 0 0 10px 0;">
        📰 最新资讯
      </h1>
      <p style="color: #7f8c8d; font-size: 16px; margin: 0;">
        在这里填写日期
      </p>
    </div>

    <!-- 主要内容 -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #3498db; font-size: 24px; margin-bottom: 15px;">
        📌 标题 1
      </h2>
      <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
        在这里填写第一则新闻的内容...
      </p>
      <a href="#" style="color: #3498db; text-decoration: none; font-weight: bold;">
        阅读更多 →
      </a>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #3498db; font-size: 24px; margin-bottom: 15px;">
        📌 标题 2
      </h2>
      <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
        在这里填写第二则新闻的内容...
      </p>
      <a href="#" style="color: #3498db; text-decoration: none; font-weight: bold;">
        阅读更多 →
      </a>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #3498db; font-size: 24px; margin-bottom: 15px;">
        📌 标题 3
      </h2>
      <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
        在这里填写第三则新闻的内容...
      </p>
      <a href="#" style="color: #3498db; text-decoration: none; font-weight: bold;">
        阅读更多 →
      </a>
    </div>

    <!-- 底部 -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center;">
      <p style="color: #95a5a6; font-size: 14px; margin: 5px 0;">
        感谢阅读我们的新闻通讯
      </p>
      <p style="color: #95a5a6; font-size: 14px; margin: 5px 0;">
        如需退订，请点击这里
      </p>
    </div>
  </div>
</div>
  `.trim(),
};
