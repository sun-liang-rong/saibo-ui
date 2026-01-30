export const weatherTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{location.name}} 天气预报 · {{today_date}}</title>
  <style type="text/css">
    body { margin:0; padding:0; background:#f5f7fa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color:#333; }
    .container { max-width:640px; margin:20px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4facfe, #00f2fe); color:white; text-align:center; padding:40px 20px 30px; position:relative; }
    .header h1 { margin:0; font-size:32px; }
    .header .location { font-size:20px; margin:8px 0 0; opacity:0.95; }
    .today-card { padding:24px 20px; background:#f8fbff; border-bottom:1px solid #e8f0fe; }
    .forecast-title { font-size:18px; color:#0066cc; margin:0 0 16px; padding-left:8px; border-left:4px solid #4facfe; }
    .hourly-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:12px; margin:16px 0; }
    .hour-item { text-align:center; background:#ffffff; border-radius:10px; padding:12px 8px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    .hour-time { font-size:13px; color:#555; margin-bottom:6px; }
    .hour-temp { font-size:20px; font-weight:bold; color:#e65100; }
    .daily-table { width:100%; border-collapse:collapse; margin:20px 0; }
    .daily-table th, .daily-table td { padding:12px 8px; text-align:center; border-bottom:1px solid #eee; }
    .daily-table th { background:#f0f7ff; color:#0066cc; font-weight:600; }
    .temp-range { color:#e65100; font-weight:bold; }
    .aqi-good { color:#4caf50; }
    .aqi-moderate { color:#ff9800; }
    .footer { background:#f8f9fa; padding:20px; text-align:center; font-size:13px; color:#777; }
    @media only screen and (max-width: 600px) {
      .container { margin:10px; }
      .hourly-grid { grid-template-columns:repeat(4, 1fr); }
    }
  </style>
</head>
<body>

<center>
  <table class="container" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td class="header">
        <h1>今日天气</h1>
        <div class="location">{{location.name}} · {{location.city}}{{location.county}}</div>
      </td>
    </tr>

    <!-- 今日重点摘要（取第一天 daily_forecast） -->
    <tr>
      <td class="today-card">
        <h2 class="forecast-title">今日（{{daily_forecast.[0].date}}）概览</h2>
        <div style="text-align:center; margin:20px 0;">
          <span style="font-size:48px; margin:0 16px;">{{daily_forecast.[0].day_icon}}</span>
          <span style="font-size:48px; font-weight:bold; margin:0 16px; color:#e65100;">{{daily_forecast.[0].max_temperature}}°</span>
          <span style="font-size:48px; margin:0 16px;">{{daily_forecast.[0].night_icon}}</span>
        </div>
        <div style="text-align:center; font-size:18px; margin:8px 0;">
          白天：{{daily_forecast.[0].day_condition}}　最高 {{daily_forecast.[0].max_temperature}}℃
        </div>
        <div style="text-align:center; font-size:16px; color:#555;">
          夜间：{{daily_forecast.[0].night_condition}}　最低 {{daily_forecast.[0].min_temperature}}℃
        </div>
        <div style="text-align:center; margin-top:16px;">
          空气质量：<span class="{{#if (eq daily_forecast.[0].aqi_level 1)}}aqi-good{{else}}aqi-moderate{{/if}}">{{daily_forecast.[0].air_quality}} ({{daily_forecast.[0].aqi}})</span>
        </div>
      </td>
    </tr>

    <!-- 逐小时预报（未来12-24小时） -->
    <tr>
      <td style="padding:24px 20px;">
        <h2 class="forecast-title">逐小时预报</h2>
        <div class="hourly-grid">
          {{#each hourly_forecast}}
            {{#if (lt @index 12)}}   <!-- 只显示前12小时，可调整 -->
            <div class="hour-item">
              <div class="hour-time">{{formatHour datetime}}</div>
              <div style="font-size:32px; margin:4px 0;">{{icon_url}}</div>
              <div class="hour-temp">{{temperature}}°</div>
              <div style="font-size:12px; color:#777;">{{condition}}</div>
            </div>
            {{/if}}
          {{/each}}
        </div>
      </td>
    </tr>

    <!-- 未来几天预报 -->
    <tr>
      <td style="padding:0 20px 24px;">
        <h2 class="forecast-title">未来几天</h2>
        <table class="daily-table">
          <tr>
            <th>日期</th>
            <th>白天</th>
            <th>夜间</th>
            <th>温度</th>
            <th>空气</th>
          </tr>
          {{#each daily_forecast}}
            {{#unless @first}}   <!-- 跳过今天，已在上面显示 -->
            <tr>
              <td>{{date}}</td>
              <td><span style="font-size:24px;">{{day_icon}}</span> {{day_condition}}</td>
              <td><span style="font-size:24px;">{{night_icon}}</span> {{night_condition}}</td>
              <td class="temp-range">{{min_temperature}} ~ {{max_temperature}}℃</td>
              <td class="{{#if (eq aqi_level 1)}}aqi-good{{else}}aqi-moderate{{/if}}">{{air_quality}}</td>
            </tr>
            {{/unless}}
          {{/each}}
        </table>
      </td>
    </tr>
  </table>
</center>

</body>
</html>`