<template>
  <div class="filiere-page">
    <div v-if="filiere" v-html="filiere.description"></div>
    
    <div v-else class="loading">Chargement de la filière...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const filiere = ref(null)

onMounted(async () => {
  const id = route.params.id // Récupère l'ID envoyé par FilieresListView
  try {
    const response = await axios.get(`http://localhost:1337/api/filieres/${id}`)
    filiere.value = response.data.data
  } catch (error) {
    console.error("Erreur :", error)
  }
})
</script>

<style>
/* IMPORTANT : Ne mets pas "scoped" ici si tu veux que le CSS 
   injecté par Strapi s'applique à toute la page.
*/
.filiere-page {
  width: 100%;
  min-height: 100vh;
}
</style>