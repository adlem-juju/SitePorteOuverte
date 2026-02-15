<template>
  <main class="page">
    <header class="topbar" v-if="filiere">
      <router-link class="back" to="/filieres">← Retour</router-link>
      <div class="titles">
        <h1>{{ filiere.nomdelafiliere }}</h1>
        <p class="subtitle">Présentation & informations utiles</p>
      </div>
    </header>

    <section class="section">
      <div v-if="!filiere" class="state card">Chargement de la filière…</div>

      <article v-else class="card content">
        <!-- Contenu CKEditor -->
        <div class="ck-content" v-html="filiere.PresFiliere"></div>
      </article>
    </section>
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
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337'
    const response = await axios.get(`${baseUrl}/api/filieres/${id}`)
    filiere.value = response.data.data
  } catch (error) {
    console.error('Erreur lors du chargement du détail :', error)
  }
})
</script>

<style>
/* Non scoped : on veut styliser le HTML CKEditor */
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

.content{padding:16px;}

.ck-content{
  font-size:16px;
  line-height:1.6;
  color:var(--text);
}
.ck-content p{margin: 0 0 12px;}
.ck-content h2{
  margin: 22px 0 10px;
  color: var(--slate);
  font-size: 18px;
}
.ck-content h3{
  margin: 18px 0 8px;
  color: var(--slate);
  font-size: 16px;
}
.ck-content ul, .ck-content ol{padding-left: 20px; margin: 0 0 12px;}
.ck-content li{margin: 8px 0;}
.ck-content a{color: var(--sky); font-weight: 700; text-decoration: underline;}
.ck-content img{
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin: 10px 0 14px;
}
.ck-content blockquote{
  margin: 14px 0;
  padding: 12px 14px;
  background: var(--green-soft);
  border-left: 4px solid var(--green);
  border-radius: 16px;
  color: var(--slate);
}
@media (min-width: 720px){
  .titles h1{font-size:24px;}
  .content{padding:22px;}
}
</style>
