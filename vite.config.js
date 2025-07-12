import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/lift-plan/',  
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'], 
      manifest: {
        name: 'Lift Program',
        short_name: 'Lift',
        description: 'A tool for creating training plans',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/lift-plan/', 
        icons: [
          {
            src: '/lift-plan/pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lift-plan/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/lift-plan/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
