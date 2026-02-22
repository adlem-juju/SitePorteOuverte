import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,                 // écoute sur 0.0.0.0
    port: 5173,                 // en local OK (Render utilisera --port $PORT via Docker CMD)
    allowedHosts: true,         // ✅ autorise siteporteouverte-front.onrender.com
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 443,          // ✅ en https sur Render (évite ws://5173)
    },
  },
})
