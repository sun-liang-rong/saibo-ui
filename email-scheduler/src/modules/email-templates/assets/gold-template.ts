export const goldTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>今日黄金价格 · {{date}}</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2d2d2d;
      font-size: 16px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 12px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 3px 14px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #e8c670, #c19c3f);
      color: #111;
      text-align: center;
      padding: 32px 16px 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header .date {
      font-size: 17px;
      margin-top: 8px;
      opacity: 0.95;
    }
    .section {
      padding: 20px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .section:last-child {
      border-bottom: none;
    }
    .title {
      font-size: 20px;
      color: #8b6914;
      margin: 0 0 16px;
      padding-left: 10px;
      border-left: 4px solid #d4af37;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 8px;
      text-align: center;
      font-size: 15px;
    }
    th {
      background: #fff8e6;
      color: #8b6914;
      font-weight: 600;
    }
    .price {
      font-size: 17px;
      font-weight: bold;
      color: #c0392b;
    }
    .small {
      font-size: 13px;
      color: #666;
    }
    .highlight {
      background: #fffdf5;
    }

    /* 移动端优化：表格 → 卡片式 */
    @media only screen and (max-width: 600px) {
      .container {
        margin: 8px;
        border-radius: 0;
      }
      .section {
        padding: 16px 12px;
      }
      .title {
        font-size: 18px;
      }
      table, thead, tbody, th, td, tr {
        display: block;
      }
      thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
      tr {
        margin-bottom: 14px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fafafa;
      }
      td {
        border: none;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        padding-left: 50%;
        text-align: right;
      }
      td:before {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
        content: attr(data-label);
        text-align: left;
        font-weight: 600;
        color: #555;
      }
      .price {
        font-size: 17px;
      }
    }

    .footer {
      background: #f8f9fa;
      padding: 20px 16px;
      text-align: center;
      font-size: 13px;
      color: #555;
      line-height: 1.5;
    }
  </style>
</head>
<body>

<center>
  <table class="container" width="100%" cellpadding="0" cellspacing="0">
    <!-- 头部 -->
    <tr>
      <td class="header">
        <h1>今日黄金价格</h1>
        <div class="date">{{date}} 更新</div>
      </td>
    </tr>

    <!-- 今日金价概览（精简，只显示最重要几项） -->
    <tr>
      <td class="section">
        <h2 class="title">今日主要金价（元/克）</h2>
        <table>
          {{#each metals}}
            {{#if (or (eq name "今日金价") (eq name "黄金价格") (eq name "黄金_9999"))}}
            <tr class="highlight">
              <td data-label="品种">{{name}}</td>
              <td class="price" data-label="今日价">{{today_price}}</td>
              <td class="price" data-label="卖出价">{{sell_price}}</td>
            </tr>
            {{/if}}
          {{/each}}
          <tr>
            <td data-label="品种">伦敦金 (美元/盎司)</td>
            <td class="price" data-label="今日价">{{#find metals name="伦敦金(现货黄金)"}}{{today_price}}{{else}}--{{/find}}</td>
            <td class="price" data-label="卖出价">{{#find metals name="伦敦金(现货黄金)"}}{{sell_price}}{{else}}--{{/find}}</td>
          </tr>
        </table>
        <p class="small" style="margin-top:12px; text-align:center;">更新：{{metals.[0].updated}}</p>
      </td>
    </tr>

    <!-- 品牌金价（移动端显示前8条，其余可省略或折叠） -->
    <tr>
      <td class="section">
        <h2 class="title">主流品牌足金价（元/克）</h2>
        <table>
          {{#each stores}}
            <tr>
              <td data-label="品牌">{{brand}}</td>
              <td class="price" data-label="价格">{{price}}</td>
            </tr>
          {{/each}}
        </table>
      </td>
    </tr>

    <!-- 银行投资金条（精简，只显示主流银行） -->
    <tr>
      <td class="section">
        <h2 class="title">银行投资金条（元/克）</h2>
        <table>
          {{#each banks}}
            {{#if (or (eq bank "工商银行") (eq bank "中国银行") (eq bank "建设银行") (eq bank "农业银行"))}}
            <tr>
              <td data-label="银行">{{bank}}</td>
              <td class="price" data-label="价格">{{price}}</td>
            </tr>
            {{/if}}
          {{/each}}
        </table>
      </td>
    </tr>

    <!-- 回收价 -->
    <tr>
      <td class="section">
        <h2 class="title">黄金回收参考（元/克）</h2>
        <table>
          {{#each recycle}}
          <tr>
            <td data-label="类型">{{type}}</td>
            <td class="price" data-label="回收价">{{price}}</td>
          </tr>
          {{/each}}
        </table>
      </td>
    </tr>
  </table>
</center>

</body>
</html>`