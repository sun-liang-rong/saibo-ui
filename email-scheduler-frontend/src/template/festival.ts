/**
 * 节日问候模板
 */
import { EmailTemplate } from './templates';

export const festival: EmailTemplate = {
  id: 'festival',
  name: '节日问候',
  category: '节日',
  description: '通用的节日祝福，适合春节、中秋等传统节日',
  subject: '节日快乐！🎉',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">🎊</span>
    </div>
    <h1 style="color: #f5576c; text-align: center; font-size: 28px; margin-bottom: 20px;">
      节日快乐！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的朋友，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      在这个美好的节日里，愿你和家人团聚幸福，身体健康，万事如意！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      愿节日的喜悦伴随你，愿你的生活充满欢声笑语！
    </p>
    <div style="background: #fff5f7; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #f5576c; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        🎉 恭祝佳节愉快，阖家幸福！ 🎉
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 节日快乐
    </p>
  </div>
</div>
  `.trim(),
};
