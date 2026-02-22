<template>
  <main class="page-container">
    <div v-if="filiere" class="filiere-content">
      <div class="rich-text" v-html="filiere.PresFiliere"></div>
    </div>
    
    <div v-else class="loading-state">
      <div class="ui-card">Chargement de la filière...</div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const filiere = ref(null)

onMounted(async () => {
  const id = route.params.id 
  try {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    const response = await axios.get(`${API}/api/filieres/${id}`)
    
    // On récupère la donnée brute. Si Strapi utilise attributes, on l'extrait.
    const rawData = response.data.data
    filiere.value = rawData.attributes ? { id: rawData.id, ...rawData.attributes } : rawData
    
  } catch (error) {
    console.error("Erreur lors du chargement de la filière :", error)
  }
})
</script>

<style>
/* On ne met pas "scoped" car le HTML injecté par v-html 
   ne serait pas stylisé par des règles scoped.
*/
.filiere-content {
  margin-top: 10px;
}

.rich-text {
  /* On s'assure que le contenu Strapi ne déborde pas */
  word-wrap: break-word;
}

/* Style pour les images injectées par Strapi */
.rich-text img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
  color: var(--text-soft);
  font-weight: 700;
}
</style>