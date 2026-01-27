/**
 * 感谢邮件模板
 */
import { EmailTemplate} from './templates';

export const thankYou: EmailTemplate = {
  id: 'thankYou',
  name: '感谢信',
  category: '商务',
  description: '表达感谢的邮件，适合商务场合或个人感谢',
  subject: '衷心感谢！🙏',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">🙏</span>
    </div>
    <h1 style="color: #e67e22; text-align: center; font-size: 28px; margin-bottom: 20px;">
      衷心感谢！
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      亲爱的朋友，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      在此，我想向你表达我最诚挚的感谢。
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      感谢你在我需要的时候伸出援手，你的帮助让我倍感温暖。
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      你的支持和鼓励是我前进的动力，我会永远铭记在心！
    </p>
    <div style="background: #fff8f0; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #e67e22; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        🌟 感恩有你，一路同行！ 🌟
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 这厢有礼了
    </p>
  </div>
</div>
  `.trim(),
};
