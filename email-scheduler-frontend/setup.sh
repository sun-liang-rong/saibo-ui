#!/bin/bash

echo "======================================"
echo "  定时邮件发送系统 - 前端快速启动"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 检查依赖
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
echo "  开发模式: npm run dev"
echo "  生产构建: npm run build"
echo ""
read -p "是否现在启动应用？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在启动应用..."
    echo "前端将在 http://localhost:5173 启动"
    echo "请确保后端服务已启动（http://localhost:3000）"
    echo ""
    npm run dev
fi
