import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  root: fs.realpathSync.native(process.cwd()),
  plugins: [react()],
  server: {
    proxy: {
      '/api/checkout': {
        target: 'https://api.infinitepay.io/invoices/public/checkout/links',
        changeOrigin: true,
        rewrite: () => '', // Remove o path, pois o target já é a URL completa
      },
      '/api/payment-check': {
        target: 'https://api.infinitepay.io/invoices/public/checkout/payment_check',
        changeOrigin: true,
        rewrite: () => '',
      },
    },
  },
})
