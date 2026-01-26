// init_password.js
const bcrypt = require('bcrypt');

(async function() {   // 立即执行的异步函数
    try {
        const hash = await bcrypt.hash('admin123', 10);
        
        console.log('加密后的密码：', hash);
        // 这里可以继续写保存到文件或数据库的代码
    } catch (err) {
        console.error('出错了：', err);
    }
})();