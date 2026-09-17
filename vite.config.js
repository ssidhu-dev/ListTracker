import { existsSync, readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const hasLocalCerts = existsSync('./certs/key.pem') && existsSync('./certs/cert.pem')
const httpsConfig = hasLocalCerts
  ? {
      key: readFileSync('./certs/key.pem'),
      cert: readFileSync('./certs/cert.pem'),
    }
  : undefined

// https://vite.dev/config/
export default defineConfig({
  server: { https: httpsConfig, host: true },
  preview: { https: httpsConfig, host: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'List Tracker',
        short_name: 'ListTracker',
        description: 'Track books, shows, and movies you want to watch or read',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
