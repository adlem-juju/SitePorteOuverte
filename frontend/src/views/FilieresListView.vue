<template>
  <main class="page-container">
    <section class="section">
      <div v-if="loading" class="state ui-card">Chargement des filières…</div>
      
      <div v-else class="grid">
        <article v-for="f in filieres" :key="f.id" class="ui-card filiere-card">
          <div class="head">
            <div class="icon-box">🎓</div>
            <div class="hgroup">
              <h2 class="name">{{ f.nomdelafiliere || f.nom || 'Filière' }}</h2>
              <p class="desc">Découvrir la filière et ses projets</p>
            </div>
          </div>
          <router-link
            :to="{ name: 'filiere-detail', params: { id: f.documentId || f.id } }"
            class="ui-btn ui-btn-primary"
          >
            Explorer
          </router-link>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const filieres = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    const response = await axios.get(`${baseUrl}/api/filieres`)
    filieres.value = response.data.data || []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.filiere-card { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.head { display: flex; gap: 12px; align-items: center; }
.icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--green-soft); }
.name { font-size: 18px; font-weight: 900; margin: 0; }
.state { padding: 20px; text-align: center; }

@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
</style>