import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En producción Vercel enruta /api al servicio "api"; en dev lo hace este proxy.
    proxy: {
      '/api': {
        target: process.env.API_DEV_URL ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
