#!/bin/bash

echo "======================================"
echo "  定时邮件发送服务 - 快速启动脚本"
echo "======================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  警告: .env 文件不存在"
    echo "正在创建 .env 文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建"
    echo ""
    echo "📝 请编辑 .env 文件并配置以下内容："
    echo "   - 数据库连接信息"
    echo "   - 邮件服务配置 (SMTP)"
    echo ""
    read -p "是否现在编辑 .env 文件？(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    fi
fi

# 检查 MySQL 是否运行
echo "🔍 检查 MySQL 服务..."
if command -v mysql &> /dev/null; then
    echo "✅ MySQL 已安装"
else
    echo "⚠️  警告: 未检测到 MySQL"
    echo "请确保 MySQL 已安装并运行"
fi

echo ""

# 创建数据库
read -p "是否自动创建数据库？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "MySQL 用户名 (默认: root): " mysql_user
    mysql_user=${mysql_user:-root}
    read -sp "MySQL 密码: " mysql_password
    echo ""

    echo "📊 正在创建数据库..."
    mysql -u $mysql_user -p$mysql_password -e "CREATE DATABASE IF NOT EXISTS email_scheduler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "✅ 数据库创建成功"
    else
        echo "❌ 数据库创建失败，请手动创建"
    fi
fi

echo ""

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "======================================"
echo "  准备就绪！"
echo "======================================"
echo ""
echo "启动命令："
echo "  开发模式: npm run start:dev"
echo "  生产模式: npm run build && npm run start:prod"
echo ""
echo "其他命令："
echo "  运行测试: node test-api.js"
echo "  查看文档: 打开浏览器访问 http://localhost:3000/api-docs"
echo ""
read -p "是否现在启动应用？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在启动应用..."
    npm run start:dev
fi
