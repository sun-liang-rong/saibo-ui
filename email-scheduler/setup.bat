@echo off
chcp 65001 >nul
echo ======================================
echo   定时邮件发送服务 - 快速启动脚本
echo ======================================
echo.

:: 检查 Node.js 是否安装
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

:: 检查 .env 文件是否存在
if not exist .env (
    echo ⚠️  警告: .env 文件不存在
    echo 正在创建 .env 文件...
    copy .env.example .env >nul
    echo ✅ .env 文件已创建
    echo.
    echo 📝 请编辑 .env 文件并配置以下内容：
    echo    - 数据库连接信息
    echo    - 邮件服务配置 (SMTP)
    echo.
    set /p EDIT_ENV="是否现在编辑 .env 文件？(y/n): "
    if /i "%EDIT_ENV%"=="y" (
        notepad .env
    )
)

echo.
echo ======================================
echo   准备就绪！
echo ======================================
echo.
echo 启动命令：
echo   开发模式: npm run start:dev
echo   生产模式: npm run build ^&^& npm run start:prod
echo.
echo 其他命令：
echo   运行测试: node test-api.js
echo   查看文档: 打开浏览器访问 http://localhost:3000/api-docs
echo.
set /p START_APP="是否现在启动应用？(y/n): "
if /i "%START_APP%"=="y" (
    echo.
    echo 🚀 正在启动应用...
    echo.
    npm run start:dev
)

pause
