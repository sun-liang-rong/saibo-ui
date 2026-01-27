/**
 * 情侣约会邀请模板
 */
import { EmailTemplate } from './templates';

export const invitation: EmailTemplate = {
  id: 'invitation',
  name: '浪漫约会',
  category: '情侣惊喜',
  description: '邀请心爱的人共度浪漫时光',
  subject: '亲爱的，我想约你 💕',
  content: `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 40px 20px; border-radius: 20px;">
  <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
    <div style="text-align: center; margin-bottom: 30px;">
      <span style="font-size: 60px;">💌</span>
    </div>
    <h1 style="color: #ff6b95; text-align: center; font-size: 28px; margin-bottom: 20px;">
      亲爱的，我想约你
    </h1>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我最爱的人，
    </p>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我想邀请你和我一起度过一个特别的时光，
    </p>
    <div style="background: #fff0f5; padding: 25px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #ff6b95; font-weight: bold; font-size: 20px; text-align: center; margin: 0 0 15px 0;">
        💫 约会详情
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>时间：</strong>在这里填写约会时间
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>地点：</strong>在这里填写约会地点
      </p>
      <p style="color: #555; font-size: 16px; margin: 10px 0;">
        <strong>惊喜：</strong>在这里填写特别安排
      </p>
    </div>
    <p style="color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px;">
      我已经迫不及待想见到你了！
    </p>
    <div style="background: #ffe4e1; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <p style="color: #ff6b95; font-weight: bold; font-size: 18px; text-align: center; margin: 0;">
        💕 期待与你共度美好时光！ 💕
      </p>
    </div>
    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
      —— 想你的
    </p>
  </div>
</div>
  `.trim(),
};
