import { defineConfig } from 'vite'
import { resolvePkgPath } from '../rollup/utils'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace'
import path from 'path'

/// <reference types="vite/client" />
export default defineConfig({
  plugins: [
    react(),
    replace({
      __DEV__: true,
      preventAssignment: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: resolvePkgPath('react'),
      },
      {
        find: 'react-dom',
        replacement: resolvePkgPath('react-dom'),
      },
      {
        find: 'hostConfig',
        replacement: path.resolve(
          resolvePkgPath('react-dom'),
          './src/hostConfig.ts'
        ),
      },
    ],
  },
  // 兼容 wsl2 的热更新
  server: {
    watch: {
      usePolling: true,
    },
  },
})
