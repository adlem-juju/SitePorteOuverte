<template>
  <main class="page">
    <section class="intro">
      <h1>Nos filières</h1>
      <p>Simple à lire, facile à partager.</p>
    </section>

    <section class="grid">
      <router-link
        v-for="f in filieres"
        :key="f.id"
        class="card item"
        :to="`/filiere/${f.id}`"
      >
        <div class="icon">{{ f.icon }}</div>
        <div class="txt">
          <div class="title">{{ f.nom }}</div>
          <div class="desc">{{ f.accroche }}</div>
        </div>
        <div class="chev">›</div>
      </router-link>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const filieres = ref([])

onMounted(async () => {
  // ⚠️ garde ton endpoint si différent
  
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'

  const url = `${API}/api/filieres`
  const res = await axios.get(url)

  //const res = await axios.get('http://localhost:1337/api/filieres')
  const list = res.data?.data || []

  // compat Strapi attributes / flatten
  filieres.value = list.map(x => {
    const a = x.attributes ? ({ id: x.id, ...x.attributes }) : x
    return {
      id: a.id,
      nom: a.NomFiliere || a.nom || 'Filière',
      accroche: a.Accroche || 'Découvrir la filière et ses projets',
      icon: '🎓'
    }
  })
})
</script>

<style scoped>
.page{
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  padding:16px;
  max-width:700px;
  margin:0 auto;
  font-family:var(--font);
}

.intro{margin: 6px 0 12px;}
.intro h1{font-size:26px; margin:0;}
.intro p{margin:4px 0 0; color:var(--text-soft);}

.grid{display:flex; flex-direction:column; gap:10px;}

.card{
  border:1px solid var(--border);
  border-radius:20px;
  background:var(--card);
  box-shadow:var(--shadow);
}

.item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  text-decoration:none;
  color:inherit;
}
.item:active{transform:scale(.99);}

.icon{
  width:44px;height:44px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  background:var(--green-soft);
  font-size:18px;
}

.txt{flex:1;min-width:0;}
.title{font-weight:950;}
.desc{color:var(--text-soft);font-size:13px;margin-top:2px;}

.chev{font-size:22px;color:var(--text-soft);}
</style>
