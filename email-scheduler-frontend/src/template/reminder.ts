/**
 * 情侣浪漫提醒模板
 */
import { EmailTemplate } from './templates';

export const reminder: EmailTemplate = {
  id: 'reminder',
  name: '爱的提醒',
  category: '情侣惊喜',
  description: '给爱人一个温馨浪漫的提醒',
  subject: '亲爱的，记得我想你 💕',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💭</span>
    </div>
    <h1 style="color: #f39c12; text-align: center; font-size: 28px; margin-bottom: 20px;">
      想你的甜蜜提醒
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      只是想起你，就想给你发个信息，
    </p>
    <div style="background: #fffaf0; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f39c12;">
      <p style="color: #f39c12; font-weight: bold; font-size: 16px; margin: 0;">
        💕 记得按时吃饭，好好照顾自己 💕
      </p>
    </div>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我会一直在这里想你、爱你、等你！
    </p>
    <div style="background: #fff8e1; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #f39c12; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💡 你是我每天最甜蜜的想念！ 💡
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 想你的
    </p>
  </div>
</div>
  `.trim(),
};
