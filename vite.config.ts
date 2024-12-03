import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
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
  }
})