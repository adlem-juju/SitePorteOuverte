<template>
  <div class="events-page">
    <header class="header">
      <router-link to="/" class="back-btn">← Accueil</router-link>
      <h1>Agenda des Événements</h1>
    </header>

    <div class="container">
      <div class="controls">
        <span class="label">Trier par :</span>
        <div class="btn-group">
          <button :class="{ active: sortBy === 'time' }" @click="sortBy = 'time'">🕒 Heure</button>
          <button :class="{ active: sortBy === 'building' }" @click="sortBy = 'building'">🏢 Bâtiment</button>
        </div>
      </div>

      <table v-if="sortBy === 'time'" class="event-table">
        <tr v-for="(evts, time) in groupedByTime" :key="time">
          <td class="time-col">{{ time }}</td>
          <td class="events-col">
            <div class="events-grid">
              <div 
                v-for="e in evts" 
                :key="e.id" 
                class="event-tile shadow"
                :style="{ backgroundColor: getLightColor(e.salle?.batiment?.pin_config?.CouleurHexa) }"
              >
                <h4>{{ e.nom }}</h4>
                <p class="desc">{{ e.description }}</p>
                <div class="loc">📍 {{ e.salle?.batiment?.NomDuBatiment }} - Salle {{ e.salle?.NumeroSalle }}</div>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <table v-else class="event-table">
        <tr v-for="(evts, building) in groupedByBuilding" :key="building">
          <td class="building-col">{{ building }}</td>
          <td class="events-col">
            <div class="events-grid">
              <div v-for="e in evts" :key="e.id" class="event-tile white-tile shadow">
                <span class="time-badge">{{ e.horaire }}</span>
                <h4>{{ e.nom }}</h4>
                <p class="desc">{{ e.description }}</p>
                <div class="loc">🚪 Salle {{ e.salle?.NumeroSalle }}</div>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div v-if="loading" class="loading">Chargement des événements...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const events = ref([])
const loading = ref(true)
const sortBy = ref('time') // 'time' ou 'building'

// Utilitaire pour éclaircir la couleur du bâtiment
const getLightColor = (hex) => {
  if (!hex) return '#f3f4f6';
  // Ajoute de l'opacité au format hexa (ex: #708d23 -> #708d2333)
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  return `${cleanHex}33`; 
}

// 1. Tri par Heure
const groupedByTime = computed(() => {
  const groups = {};
  const sorted = [...events.value].sort((a, b) => {
    // Tri secondaire : Batiment -> Salle -> Nom
    return a.salle?.batiment?.NomDuBatiment.localeCompare(b.salle?.batiment?.NomDuBatiment) ||
           a.salle?.NumeroSalle.localeCompare(b.salle?.NumeroSalle) ||
           a.nom.localeCompare(b.nom);
  });

  sorted.forEach(e => {
    if (!groups[e.horaire]) groups[e.horaire] = [];
    groups[e.horaire].push(e);
  });
  return groups;
});

// 2. Tri par Bâtiment
const groupedByBuilding = computed(() => {
  const groups = {};
  const sorted = [...events.value].sort((a, b) => a.horaire.localeCompare(b.horaire));

  sorted.forEach(e => {
    const bName = e.salle?.batiment?.NomDuBatiment || 'Sans bâtiment';
    if (!groups[bName]) groups[bName] = [];
    groups[bName].push(e);
  });
  return groups;
});

onMounted(async () => {
  try {
    // On peuple tout pour avoir accès aux salles, aux bâtiments et aux couleurs
    const url = 'http://localhost:1337/api/evenements?populate[salle][populate][batiment][populate]=pin_config'
    const response = await axios.get(url)
    events.value = response.data.data
  } catch (err) {
    console.error("Erreur API:", err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.events-page { min-height: 100vh; background: #f8fafc; }
.header { background: #1e3a8a; color: white; padding: 1.5rem; display: flex; align-items: center; gap: 20px; }
.container { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }

.controls { margin-bottom: 2rem; display: flex; align-items: center; gap: 15px; }
.btn-group button { 
  padding: 8px 20px; border: 1px solid #1e3a8a; background: white; color: #1e3a8a; cursor: pointer;
  transition: 0.3s;
}
.btn-group button:first-child { border-radius: 8px 0 0 8px; }
.btn-group button:last-child { border-radius: 0 8px 8px 0; }
.btn-group button.active { background: #1e3a8a; color: white; }

.event-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.event-table tr { border-bottom: 1px solid #e2e8f0; }

.time-col, .building-col { 
  width: 150px; padding: 2rem; font-weight: bold; font-size: 1.2rem; 
  background: #f1f5f9; color: #1e3a8a; text-align: center;
}

.events-col { padding: 1.5rem; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }

.event-tile { padding: 1.2rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05); }
.white-tile { background: white; border: 1px solid #e2e8f0; }
.shadow { box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

.time-badge { background: #1e3a8a; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
h4 { margin: 10px 0 5px 0; color: #1e293b; }
.desc { font-size: 0.9rem; color: #64748b; margin-bottom: 10px; }
.loc { font-size: 0.85rem; font-weight: 600; color: #1e3a8a; }

.loading { text-align: center; padding: 3rem; color: #64748b; }
</style>