<template>
  <div class="list-page">
    <header class="header">
      <router-link to="/" class="back-btn">← Accueil</router-link>
      <h1>Nos Formations</h1>
    </header>

    <div class="container">
      <div v-if="filieres.length > 0" class="filieres-grid">
        <div v-for="f in filieres" :key="f.id" class="filiere-card">
            <div class="card-icon">🎓</div>
                <h3>{{ f.nomdelafiliere }}</h3>
                <p>Découvrez les opportunités de la filière {{ f.nom }}</p>
            
                <router-link 
                    :to="{ name: 'filiere-detail', params: { id: f.documentId } }" 
                    class="view-btn"
                >
                Explorer
          </router-link>
        </div>
      </div>
      <div v-else class="loading">Chargement des filières...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const filieres = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:1337/api/filieres')
    filieres.value = response.data.data
  } catch (error) {
    console.error("Erreur liste :", error)
  }
})
</script>

<style scoped>
.list-page { min-height: 100vh; background: #f8fafc; }
.header { background: #1e3a8a; color: white; padding: 2rem; display: flex; align-items: center; gap: 20px; }
.back-btn { color: white; text-decoration: none; border: 1px solid white; padding: 5px 15px; border-radius: 20px; }
.container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
.filieres-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
.filiere-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; transition: 0.3s; }
.filiere-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.card-icon { font-size: 3rem; margin-bottom: 15px; }
.view-btn { display: inline-block; margin-top: 20px; background: #22c55e; color: white; padding: 10px 25px; border-radius: 8px; text-decoration: none; font-weight: 600; }
</style>