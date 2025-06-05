import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { HotPlugin } from './vite.plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tailwindcss(), HotPlugin()],

    build: {
      manifest: true,
      outDir: 'public/build',
      rollupOptions: {
        input: ['resources/js/app.tsx'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'resources/js'),
      },
    },
    server: {
      host: env.VITE_HOST || 'localhost',
      watch: {
        usePolling: true,
      },
      cors:{
        origin:"*"
      },
      hmr: true,
    },
  }
})
