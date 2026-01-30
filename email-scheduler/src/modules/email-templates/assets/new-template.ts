export const newTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{{date}} · 60秒读懂世界</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      font-size: 16px;
    }
    .container {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    }
    a { color: #ff6600; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; }

    .header-banner {
      position: relative;
      background: linear-gradient(135deg, #ffa751, #ff6600);
      color: #ffffff;
      text-align: center;
      padding: 32px 16px 24px;
    }
    .header-banner h1 {
      margin: 0;
      font-size: 2.4rem;
    }
    .header-banner p {
      margin: 8px 0 0;
      font-size: 1.1rem;
      opacity: 0.95;
    }
    .cover-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.75;
    }

    .date-section {
      padding: 20px 16px;
      text-align: center;
      background: #fff8f2;
    }
    .date-title {
      margin: 0;
      font-size: 1.8rem;
      color: #ff6600;
    }
    .date-subtitle {
      margin: 8px 0 0;
      font-size: 1rem;
      color: #555;
    }

    .news-image {
      padding: 0 16px 16px;
    }

    .news-list {
      padding: 0 16px 24px;
    }
    .news-list ol {
      margin: 16px 0;
      padding-left: 24px;
      line-height: 1.8;
      font-size: 1.05rem;
    }
    .news-item {
      margin-bottom: 20px;
    }

    .tip-section {
      padding: 28px 16px;
      background: #fffdf5;
      text-align: center;
      border-top: 1px dashed #ffaa66;
    }
    .tip-title {
      margin: 0 0 12px;
      font-size: 1.2rem;
      color: #ff6600;
      font-style: italic;
    }
    .tip-content {
      margin: 0;
      font-size: 1.15rem;
      color: #444;
    }

    .footer {
      padding: 20px 16px;
      background: #fafafa;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }

    /* 移动端优化 */
    @media only screen and (max-width: 640px) {
      .container {
        border-radius: 0;
        box-shadow: none;
      }
      .header-banner {
        padding: 28px 12px 20px;
      }
      .header-banner h1 {
        font-size: 2.1rem;
      }
      .date-title {
        font-size: 1.65rem;
      }
      .news-list ol {
        padding-left: 20px;
        font-size: 1.05rem;
      }
      .news-item {
        margin-bottom: 24px;
      }
      .tip-content {
        font-size: 1.1rem;
      }
    }

    @media only screen and (max-width: 480px) {
      .header-banner h1 {
        font-size: 1.9rem;
      }
      .date-title {
        font-size: 1.5rem;
      }
      .news-list ol {
        font-size: 1.03rem;
      }
    }
  </style>
</head>
<body>

  <center>
    <table class="container" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <!-- 头部 Banner -->
          <div class="header-banner">
            <h1>每日一</h1>
            <p>等闲识得东风面，万紫千红总是春</p>
          </div>
        </td>
      </tr>

      <!-- 日期与标题 -->
      <tr>
        <td class="date-section">
          <h2 class="date-title">{{date}}（{{day_of_week}}）</h2>
          <p class="date-subtitle">农历 {{lunar_date}} · 每天60秒读懂世界</p>
        </td>
      </tr>

      <!-- 新闻列表 -->
      <tr>
        <td class="news-list">
          <ol>
            {{#each news}}
            <li class="news-item">{{this}}</li>
            {{/each}}
          </ol>
        </td>
      </tr>

      <!-- 每日金句 -->
      <tr>
        <td class="tip-section">
          <p class="tip-title">【每日金句】</p>
          <p class="tip-content">{{tip}}</p>
        </td>
      </tr>

      <!-- 尾部 -->
      <tr>
        <td class="footer">
          <p>数据来源：开源项目 <a href="https://github.com/vikiboss/60s">vikiboss/60s</a> | 更新时间：{{api_updated}}</p>
          <p style="margin-top: 12px;">如需退订或反馈，请直接回复邮件</p>
        </td>
      </tr>
    </table>
  </center>

</body>
</html>`;