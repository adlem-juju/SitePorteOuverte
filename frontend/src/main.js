import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Assurez-vous d'avoir configuré votre router
import './style.css'              // <-- IMPORTANT

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

