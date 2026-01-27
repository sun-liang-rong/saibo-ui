import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(env.VITE_API_BASE_URL, 'env.VITE_API_BASE_URL')
  const isDev = command === 'serve'
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // 配置代理,解决跨域问题
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
