import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 新增：开发服务器代理配置
  server: {
    proxy: {
      // 将所有以 /api 开头的请求代理到后端服务器
      '/api': {
        target: 'http://localhost:8080', // 你的后端服务地址
        changeOrigin: true, // 必须设置为 true，否则后端可能会因为 Origin 不同而拒绝请求
        // secure: false, // 如果后端是 https 服务且证书无效，可以设置
        // rewrite: (path) => path.replace(/^\/api/, ''), // 如果后端路径不包含 /api，则需要重写
      },
    },
  },
})
