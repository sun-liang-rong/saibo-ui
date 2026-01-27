/**
 * 邀请函模板
 */
import { EmailTemplate } from './templates';

export const invitation: EmailTemplate = {
  id: 'invitation',
  name: '活动邀请',
  category: '工作',
  description: '正式的活动邀请函，适合会议、聚会等场合',
  subject: '诚挚邀请 📨',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">📨</span>
    </div>
    <h1 style="color: #3f2b96; text-align: center; font-size: 28px; margin-bottom: 20px;">
      活动邀请
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      尊敬的朋友，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      诚挚地邀请您参加我们的活动：
    </p>
    <div style="background: #f0f4ff; padding: 25px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #3f2b96; font-weight: bold; font-size: 20px; text-align: center; margin: 0 0 15px 0;">
        📅 活动详情
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>时间：</strong>在这里填写活动时间
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>地点：</strong>在这里填写活动地点
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>主题：</strong>在这里填写活动主题
      </p>
    </div>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      期待您的光临！
    </p>
    <div style="background: #e8f0ff; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #3f2b96; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        🎉 期待与您相见！ 🎉
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 诚挚邀请
    </p>
  </div>
</div>
  `.trim(),
};
