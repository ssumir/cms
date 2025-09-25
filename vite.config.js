import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cms/', // ✅ required for GitHub Pages deployment
  server: {
    proxy: {
      '/api': {
        target: 'https://apibeta.fellow.one',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
