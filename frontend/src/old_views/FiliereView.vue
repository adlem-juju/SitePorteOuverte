<template>
  <div class="filiere-page">
    <header class="header" v-if="filiere">
      <router-link to="/filieres" class="back-btn">← Retour</router-link>
      <h1>{{ filiere.nomdelafiliere }}</h1>
    </header>

    <div class="container">
      <div v-if="filiere" class="ck-content" v-html="filiere.PresFiliere"></div>
      
      <div v-else class="loading">Chargement de la filière...</div>
    </div>
  </div>
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
    // Appel à l'API Strapi 5
    const response = await axios.get(`http://localhost:1337/api/filieres/${id}`)
    filiere.value = response.data.data
  } catch (error) {
    console.error("Erreur lors du chargement du détail :", error)
  }
})
</script>

<style>
/* IMPORTANT : Le style n'est pas "scoped" pour permettre au CSS de CKEditor 
   de s'appliquer aux balises générées (h1, p, img, etc.) 
*/
.filiere-page {
  min-height: 100vh;
  background: white;
}

.header {
  background: #1e3a8a;
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Styles pour le contenu CKEditor */
.ck-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.ck-content h2 {
  color: #1e3a8a;
  margin-top: 1.5rem;
}

.loading {
  text-align: center;
  padding: 50px;
  font-style: italic;
  color: #64748b;
}
</style>