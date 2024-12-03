import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Убедитесь, что base установлен правильно
  server: {
    fs: {
      strict: false
    },
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Уменьшите лимит предупреждения о размере чанка
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
          google: ['googleapis']
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      'components': '/src/components'
    }
  },
  optimizeDeps: {
    exclude: ['googleapis', 'axios']
  }
});