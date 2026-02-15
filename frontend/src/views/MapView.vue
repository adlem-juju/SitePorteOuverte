<template>
  <main class="page">

    <!-- Filtres (chips) -->
    <section class="filters">
      <label class="chip">
        <input type="checkbox" v-model="showBatiments" @change="refreshMarkers" />
        <span class="dot dot-bat"></span>
        Bâtiments
      </label>

      <label class="chip">
        <input type="checkbox" v-model="showEvenements" @change="refreshMarkers" />
        <span class="dot dot-evt"></span>
        Événements
      </label>

      <span class="hint">Touchez un point sur la carte pour voir les détails.</span>
    </section>

    <!-- Carte -->
    <section class="map-card">
      <div id="map" class="map"></div>
    </section>

    <!-- Détails (bottom sheet) -->
    <section class="sheet" :class="{ active: !!selectedBatiment }" aria-live="polite">
      <div v-if="selectedBatiment" class="sheet-inner">
        <div class="sheet-head">
          <div class="sheet-title">
            <h2>{{ selectedBatiment.NomDuBatiment }}</h2>
            <p class="desc">
              {{ selectedBatiment.description || 'Aucune description disponible.' }}
            </p>
          </div>
          <button class="close" type="button" @click="selectedBatiment = null" aria-label="Fermer">
            ✕
          </button>
        </div>

        <div class="divider"></div>

        <h3>Salles & activités</h3>

        <div v-if="selectedBatiment.salles && selectedBatiment.salles.length > 0" class="rooms">
          <details
            v-for="salle in selectedBatiment.salles"
            :key="salle.id"
            class="room card"
          >
            <summary class="room-summary">
              <span class="room-name">Salle {{ salle.NumeroSalle }}</span>
              <span class="room-meta">
                {{ (salle.evenements && salle.evenements.length) ? `${salle.evenements.length} événement(s)` : 'Aucun événement' }}
              </span>
            </summary>

            <div class="room-body">
              <div v-if="salle.evenements && salle.evenements.length > 0" class="events">
                <article v-for="evt in salle.evenements" :key="evt.id" class="event card-soft">
                  <div class="event-top">
                    <span class="badge">Événement</span>
                    <span v-if="evt.horaire" class="time">🕒 {{ evt.horaire }}</span>
                  </div>
                  <div class="event-title">{{ evt.nom }}</div>
                </article>
              </div>

              <p v-else class="empty">Aucun événement prévu dans cette salle.</p>
            </div>
          </details>
        </div>

        <p v-else class="empty">Aucune salle répertoriée pour ce bâtiment.</p>
      </div>

      <div v-else class="sheet-placeholder">
        <div class="placeholder card">
          <div class="placeholder-title">Sélectionnez un point</div>
          <div class="placeholder-text">
            Touchez un bâtiment (bleu/vert) ou un point événement (rouge) pour afficher les salles & activités.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import { useRoute } from 'vue-router'


const selectedBatiment = ref(null)
const allBatiments = ref([])
const showBatiments = ref(true)
const showEvenements = ref(true)

let focusHighlightLayer = null

let map = null
let markersLayer = null

const COLOR_DEFAULT_BAT = '#3498db'
const COLOR_DEFAULT_EVT = '#e74c3c'

const formatHexa = (hex) => {
  if (!hex) return null
  const cleanHex = String(hex).trim()
  return cleanHex.startsWith('#') ? cleanHex : `#${cleanHex}`
}

const createMarker = (lat, lng, color, data) => {
  return L.circleMarker([lat, lng], {
    radius: 10,
    fillColor: color,
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).on('click', () => {
    selectedBatiment.value = data
    drawFocusHighlight(lat, lng)
  })
}

const drawFocusHighlight = (lat, lng, color = '#000') => {
  if (!map) return

  // Supprime ancien highlight
  if (focusHighlightLayer) {
    map.removeLayer(focusHighlightLayer)
    focusHighlightLayer = null
  }

  // Cercle noir épais
  const ring = L.circleMarker([lat, lng], {
    radius: 16,
    color: '#000',
    weight: 4,
    fillOpacity: 0
  })

  // Pulse doux
  const glow = L.circleMarker([lat, lng], {
    radius: 24,
    color: color,
    weight: 2,
    opacity: 0.4,
    fillOpacity: 0
  })

  focusHighlightLayer = L.layerGroup([ring, glow]).addTo(map)
}

const refreshMarkers = () => {
  if (!markersLayer || !map) return
  markersLayer.clearLayers()

  allBatiments.value.forEach(item => {
    const data = item.attributes || item
    const lat = parseFloat(data.Latitude)
    const lng = parseFloat(data.Longitude)
    if (isNaN(lat) || isNaN(lng)) return

    const hasEvents = data.salles?.some(s => s.evenements && s.evenements.length > 0)
    const customColor = formatHexa(data.pin_config?.CouleurHexa)

    let shouldShow = false
    let finalColor = '#000000'

    if (showEvenements.value && hasEvents) {
      shouldShow = true
      finalColor = COLOR_DEFAULT_EVT
    } else if (showBatiments.value) {
      shouldShow = true
      finalColor = customColor || COLOR_DEFAULT_BAT
    }

    if (shouldShow) {
      createMarker(lat, lng, finalColor, data).addTo(markersLayer)
    }
  })

  const bounds = markersLayer.getBounds()
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 })
}

const route = useRoute()

const focusBatimentById = (id) => {
  if (!id) return
  const found = allBatiments.value.find(b => String(b.id) === String(id))
  if (!found) return

  const data = found.attributes || found
  const lat = parseFloat(data.Latitude)
  const lng = parseFloat(data.Longitude)
  if (isNaN(lat) || isNaN(lng) || !map) return

  // centre + zoom
  map.setView([lat, lng], 18, { animate: true })
  // ouvre la fiche (bottom sheet)
  selectedBatiment.value = data
  drawFocusHighlight(lat, lng)

}


onMounted(async () => {
  map = L.map('map').setView([47.247, -1.492], 17)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  markersLayer = L.featureGroup().addTo(map)

  try {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'

    const url = `${API}/api/batiments?populate[salles][populate]=evenements&populate[pin_config]=*`
    const response = await axios.get(url)
    allBatiments.value = response.data.data
    refreshMarkers()
    const focusId = route.query.focus
    if (focusId) {
      focusBatimentById(focusId)
    }
  } catch (error) {
    console.error('Erreur API:', error)
  }
})
</script>

<style scoped>
.page{
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  padding:16px;
  max-width: 900px;
  margin: 0 auto;
  font-family: var(--font);
}

.topbar{
  display:flex;
  align-items:flex-start;
  gap:12px;
  margin-bottom:12px;
}
.back{
  padding:8px 10px;
  border-radius:12px;
  border:1px solid var(--border);
  background: var(--card);
  text-decoration:none;
  color:var(--text);
  font-weight:700;
  white-space:nowrap;
}
.titles h1{font-size:26px; line-height:1.1; margin:0;}
.titles p{margin:2px 0 0; color:var(--text-soft); font-size:14px;}

.filters{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
  margin-bottom:12px;
}
.chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid var(--border);
  background: var(--card);
  box-shadow: var(--shadow);
  font-weight:700;
  font-size:13px;
  cursor:pointer;
  user-select:none;
}
.chip input{ accent-color: var(--green-dark); }
.dot{width:10px;height:10px;border-radius:999px; display:inline-block;}
.dot-bat{ background: #3498db; }
.dot-evt{ background: #e74c3c; }

.hint{
  flex: 1 1 260px;
  color: var(--text-soft);
  font-size: 13px;
  font-weight: 600;
}

.map-card{
  border-radius:20px;
  overflow:hidden;
  border:1px solid var(--border);
  box-shadow: var(--shadow);
  background: #fff;
}

.map{
  width:100%;
  height: 56vh;
}

/* IMPORTANT : neutralise le reset global sur les tuiles Leaflet */
.map :deep(img){
  max-width: none !important;
}

.sheet{
  margin-top:12px;
}
.sheet-inner{
  background: var(--card);
  border:1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding:14px;
}

.sheet-head{
  display:flex;
  gap:12px;
  align-items:flex-start;
  justify-content:space-between;
}
.sheet-title h2{margin:0; font-size:18px;}
.desc{margin:4px 0 0; color:var(--text-soft); font-size:14px;}
.close{
  width:40px;height:40px;border-radius:14px;
  border:1px solid var(--border);
  background: transparent;
  font-weight:900;
  cursor:pointer;
}
.divider{height:1px; background: var(--border); margin:12px 0;}

h3{margin:0 0 10px; font-size:16px;}

.rooms{display:flex; flex-direction:column; gap:10px;}
.card{
  border:1px solid var(--border);
  border-radius:18px;
  background: var(--card);
}
.room{overflow:hidden;}
.room-summary{
  list-style:none;
  cursor:pointer;
  padding:12px 12px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  font-weight:900;
}
.room-summary::-webkit-details-marker{display:none;}
.room-meta{color: var(--text-soft); font-weight:700; font-size:13px;}
.room-body{padding:0 12px 12px;}

.events{display:flex; flex-direction:column; gap:10px; margin-top:10px;}
.card-soft{
  border:1px solid var(--border);
  border-radius:16px;
  background: var(--amber-soft);
  padding:10px 10px;
}
.event-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:6px;
}
.badge{
  display:inline-flex;
  align-items:center;
  padding:4px 8px;
  border-radius:999px;
  background:#e74c3c;
  color:#fff;
  font-size:11px;
  font-weight:900;
  letter-spacing:.02em;
}
.time{color: var(--text-soft); font-weight:700; font-size:12px;}
.event-title{font-weight:900;}

.empty{
  margin:8px 0 0;
  color: var(--text-soft);
  font-size:14px;
}

.sheet-placeholder .placeholder{
  padding:14px;
  border-radius:20px;
  border:1px solid var(--border);
  background: var(--card);
  box-shadow: var(--shadow);
}
.placeholder-title{font-weight:900; margin-bottom:6px;}
.placeholder-text{color: var(--text-soft); font-size:14px;}

@media (min-width: 760px){
  .map{ height: 62vh; }
}
</style>
