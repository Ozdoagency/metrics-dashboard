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
          'vendor-react': ['react', 'react-dom'],
          // Другие крупные зависимости можно группировать здесь
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})