import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径，确保Electron加载资源正确
  server: {
    watch: {
      ignored: ['node_modules/**', 'release/**', 'dist/**'] // 忽略打包输出目录，避免不必要的热更新
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1024 // 调整chunk大小警告阈值
  }
})