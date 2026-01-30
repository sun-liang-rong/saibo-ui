export const douyinHotSearchTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>抖音热搜榜 · ${new Date().toLocaleDateString('zh-CN')}</title>
  <style type="text/css">
    body { margin:0; padding:0; background:#f8f9fc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color:#1a1a1a; line-height:1.6; font-size:16px; }
    .container { width:100%; max-width:640px; margin:12px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; text-align:center; padding:40px 20px 30px; position:relative; }
    .header h1 { margin:0; font-size:32px; font-weight:700; letter-spacing:1px; }
    .header .subtitle { font-size:18px; margin:8px 0 0; opacity:0.9; }
    .list-section { padding:24px 20px; }
    .title { font-size:22px; color:#4a4aff; margin:0 0 20px; text-align:center; font-weight:600; }
    .hot-item { display:flex; align-items:center; margin-bottom:20px; background:#f9f9ff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(74,74,255,0.08); transition:all 0.2s; }
    .hot-item:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(74,74,255,0.12); }
    .rank { width:60px; height:60px; background:linear-gradient(135deg, #ff6b6b, #ff8e53); color:white; font-size:24px; font-weight:bold; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .content { flex:1; padding:16px; }
    .topic { font-size:18px; font-weight:600; margin:0 0 6px; color:#1a1a1a; }
    .hot-value { font-size:14px; color:#666; margin:0; }
    .cover { width:80px; height:80px; object-fit:cover; border-radius:0 12px 12px 0; }
    .meta { text-align:center; padding:16px; font-size:13px; color:#777; background:#f8f9fc; border-top:1px solid #eee; }
    .footer { background:#f0f2ff; padding:20px; text-align:center; font-size:13px; color:#555; }
    @media only screen and (max-width: 600px) {
      .container { margin:8px; border-radius:0; box-shadow:none; }
      .header { padding:32px 16px 24px; }
      .header h1 { font-size:28px; }
      .hot-item { flex-direction:column; }
      .rank { width:100%; height:50px; border-radius:12px 12px 0 0; font-size:22px; }
      .cover { width:100%; height:120px; border-radius:0 0 12px 12px; }
      .content { padding:16px; text-align:center; }
    }
  </style>
</head>
<body>

<center>
  <table class="container" cellpadding="0" cellspacing="0">
    <!-- 头部 -->
    <tr>
      <td class="header">
        <h1>抖音热搜榜</h1>
        <div class="subtitle">实时热点 · 一览无余</div>
      </td>
    </tr>

    <!-- 榜单主体 -->
    <tr>
      <td class="list-section">
        <h2 class="title">今日 Top 热搜</h2>

        {{#each data}}
        <a href="{{link}}" target="_blank" style="text-decoration:none; color:inherit;">
          <div class="hot-item">
            <div class="rank">{{add @index 1}}</div>
            <div class="content">
              <p class="topic">{{title}}</p>
              <p class="hot-value">热度：{{hot_value}} 🔥 更新：{{event_time}}</p>
            </div>
            {{#if cover}}
            <img src="{{cover}}" alt="{{title}}" class="cover" onerror="this.style.display='none'">
            {{/if}}
          </div>
        </a>
        {{/each}}
      </td>
    </tr>
  </table>
</center>

</body>
</html>`;