import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  root: fs.realpathSync.native(process.cwd()),
  plugins: [react()],
  server: {
    proxy: {
      '/infinitepay-api': {
        target: 'https://api.infinitepay.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/infinitepay-api/, ''),
      },
    },
  },
})
