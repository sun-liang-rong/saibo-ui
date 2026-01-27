/**
 * 日常问候模板
 */
import { EmailTemplate } from './templates';

export const greeting: EmailTemplate = {
  id: 'greeting',
  name: '日常问候',
  category: '问候',
  description: '简单的日常问候邮件，适合保持联系',
  subject: '好久不见，最近好吗？😊',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">👋</span>
    </div>
    <h1 style="color: #4a90a4; text-align: center; font-size: 28px; margin-bottom: 20px;">
      好久不见！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的朋友，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      好久没有联系了，不知道你最近过得怎么样？
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      想起了我们一起度过的美好时光，希望能再次相聚！
    </p>
    <div style="background: #f0f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #4a90a4; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💫 愿你每天都开心快乐！ 💫
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 想念你的朋友
    </p>
  </div>
</div>
  `.trim(),
};
