<template>
  <main class="page">
    <header class="topbar">
      <router-link class="back" to="/">← Accueil</router-link>
      <div class="titles">
        <h1>Événements</h1>
        <p class="subtitle">Programme de la journée</p>
      </div>
    </header>

    <section class="section">
      <div class="segmented card" role="tablist" aria-label="Trier les événements">
        <button class="seg" :class="{ active: sortBy === 'time' }" @click="sortBy = 'time'">Heure</button>
        <button class="seg" :class="{ active: sortBy === 'building' }" @click="sortBy = 'building'">Bâtiment</button>
      </div>

      <div v-if="loading" class="state card">Chargement des événements…</div>

      <!-- TRI PAR HEURE -->
      <div v-else-if="sortBy === 'time'" class="timeline">
        <section v-for="(evts, time) in groupedByTime" :key="time" class="time-group">
          <div class="time-chip">{{ time }}</div>

          <article
            v-for="e in evts"
            :key="e.id"
            class="card event-card"
            :style="{ background: getLightColor(e.salle?.batiment?.pin_config?.CouleurHexa) }"
          >
            <div class="event-head">
              <h2 class="name">{{ e.nom }}</h2>
              <div class="pill">À voir</div>
            </div>

            <p v-if="e.description" class="desc">{{ e.description }}</p>

            <div class="meta">
              <span>📍 {{ e.salle?.batiment?.NomDuBatiment || 'Bâtiment' }}</span>
              <span v-if="e.salle?.NumeroSalle">• Salle {{ e.salle?.NumeroSalle }}</span>
            </div>
          </article>
        </section>
      </div>

      <!-- TRI PAR BATIMENT -->
      <div v-else class="timeline">
        <section v-for="(evts, building) in groupedByBuilding" :key="building" class="time-group">
          <div class="time-chip building-chip">🏢 {{ building }}</div>

          <article v-for="e in evts" :key="e.id" class="card event-card white">
            <div class="event-head">
              <h2 class="name">{{ e.nom }}</h2>
              <div class="pill time">{{ e.horaire }}</div>
            </div>

            <p v-if="e.description" class="desc">{{ e.description }}</p>

            <div class="meta">
              <span v-if="e.salle?.NumeroSalle">🚪 Salle {{ e.salle?.NumeroSalle }}</span>
            </div>
          </article>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const events = ref([])
const loading = ref(true)
const sortBy = ref('time')

const getLightColor = (hex) => {
  if (!hex) return 'var(--card)'
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`
  // Ajoute une opacité douce
  return `${cleanHex}1A` // ~10%
}

const groupedByTime = computed(() => {
  const groups = {}
  const sorted = [...events.value].sort((a, b) => {
    return (
      (a.salle?.batiment?.NomDuBatiment || '').localeCompare(b.salle?.batiment?.NomDuBatiment || '') ||
      (a.salle?.NumeroSalle || '').localeCompare(b.salle?.NumeroSalle || '') ||
      (a.nom || '').localeCompare(b.nom || '')
    )
  })
  sorted.forEach((e) => {
    if (!groups[e.horaire]) groups[e.horaire] = []
    groups[e.horaire].push(e)
  })
  return groups
})

const groupedByBuilding = computed(() => {
  const groups = {}
  const sorted = [...events.value].sort((a, b) => (a.horaire || '').localeCompare(b.horaire || ''))
  sorted.forEach((e) => {
    const bName = e.salle?.batiment?.NomDuBatiment || 'Sans bâtiment'
    if (!groups[bName]) groups[bName] = []
    groups[bName].push(e)
  })
  return groups
})

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337'
    const url = `${baseUrl}/api/evenements?populate[salle][populate][batiment][populate]=pin_config`
    const response = await axios.get(url)
    events.value = response.data.data || []
  } catch (err) {
    console.error('Erreur API:', err)
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

.segmented{display:flex;overflow:hidden;}
.seg{
  flex:1;height:44px;border:0;background:transparent;
  font-weight:900;color:var(--text-soft);cursor:pointer;
}
.seg.active{background:var(--slate); color:#fff;}
.seg:focus-visible{outline:3px solid rgba(14,165,233,.35); outline-offset:-3px;}

.state{padding:14px;margin-top:12px;}

.timeline{display:flex;flex-direction:column;gap:14px;margin-top:12px;}
.time-group{display:flex;flex-direction:column;gap:10px;}
.time-chip{
  align-self:flex-start;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid var(--border);
  background:var(--chip-bg);
  font-weight:900;
  font-size:13px;
}
.building-chip{background:var(--sky-soft);}

.event-card{padding:14px;}
.event-card.white{background:var(--card);}
.event-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;}
.name{margin:0;font-size:16px;line-height:1.25;}
.pill{
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  background:rgba(47,125,50,.10);
  color:var(--green-dark);
  border:1px solid rgba(47,125,50,.18);
  white-space:nowrap;
}
.pill.time{
  background:rgba(14,165,233,.10);
  color:var(--sky);
  border:1px solid rgba(14,165,233,.18);
}
.desc{margin:8px 0 0;color:var(--text-soft);font-size:14px;}
.meta{margin-top:10px;color:var(--slate);font-weight:700;font-size:13px;}
@media (min-width: 720px){
  .titles h1{font-size:24px;}
  .timeline{gap:18px;}
}
</style>
