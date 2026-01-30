const http = require('http');

const BASE_URL = 'http://localhost:3000';

function testWeatherTemplate() {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}/mail/test/weather`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('天气模板测试成功！');
            console.log('HTML长度:', result.data.length, '字符');
            console.log('\n--- HTML预览 (前500字符) ---');
            console.log(result.data.substring(0, 500));
            console.log('...\n');
            
            fs.writeFileSync('weather-template.html', result.data);
            console.log('完整HTML已保存到 weather-template.html');
          } else {
            console.error('天气模板测试失败:', result.error);
          }
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          reject(e);
        }
      });
    }).on('error', (err) => {
      console.error('请求天气模板失败:', err.message);
      reject(err);
    });
  });
}

function testNewsTemplate() {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}/mail/test/news`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('新闻模板测试成功！');
            console.log('HTML长度:', result.data.length, '字符');
            console.log('\n--- HTML预览 (前500字符) ---');
            console.log(result.data.substring(0, 500));
            console.log('...\n');
            
            fs.writeFileSync('news-template.html', result.data);
            console.log('完整HTML已保存到 news-template.html');
          } else {
            console.error('新闻模板测试失败:', result.error);
          }
          resolve(result);
        } catch (e) {
          console.error('解析响应失败:', e);
          reject(e);
        }
      });
    }).on('error', (err) => {
      console.error('请求新闻模板失败:', err.message);
      reject(err);
    });
  });
}

const fs = require('fs');

async function runTests() {
  console.log('========================================');
  console.log('开始测试邮件模板');
  console.log('========================================\n');
  
  try {
    console.log('1. 测试天气模板...\n');
    await testWeatherTemplate();
    
    console.log('\n2. 测试新闻模板...\n');
    await testNewsTemplate();
    
    console.log('========================================');
    console.log('所有测试完成！');
    console.log('========================================');
  } catch (error) {
    console.error('\n测试过程中出错:', error);
  }
}

runTests();
