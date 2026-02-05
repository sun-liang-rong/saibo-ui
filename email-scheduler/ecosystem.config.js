module.exports = {
  apps: [
    {
      name: 'nest-app',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        DB_HOST: 'mysql5.sqlpub.com',
        DB_PORT: 3310,
        DB_DATABASE: 'nest_test',
        DB_USERNAME: 'sunsun',
        DB_PASSWORD: 'CIFfWtTYEXMzeGNU',
        JWT_SECRET: 'sunsun',
        JWT_EXPIRES_IN: '24h',
        MAIL_HOST: 'smtp.qq.com',
        MAIL_PORT: 587,
        MAIL_USER: '2531636478@qq.com',
        MAIL_PASSWORD: 'stgzhjsdgspbdjde',
        MAIL_FROM: '2531636478@qq.com',
        WEATHER_API_KEY: '2c224ab1ed59418fae58083926260',
        OLLAMA_URL: 'http://localhost:11434',
        OLLAMA_MODEL: 'qwen2.5:0.5b',
        OLLAMA_TIMEOUT: 60000
      },
    },
  ],
};
