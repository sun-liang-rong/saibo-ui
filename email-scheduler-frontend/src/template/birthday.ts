/**
 * 情侣生日惊喜模板
 */
import { EmailTemplate } from './templates';

export const birthday: EmailTemplate = {
  id: 'birthday',
  name: '生日惊喜',
  category: '情侣惊喜',
  description: '为心爱的TA准备的生日惊喜，浪漫又温馨',
  subject: '亲爱的，生日快乐！我爱你 💕',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff6b95 0%, #ff4757 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💝</span>
    </div>
    <h1 style="color: #ff6b95; text-align: center; font-size: 28px; margin-bottom: 20px;">
      亲爱的，生日快乐！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我最爱的人，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      在这个特别的日子里，我想告诉你：遇见你是我这辈子最幸运的事！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      愿你的每一天都充满阳光和欢笑，就像你带给我的那样！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我会用一生的时间来爱你、陪伴你、珍惜你！
    </p>
    <div style="background: #fff0f5; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #ff6b95; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💕 你是我心中的唯一，生日快乐我的宝贝！ 💕
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 永远爱你的
    </p>
  </div>
</div>
  `.trim(),
};
