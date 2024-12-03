import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',  // Ensure relative paths
  build: {
    outDir: 'dist',  // Оставляем как есть
    sourcemap: true,
    chunkSizeWarningLimit: 600, // Увеличиваем лимит предупреждения
    rollupOptions: {
      output: {
        manualChunks: {
          // Выделяем React в отдельный чанк
          'vendor': ['react', 'react-dom'],
          'recharts': ['recharts']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.VITE_GOOGLE_PRIVATE_KEY': JSON.stringify(process.env.VITE_GOOGLE_PRIVATE_KEY),
    'process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL': JSON.stringify(process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL),
    'process.env.VITE_GOOGLE_SPREADSHEET_ID': JSON.stringify(process.env.VITE_GOOGLE_SPREADSHEET_ID)
  }
})