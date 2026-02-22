<template>
  <main class="page-container">
    <section class="filters">
      <label class="ui-chip" :class="{ 'active-bat': showBatiments }">
        <input type="checkbox" v-model="showBatiments" @change="refreshMarkers" class="hidden-input" />
        <span class="dot dot-bat"></span> Bâtiments
      </label>
      <label class="ui-chip" :class="{ 'active-evt': showEvenements }">
        <input type="checkbox" v-model="showEvenements" @change="refreshMarkers" class="hidden-input" />
        <span class="dot dot-evt"></span> Événements
      </label>
      <span class="hint">Touchez un point pour voir les détails.</span>
    </section>

   <section class="map-wrapper ui-card">
  <div id="map" class="leaflet-container"></div>
</section>

    <section class="sheet" :class="{ active: !!selectedBatiment }">
      <div v-if="selectedBatiment" class="ui-card sheet-inner">
        <div class="sheet-head">
          <div class="sheet-title">
            <h2>{{ selectedBatiment.NomDuBatiment }}</h2>
            <p class="desc-text">{{ selectedBatiment.description || 'Aucune description.' }}</p>
          </div>
          <button class="close-btn" @click="selectedBatiment = null">✕</button>
        </div>

        <div class="divider"></div>

        <h3>Salles & activités</h3>
        <div v-if="selectedBatiment.salles?.length" class="rooms-list">
          <details v-for="salle in selectedBatiment.salles" :key="salle.id" class="room-item ui-card">
            <summary class="room-summary">
              <span>Salle {{ salle.NumeroSalle }}</span>
              <span class="ui-badge">{{ salle.evenements?.length || 0 }} évt.</span>
            </summary>
            <div class="room-body">
               <article v-for="evt in salle.evenements" :key="evt.id" class="event-mini">
                  <div class="event-meta">
                    <span class="ui-badge danger">Événement</span>
                    <span v-if="evt.horaire">🕒 {{ evt.horaire }}</span>
                  </div>
                  <strong>{{ evt.nom }}</strong>
               </article>
            </div>
          </details>
        </div>
        <p v-else class="empty-msg">Aucune salle répertoriée pour ce bâtiment.</p>
      </div>

      <div v-else class="ui-card placeholder-card">
        <strong>Sélectionnez un point</strong>
        <p class="desc-text">Touchez un bâtiment ou un événement pour afficher les détails.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import { useRoute } from 'vue-router'

const selectedBatiment = ref(null)
const allBatiments = ref([])
const showBatiments = ref(true)
const showEvenements = ref(true)
const route = useRoute()

let map = null
let markersLayer = null
let focusHighlightLayer = null

/**
 * Fonction pour aplatir les données Strapi (gère attributes et data)
 */
const flattenStrapi = (item) => {
  if (!item) return null
  const id = item.id
  const attributes = item.attributes || item
  
  // Traitement récursif des relations (salles, pin_config, etc.)
  const result = { id, ...attributes }
  
  if (result.salles?.data) {
    result.salles = result.salles.data.map(s => {
      const sData = { id: s.id, ...s.attributes }
      if (sData.evenements?.data) {
        sData.evenements = sData.evenements.data.map(e => ({ id: e.id, ...e.attributes }))
      }
      return sData
    })
  }
  
  if (result.pin_config?.data) {
    result.pin_config = result.pin_config.data.attributes
  }

  return result
}

const refreshMarkers = () => {
  if (!markersLayer || !map) return
  markersLayer.clearLayers()

  allBatiments.value.forEach(item => {
    const data = flattenStrapi(item)
    const lat = parseFloat(data.Latitude)
    const lng = parseFloat(data.Longitude)
    
    if (isNaN(lat) || isNaN(lng)) return

    const hasEvents = data.salles?.some(s => s.evenements && s.evenements.length > 0)
    let finalColor = '#3498db'
    let shouldShow = false

    if (showEvenements.value && hasEvents) {
      shouldShow = true
      finalColor = '#e74c3c' // Rouge pour les événements
    } else if (showBatiments.value) {
      shouldShow = true
      
      // RÉPARATION DE LA COULEUR ICI
      const rawColor = data.pin_config?.CouleurHexa
      if (rawColor) {
        // On vérifie si le # est présent, sinon on l'ajoute
        finalColor = rawColor.startsWith('#') ? rawColor : `#${rawColor}`
      } else {
        finalColor = '#3498db'
      }
    }

    if (shouldShow) {
      L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: finalColor,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9
      }).on('click', () => {
        selectedBatiment.value = data
        drawFocusHighlight(lat, lng)
      }).addTo(markersLayer)
    }
  })

  // Centrage automatique sur les points
  if (markersLayer.getLayers().length > 0 && !route.query.focus) {
    map.fitBounds(markersLayer.getBounds(), { padding: [40, 40] })
  }
}

const drawFocusHighlight = (lat, lng) => {
  if (focusHighlightLayer) map.removeLayer(focusHighlightLayer)
  focusHighlightLayer = L.layerGroup([
    L.circleMarker([lat, lng], { radius: 16, color: '#000', weight: 4, fillOpacity: 0 }),
    L.circleMarker([lat, lng], { radius: 24, color: '#000', weight: 2, opacity: 0.4, fillOpacity: 0 })
  ]).addTo(map)
}

onMounted(async () => {
  await nextTick()
  
  // Init Leaflet
  map = L.map('map').setView([47.247, -1.492], 17)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  markersLayer = L.featureGroup().addTo(map)

  // Fix rendu
  setTimeout(() => { map.invalidateSize() }, 400)

  try {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
    
    // Requête corrigée pour éviter la 400 Bad Request
    const url = `${API}/api/batiments?populate[salles][populate]=evenements&populate[pin_config]=*`
    const res = await axios.get(url)
    
    allBatiments.value = res.data.data
    refreshMarkers()

    // Focus depuis l'URL
    if (route.query.focus) {
      const target = allBatiments.value.find(b => String(b.id) === String(route.query.focus))
      if (target) {
        const d = flattenStrapi(target)
        map.setView([d.Latitude, d.Longitude], 18)
        selectedBatiment.value = d
        drawFocusHighlight(d.Latitude, d.Longitude)
      }
    }
  } catch (e) {
    console.error("Erreur API :", e)
  }
})
</script>

<style scoped>
.hidden-input { display: none; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-bat { background: #3498db; }
.dot-evt { background: #e74c3c; }

.filters {
  padding: 4px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  margin-bottom: 16px;
}
.map-card {
  border-radius: var(--radius-lg); /* Plus arrondi */
  border: 2px solid white; /* Effet de bordure blanche pour faire ressortir */
  box-shadow: var(--shadow-md);
}
.active-bat { border-color: #3498db; background: var(--sky-soft); }
.active-evt { border-color: #e74c3c; background: var(--amber-soft); }

.sheet { margin-top: 12px; }
.sheet-inner { padding: 16px; }
.sheet-head { display: flex; justify-content: space-between; gap: 12px; }

.close-btn { 
  width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border);
  background: transparent; cursor: pointer; font-weight: 900;
}

.divider { height: 1px; background: var(--border); margin: 16px 0; }
.rooms-list { display: flex; flex-direction: column; gap: 8px; }

.room-summary { padding: 12px; cursor: pointer; display: flex; justify-content: space-between; list-style: none; font-weight: 800; }
.room-summary::-webkit-details-marker { display: none; }

.event-mini { padding: 10px; background: var(--bg); border-radius: 12px; margin-top: 8px; }
.event-meta { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
.ui-badge.danger { background: #e74c3c; color: white; }

.desc-text { color: var(--text-soft); font-size: 14px; margin-top: 4px; }
.placeholder-card { padding: 20px; text-align: center; }
.empty-msg { color: var(--text-soft); font-size: 14px; margin-top: 8px; }
</style>