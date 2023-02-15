import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 兼容 wsl2 的热更新
  server: {
    watch: {
      usePolling: true,
    },
  },
})
