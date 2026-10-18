import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      host: env.VITE_HOST || 'localhost',
      port: Number(env.VITE_PORT) || 5173,
      // allowedHosts va DENTRO de server (antes estaba suelto en la raíz y Vite lo ignoraba)
      allowedHosts: [
        'techfix.rego.net.ar',
      ],
    },
  }
})