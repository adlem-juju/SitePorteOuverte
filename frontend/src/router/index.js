import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/map', name: 'map', component: MapView },
    { path: '/evenements', name: 'evenements', component: () => import('../views/EventView.vue') },
    // Route pour la liste (optionnel)
    { 
  path: '/filieres', 
  name: 'filieres-liste', // Nom pour la page de liste
  component: () => import('../views/FilieresListView.vue') 
  },
  { 
  path: '/filiere/:id', 
  name: 'filiere-detail', // Nom pour la page de détail (STI2D, etc.)
  component: () => import('../views/FiliereView.vue') 
  }
  ]
})

export default router
