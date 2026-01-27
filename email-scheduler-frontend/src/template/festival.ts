/**
 * 情侣节日惊喜模板
 */
import { EmailTemplate } from './templates';

export const festival: EmailTemplate = {
  id: 'festival',
  name: '节日惊喜',
  category: '情侣惊喜',
  description: '情人节、纪念日等特殊日子的浪漫惊喜',
  subject: '亲爱的，节日快乐，我爱你！💖',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff6b95 0%, #c44569 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💑</span>
    </div>
    <h1 style="color: #ff6b95; text-align: center; font-size: 28px; margin-bottom: 20px;">
      节日快乐，我的爱人！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      最亲爱的，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      在这个特殊的日子里，我想告诉你：你是我生命中最美的礼物！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      感谢上天让我们相遇，让我拥有了你这么完美的爱人！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      愿我们的爱情永远甜蜜，愿我们永远幸福在一起！
    </p>
    <div style="background: #fff0f5; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #ff6b95; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💕 我爱你，今天、明天、每一天！ 💕
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 深爱着你
    </p>
  </div>
</div>
  `.trim(),
};
