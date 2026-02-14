import { defineStore } from 'pinia'

export const useBuildingStore = defineStore('building', {
  state: () => ({
    buildings: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchBuildings() {
      this.loading = true
      try {
        // VITE_API_URL est défini dans votre docker-compose / .env
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337'
        const response = await fetch(`${baseUrl}/api/batiments`) // 'batiments' est le nom du Content-Type Strapi
        
        if (!response.ok) throw new Error('Erreur lors de la récupération des bâtiments')
        
        const { data } = await response.json()

        // Transformation des données Strapi pour Leaflet
        this.buildings = data.map(item => ({
          id: item.id,
          name: item.attributes.description || 'Bâtiment sans nom',
          // Conversion explicite en nombre pour Leaflet
          position: [
            parseFloat(item.attributes.Latitude), 
            parseFloat(item.attributes.Longitude)
          ]
        }))
      } catch (err) {
        this.error = err.message
        console.error('Store Error:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
