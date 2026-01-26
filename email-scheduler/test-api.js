/**
 * 测试脚本
 *
 * 使用方法：
 * 1. 启动应用：npm run start:dev
 * 2. 在新终端运行测试：node test-api.js
 */

const BASE_URL = 'http://localhost:3000';

/**
 * 创建定时邮件任务
 */
async function createEmail() {
  console.log('\n=== 测试 1: 创建定时邮件任务 ===');

  // 计算 1 分钟后的时间
  const sendTime = new Date(Date.now() + 60000).toISOString();

  const response = await fetch(`${BASE_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_email: 'test@example.com', // 替换为你的邮箱
      subject: '测试邮件 - 定时发送',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">测试邮件</h2>
          <p>这是一封测试邮件，用于验证定时邮件发送功能。</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>发送时间：</strong>${new Date(sendTime).toLocaleString('zh-CN')}</p>
            <p><strong>邮件内容：</strong>这是一封自动发送的测试邮件。</p>
          </div>
          <p style="color: #888; font-size: 12px;">此邮件由定时邮件发送系统自动发送。</p>
        </div>
      `,
      send_time: sendTime,
    }),
  });

  const data = await response.json();
  console.log('✅ 邮件任务创建成功！');
  console.log('邮件 ID:', data.id);
  console.log('收件人:', data.to_email);
  console.log('发送时间:', new Date(data.send_time).toLocaleString('zh-CN'));
  console.log('状态:', data.status);

  return data.id;
}

/**
 * 查询邮件列表
 */
async function getEmails() {
  console.log('\n=== 测试 2: 查询邮件列表 ===');

  const response = await fetch(`${BASE_URL}/emails`);
  const data = await response.json();

  console.log('✅ 查询成功！');
  console.log('总邮件数:', data.total);
  console.log('当前页:', data.page);
  console.log('每页数量:', data.limit);
  console.log('邮件列表:');

  data.data.forEach((email, index) => {
    console.log(`  ${index + 1}. ID: ${email.id}, 收件人: ${email.to_email}, 状态: ${email.status}`);
  });
}

/**
 * 查询单个邮件详情
 */
async function getEmail(id) {
  console.log('\n=== 测试 3: 查询单个邮件详情 ===');

  const response = await fetch(`${BASE_URL}/emails/${id}`);
  const data = await response.json();

  console.log('✅ 查询成功！');
  console.log('邮件 ID:', data.id);
  console.log('收件人:', data.to_email);
  console.log('标题:', data.subject);
  console.log('发送时间:', new Date(data.send_time).toLocaleString('zh-CN'));
  console.log('状态:', data.status);
  console.log('重试次数:', data.retry_count);
  console.log('创建时间:', new Date(data.created_at).toLocaleString('zh-CN'));
}

/**
 * 健康检查
 */
async function healthCheck() {
  console.log('\n=== 测试 4: 健康检查 ===');

  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();

  console.log('✅ 系统运行正常！');
  console.log('状态:', data.status);
  console.log('环境:', data.environment);
  console.log('运行时间:', Math.floor(data.uptime), '秒');
}

/**
 * 获取统计信息
 */
async function getStats() {
  console.log('\n=== 测试 5: 获取统计信息 ===');

  const response = await fetch(`${BASE_URL}/health/stats`);
  const data = await response.json();

  console.log('✅ 统计信息：');
  console.log('总数:', data.total);
  console.log('待发送:', data.pending);
  console.log('已发送:', data.sent);
  console.log('失败:', data.failed);
  console.log('重试中:', data.retrying);
}

/**
 * 轮询检查邮件状态
 */
async function pollEmailStatus(id) {
  console.log('\n=== 测试 6: 轮询检查邮件发送状态 ===');
  console.log('⏳ 等待邮件发送（每 10 秒检查一次）...');

  let attempts = 0;
  const maxAttempts = 12; // 最多检查 2 分钟

  const interval = setInterval(async () => {
    attempts++;

    try {
      const response = await fetch(`${BASE_URL}/emails/${id}`);
      const data = await response.json();

      console.log(`[${attempts}] 状态: ${data.status}, 重试次数: ${data.retry_count}`);

      if (data.status === 'sent') {
        console.log('\n✅ 邮件发送成功！');
        console.log('发送时间:', new Date(data.sent_at).toLocaleString('zh-CN'));
        clearInterval(interval);
      } else if (data.status === 'failed') {
        console.log('\n❌ 邮件发送失败！');
        console.log('错误信息:', data.error_message);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        console.log('\n⏰ 等待超时，请稍后手动检查邮件状态');
        clearInterval(interval);
      }
    } catch (error) {
      console.error('检查状态时出错:', error.message);
      clearInterval(interval);
    }
  }, 10000);
}

/**
 * 创建一个立即发送的邮件（用于快速测试）
 */
async function createImmediateEmail() {
  console.log('\n=== 测试 7: 创建立即发送的邮件 ===');

  const sendTime = new Date(Date.now() - 1000).toISOString(); // 1 秒前

  const response = await fetch(`${BASE_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_email: 'test@example.com', // 替换为你的邮箱
      subject: '立即发送测试',
      content: '<h2>这封邮件应该立即发送</h2>',
      send_time: sendTime,
    }),
  });

  const data = await response.json();
  console.log('✅ 邮件任务创建成功！');
  console.log('邮件 ID:', data.id);
  console.log('⏳ 邮件将在下次定时任务执行时发送（最多 1 分钟内）');

  return data.id;
}

/**
 * 主测试流程
 */
async function runTests() {
  console.log('=================================');
  console.log('  定时邮件发送服务 - API 测试');
  console.log('=================================');

  try {
    // 1. 健康检查
    await healthCheck();

    // 2. 获取统计信息
    await getStats();

    // 3. 查询现有邮件列表
    await getEmails();

    // 4. 创建定时邮件任务（1 分钟后发送）
    const emailId = await createEmail();

    // 5. 查询单个邮件详情
    await getEmail(emailId);

    // 6. 创建立即发送的邮件
    const immediateEmailId = await createImmediateEmail();

    // 7. 轮询检查邮件状态
    pollEmailStatus(immediateEmailId);

    console.log('\n=================================');
    console.log('  测试脚本执行完成');
    console.log('=================================');
    console.log('\n💡 提示：');
    console.log('1. 请将 test@example.com 替换为你的真实邮箱');
    console.log('2. 确保 .env 文件中的邮件配置正确');
    console.log('3. 脚本会持续轮询检查邮件状态');
    console.log('4. 按 Ctrl+C 退出');
    console.log('5. 访问 http://localhost:3000/api-docs 查看 API 文档\n');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('\n请检查：');
    console.error('1. 应用是否已启动（npm run start:dev）');
    console.error('2. 端口 3000 是否被占用');
    console.error('3. .env 配置是否正确');
  }
}

// 运行测试
runTests();
