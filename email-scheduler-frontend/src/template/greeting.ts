/**
 * 情侣每日情话模板
 */
import { EmailTemplate } from './templates';

export const greeting: EmailTemplate = {
  id: 'greeting',
  name: '每日情话',
  category: '情侣惊喜',
  description: '每天给爱人发送甜蜜的情话',
  subject: '早安，我的爱人 ☀️💕',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💑</span>
    </div>
    <h1 style="color: #ff6b95; text-align: center; font-size: 28px; margin-bottom: 20px;">
      早安，我的爱人
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      每天睁开眼，第一个想到的就是你，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      你是我所有的心动和温柔，是我想要共度一生的人！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      愿你的今天充满阳光和欢笑，就像你给我的感觉一样！
    </p>
    <div style="background: #fff0f5; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #ff6b95; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💕 爱你，是我每天最想做的事！ 💕
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 爱你的人
    </p>
  </div>
</div>
  `.trim(),
};
