import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 是关键配置：构建产物使用相对路径引用资源，
// 使 dist/index.html 可直接双击在浏览器中打开（无需本地服务器）。
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    // 允许内网穿透域名（如 localtunnel 生成的 *.loca.lt）访问 dev server
    allowedHosts: ['.loca.lt', 'localhost'],
  },
})
