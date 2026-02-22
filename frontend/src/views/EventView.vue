<template>
  <main class="page-container">
    <section class="filters">
      <button class="ui-chip" :class="{active: mode==='heure'}" @click="mode='heure'">Heure</button>
      <button class="ui-chip" :class="{active: mode==='batiment'}" @click="mode='batiment'">Bâtiment</button>
    </section>

    <div v-if="loading" class="state">Chargement des événements…</div>
    <div v-else-if="error" class="state error-text">{{ error }}</div>

    <section v-else class="timeline">
      <template v-for="(group, key) in groupedEvents" :key="key">
        <div class="group-header">{{ key }}</div>

        <article v-for="evt in group" :key="evt.id" class="ui-card event-card">
          <div class="event-head">
            <span class="time">🕒 {{ evt.horaire || '—' }}</span>
          </div>

          <div class="title">{{ evt.nom || 'Sans titre' }}</div>

          <div class="location">
            📍 {{ evt.batiment || 'Sans bâtiment' }}<span v-if="evt.salle"> — {{ evt.salle }}</span>
          </div>

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
    const key = mode.value === 'heure' ? (e.horaire || 'Sans horaire') : (e.batiment || 'Sans bâtiment')
    ;(groups[key] ||= []).push(e)
  })

  return groups
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    // ON GARDE TON URL QUI MARCHE :
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
/* Nettoyage : on ne garde que le spécifique */
.ui-chip.active {
  background: var(--green-soft);
  border-color: var(--green);
  color: var(--green-dark);
}

.state { padding: 12px 0; color: var(--text-soft); font-weight: 700; text-align: center; }
.error-text { color: #b91c1c; }

.timeline { display: flex; flex-direction: column; gap: 12px; }

.group-header {
  font-weight: 950;
  color: var(--green-dark);
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 14px;
  background: var(--green-soft);
  border: 1px solid rgba(47,125,50,.25);
}

.event-card { padding: 16px; }

.event-head { display: flex; justify-content: space-between; margin-bottom: 6px; }
.time { color: var(--text-soft); font-weight: 800; }
.title { font-weight: 900; font-size: 18px; margin-bottom: 6px; line-height: 1.2; }
.location { color: var(--text-soft); font-size: 14px; }
.map-link { display: inline-block; margin-top: 12px; font-weight: 800; color: var(--sky); text-decoration: none; }
</style>