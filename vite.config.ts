import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Garante que os assets sejam carregados da raiz
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})