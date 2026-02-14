import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Indispensable pour Docker
    port: 5173,
    watch: {
      usePolling: true, // Permet de voir vos modifs en temps réel sur Linux
    },
    hmr: {
        clientPort: 5173 // Règle l'erreur de connexion "ws://" vue dans votre console
    }
  }
})
