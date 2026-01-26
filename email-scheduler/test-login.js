/**
 * 登录功能测试脚本
 *
 * 使用方法：
 * 1. 启动后端服务：npm run start:dev
 * 2. 在新终端运行：node test-login.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

/**
 * 测试用户登录
 */
async function testLogin(username, password) {
  console.log('\n=== 测试登录 ===');
  console.log(`用户名: ${username}`);
  console.log(`密码: ${password}`);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });

    console.log('\n✅ 登录成功！');
    console.log('\n用户信息:');
    console.log('  ID:', response.data.user.id);
    console.log('  用户名:', response.data.user.username);
    console.log('  邮箱:', response.data.user.email);
    console.log('\nToken 信息:');
    console.log('  类型:', response.data.token_type);
    console.log('  过期时间:', response.data.expires_in, '秒');
    console.log('  Token:', response.data.access_token.substring(0, 50) + '...');

    return response.data.access_token;
  } catch (error) {
    console.log('\n❌ 登录失败！');
    console.error('错误信息:', error.response?.data?.message || error.message);
    return null;
  }
}

/**
 * 测试用户注册
 */
async function testRegister(username, password, email) {
  console.log('\n=== 测试注册 ===');
  console.log(`用户名: ${username}`);
  console.log(`密码: ${password}`);
  console.log(`邮箱: ${email}`);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
      email,
    });

    console.log('\n✅ 注册成功！');
    console.log('\n用户信息:');
    console.log('  ID:', response.data.id);
    console.log('  用户名:', response.data.username);
    console.log('  邮箱:', response.data.email);

    return true;
  } catch (error) {
    console.log('\n❌ 注册失败！');
    console.error('错误信息:', error.response?.data?.message || error.message);
    return false;
  }
}

/**
 * 测试受保护的接口
 */
async function testProtectedApi(token) {
  console.log('\n=== 测试受保护的接口 ===');

  try {
    const response = await axios.get(`${API_BASE_URL}/emails`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('\n✅ 接口访问成功！');
    console.log('\n邮件列表:');
    console.log('  总数:', response.data.total);
    console.log('  当前页:', response.data.page);
    console.log('  每页数量:', response.data.limit);
  } catch (error) {
    console.log('\n❌ 接口访问失败！');
    console.error('错误信息:', error.response?.data?.message || error.message);
  }
}

/**
 * 主测试流程
 */
async function runTests() {
  console.log('======================================');
  console.log('  登录功能测试');
  console.log('======================================');

  // 测试 1: 使用默认管理员账号登录
  console.log('\n【测试 1】默认管理员账号登录');
  const adminToken = await testLogin('admin', 'admin123');

  if (adminToken) {
    // 测试 2: 使用 token 访问受保护的接口
    console.log('\n【测试 2】使用 Token 访问受保护的接口');
    await testProtectedApi(adminToken);
  }

  // 测试 3: 测试注册新用户
  console.log('\n【测试 3】注册新用户');
  const testUsername = `testuser_${Date.now()}`;
  await testRegister(testUsername, 'test123', 'test@example.com');

  // 测试 4: 使用新注册的账号登录
  console.log('\n【测试 4】新注册账号登录');
  const userToken = await testLogin(testUsername, 'test123');

  // 测试 5: 错误的密码
  console.log('\n【测试 5】错误密码登录（应该失败）');
  await testLogin('admin', 'wrongpassword');

  // 测试 6: 不存在的用户
  console.log('\n【测试 6】不存在用户登录（应该失败）');
  await testLogin('nonexistent', 'password');

  // 测试 7: 重复注册（应该失败）
  console.log('\n【测试 7】重复注册（应该失败）');
  await testRegister('admin', 'admin123', 'admin2@example.com');

  console.log('\n======================================');
  console.log('  测试完成');
  console.log('======================================');
  console.log('\n💡 提示：');
  console.log('1. 默认管理员账号：admin / admin123');
  console.log('2. 默认测试账号：testuser / test123');
  console.log('3. 生产环境请务必修改默认密码！');
  console.log('4. 访问 http://localhost:3000/api-docs 查看 API 文档\n');
}

// 运行测试
runTests().catch(console.error);
