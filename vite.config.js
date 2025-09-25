import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
