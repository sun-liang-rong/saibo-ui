@echo off
chcp 65001 >nul
echo ======================================
echo   定时邮件发送系统 - 前端快速启动
echo ======================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%
echo.

:: 检查依赖
if not exist node_modules (
    echo 📦 安装项目依赖...
    call npm install
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo ======================================
echo   准备就绪！
echo ======================================
echo.
echo 启动命令：
echo   开发模式: npm run dev
echo   生产构建: npm run build
echo.
set /p START_APP="是否现在启动应用？(y/n): "
if /i "%START_APP%"=="y" (
    echo.
    echo 🚀 正在启动应用...
    echo 前端将在 http://localhost:5173 启动
    echo 请确保后端服务已启动（http://localhost:3000）
    echo.
    call npm run dev
)

pause
