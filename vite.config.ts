import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: '/',
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'recharts': ['recharts']
          }
        }
      }
    },
    define: {
      __VITE_GOOGLE_PRIVATE_KEY__: JSON.stringify(env.VITE_GOOGLE_PRIVATE_KEY),
      __VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL__: JSON.stringify(env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL),
      __VITE_GOOGLE_SPREADSHEET_ID__: JSON.stringify(env.VITE_GOOGLE_SPREADSHEET_ID)
    }
  }
})