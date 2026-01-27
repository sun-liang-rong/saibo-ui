/**
 * 生日祝福模板
 */
import { EmailTemplate } from './templates';

export const birthday: EmailTemplate = {
  id: 'birthday',
  name: '生日祝福',
  category: '节日',
  description: '温馨的生日祝福邮件，适合送给朋友、同事或家人',
  subject: '祝你生日快乐！🎂',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">🎂</span>
    </div>
    <h1 style="color: #667eea; text-align: center; font-size: 28px; margin-bottom: 20px;">
      生日快乐！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的朋友，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      在这个特别的日子里，愿所有的幸福都围绕着你，愿你的心愿都能实现！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      愿你的生日充满欢乐，愿你的每一天都如此美好！
    </p>
    <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #667eea; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        ✨ 生日快乐，万事如意！ ✨
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 来自远方的朋友
    </p>
  </div>
</div>
  `.trim(),
};
