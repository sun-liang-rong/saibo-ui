/**
 * 提醒邮件模板
 */
import { EmailTemplate } from './templates';

export const reminder: EmailTemplate = {
  id: 'reminder',
  name: '提醒事项',
  category: '工作',
  description: '友好的提醒邮件，适合工作提醒或日程提醒',
  subject: '温馨提醒：不要忘记哦 ⏰',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">⏰</span>
    </div>
    <h1 style="color: #f39c12; text-align: center; font-size: 28px; margin-bottom: 20px;">
      温馨提醒
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      你好，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      这是一条友好的提醒，请不要忘记：
    </p>
    <div style="background: #fffaf0; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f39c12;">
      <p style="color: #f39c12; font-weight: bold; font-size: 16px; margin: 0;">
        📝 在这里填写具体的提醒事项...
      </p>
    </div>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      如需更多信息或帮助，请随时联系我。
    </p>
    <div style="background: #fff8e1; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #f39c12; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💡 记得按时完成哦！ 💡
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 温馨提示
    </p>
  </div>
</div>
  `.trim(),
};
