<template>
  <main class="page">
    
    <section class="section">
      <div v-if="loading" class="state card">Chargement des filières…</div>
      <div v-else-if="error" class="state card error">
        Oups. Impossible de charger les filières.
        <div class="hint">{{ error }}</div>
      </div>

      <div v-else class="grid">
        <article v-for="f in filieres" :key="f.id" class="card filiere-card">
          <div class="head">
            <div class="icon">🎓</div>
            <div class="hgroup">
              <h2 class="name">{{ f.nomdelafiliere || f.nom }}</h2>
              <p class="desc">Découvrir la filière et ses projets</p>
            </div>
          </div>

          <router-link
            :to="{ name: 'filiere-detail', params: { id: f.documentId } }"
            class="btn"
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
const error = ref(null)

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    const response = await axios.get(`${baseUrl}/api/filieres`)
    filieres.value = response.data.data || []
  } catch (e) {
    console.error('Erreur liste :', e)
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page{
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  padding:16px;
  max-width: 980px;
  margin: 0 auto;
  font-family: var(--font);
}
.topbar{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;}
.back{
  text-decoration:none;
  color:var(--text);
  font-weight:800;
  padding:10px 12px;
  border-radius:14px;
  border:1px solid var(--border);
  background:var(--card);
}
.titles h1{margin:0;font-size:20px;}
.subtitle{margin:4px 0 0;color:var(--text-soft);font-size:13px;}

.section{margin-top:8px;}
.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:20px;
  box-shadow: var(--shadow);
}
.state{padding:14px;}
.error{border-color:#fecaca;background:#fff1f2;}
.hint{margin-top:6px;color:var(--text-soft);font-size:12px;}

.grid{
  display:grid;
  grid-template-columns: 1fr;
  gap:12px;
}
.filiere-card{padding:14px;display:flex;flex-direction:column;gap:12px;}
.head{display:flex;gap:12px;align-items:center;}
.icon{
  width:44px;height:44px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  background:var(--green-soft);
}
.hgroup{flex:1;min-width:0;}
.name{margin:0;font-size:16px;line-height:1.2;}
.desc{margin:2px 0 0;color:var(--text-soft);font-size:13px;}

.btn{
  height:48px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;text-decoration:none;
  background:var(--green-dark);color:#fff;
}
.btn:active{transform:scale(.99);}

@media (min-width: 720px){
  .grid{grid-template-columns: repeat(2, 1fr);}
  .titles h1{font-size:22px;}
}
</style>
