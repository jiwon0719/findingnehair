import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['www.findingnehair.site', 'dev.www.findingnehair.site']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'html2canvas': 'html2canvas-pro',

    },
  },
})
