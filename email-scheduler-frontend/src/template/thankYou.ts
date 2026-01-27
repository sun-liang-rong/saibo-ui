/**
 * 情侣感谢情书模板
 */
import { EmailTemplate } from './templates';

export const thankYou: EmailTemplate = {
  id: 'thankYou',
  name: '爱的感谢',
  category: '情侣惊喜',
  description: '向心爱的人表达深深的谢意和爱意',
  subject: '谢谢你，我的爱人 🙏💕',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💝</span>
    </div>
    <h1 style="color: #e67e22; text-align: center; font-size: 28px; margin-bottom: 20px;">
      谢谢你，我的爱人
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      想对你说声谢谢，谢谢你出现在我的生命里。
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      谢谢你的爱、你的陪伴、你的包容和理解，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      有你在我身边，是我最大的幸福和幸运！
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我会用一生的时间来珍惜你、爱你、守护你！
    </p>
    <div style="background: #fff8f0; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #e67e22; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        🌟 谢谢你，让我遇见了最好的你！ 🌟
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 深爱着你
    </p>
  </div>
</div>
  `.trim(),
};
