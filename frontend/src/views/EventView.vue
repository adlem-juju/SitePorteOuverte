<template>
  <main class="page">
    

    <section class="filters">
      <button class="chip" :class="{active: mode==='heure'}" @click="mode='heure'">Heure</button>
      <button class="chip" :class="{active: mode==='batiment'}" @click="mode='batiment'">Bâtiment</button>
    </section>

    <div v-if="loading" class="state">Chargement des événements…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <section v-else class="timeline">
      <template v-for="(group, key) in groupedEvents" :key="key">
        <div class="group-header">{{ key }}</div>

        <article v-for="evt in group" :key="evt.id" class="event card">
          <div class="event-head">
            <span class="badge">Événement</span>
            <span class="time">🕒 {{ evt.horaire || '—' }}</span>
          </div>

          <div class="title">{{ evt.nom || 'Sans titre' }}</div>

          <div class="location">
            📍 {{ evt.batiment || 'Sans bâtiment' }}<span v-if="evt.salle"> — {{ evt.salle }}</span>
          </div>

          <!-- Optionnel : lien carte si tu gères un focus -->
          <router-link
            v-if="evt.batiment_id"
            :to="`/map?focus=${evt.batiment_id}`"
            class="map-link"
          >
            Voir sur la carte →
          </router-link>
        </article>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const rawEvents = ref([])
const loading = ref(true)
const error = ref('')
const mode = ref('heure')

/**
 * Rend compatible Strapi standard (attributes) ET ton format actuel (flatten).
 */
const pick = (item) => item?.attributes ? ({ id: item.id, ...item.attributes }) : item

const normalize = (item) => {
  const e = pick(item) || {}
  const salleObj = e.salle?.data ? pick(e.salle.data) : e.salle
  const batObj = salleObj?.batiment?.data ? pick(salleObj.batiment.data) : salleObj?.batiment

  return {
    id: e.id,
    nom: e.nom,
    horaire: e.horaire,
    description: e.description,
    salle: salleObj?.NumeroSalle ? `Salle ${salleObj.NumeroSalle}` : (salleObj?.NumeroSalle ?? ''),
    batiment: batObj?.NomDuBatiment || '',
    batiment_id: batObj?.id || null
  }
}

const events = computed(() => rawEvents.value.map(normalize))

const groupedEvents = computed(() => {
  const groups = {}
  const list = [...events.value].filter(e => e && e.id)

  // tri stable
  list.sort((a, b) => {
    if (mode.value === 'heure') {
      return (a.horaire || '').localeCompare(b.horaire || '') ||
             (a.batiment || '').localeCompare(b.batiment || '') ||
             (a.nom || '').localeCompare(b.nom || '')
    }
    return (a.batiment || '').localeCompare(b.batiment || '') ||
           (a.horaire || '').localeCompare(b.horaire || '') ||
           (a.nom || '').localeCompare(b.nom || '')
  })

  list.forEach(e => {
    const key = mode.value === 'heure'
      ? (e.horaire || 'Sans horaire')
      : (e.batiment || 'Sans bâtiment')
    ;(groups[key] ||= []).push(e)
  })

  return groups
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // On garde ton URL d’origine (celle qui marche chez toi)
    //const url = 'http://localhost:1337/api/evenements?populate[salle][populate][batiment][populate]=pin_config'
    
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    const url = `${API}/api/evenements?populate[salle][populate][batiment][populate]=pin_config`
    const res = await axios.get(url)
    rawEvents.value = res.data?.data || []
  } catch (e) {
    console.error(e)
    error.value = "Impossible de charger les événements (API)."
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
  max-width:700px;
  margin:0 auto;
  font-family:var(--font);
}

.topbar{display:flex;gap:12px;margin-bottom:12px;}
.back{
  padding:8px 10px;
  border-radius:12px;
  border:1px solid var(--border);
  background:var(--card);
  text-decoration:none;
  color:var(--text);
  font-weight:700;
  white-space:nowrap;
}
.titles h1{margin:0;font-size:26px;}
.titles p{margin:2px 0 0;color:var(--text-soft);}

.filters{display:flex;gap:8px;margin-bottom:12px;}
.chip{
  padding:8px 12px;
  border-radius:999px;
  border:1px solid var(--border);
  background:var(--card);
  cursor:pointer;
  font-weight:800;
}
.chip.active{
  background:var(--green-soft);
  border-color:var(--green);
}

.state{padding:12px 0;color:var(--text-soft);font-weight:700;}
.state.error{color:#b91c1c;}

.timeline{display:flex;flex-direction:column;gap:12px;}
.group-header{
  font-weight: 950;
  color: var(--text);
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 14px;
  background: var(--green-soft);
  border: 1px solid rgba(47,125,50,.25);
  box-shadow: 0 8px 20px rgba(15,23,42,.04);
}


.card{
  border:1px solid var(--border);
  border-radius:18px;
  background:var(--card);
  padding:12px;
  box-shadow:var(--shadow);
}

.event-head{display:flex;justify-content:space-between;margin-bottom:6px;gap:12px;}
.badge{
  background:#e74c3c;
  color:white;
  padding:3px 8px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
}
.time{color:var(--text-soft);font-weight:800;}
.title{font-weight:900;font-size:18px;margin-bottom:6px;}
.location{color:var(--text-soft);font-size:14px;}

.map-link{display:inline-block;margin-top:8px;font-weight:800;color:var(--sky);}
</style>
