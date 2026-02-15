<template>
  <div class="wrap">
    <header class="topbar">
      <router-link class="back" to="/">← Accueil</router-link>
      <div class="titles">
        <h1>Carte</h1>
        <p class="subtitle">Bâtiments & événements</p>
      </div>
    </header>

    <div class="map-shell card">
      <div class="filters">
        <label class="filter">
          <input type="checkbox" v-model="showBatiments" @change="refreshMarkers" />
          <span class="dot bat"></span>
          <span>Bâtiments</span>
        </label>
        <label class="filter">
          <input type="checkbox" v-model="showEvenements" @change="refreshMarkers" />
          <span class="dot evt"></span>
          <span>Événements</span>
        </label>
      </div>

      <div id="map" class="map"></div>

      <section class="sheet" :class="{ active: selectedBatiment }">
        <div v-if="selectedBatiment" class="sheet-inner">
          <div class="sheet-head">
            <h2 class="sheet-title">{{ selectedBatiment.NomDuBatiment }}</h2>
            <button class="close" type="button" @click="selectedBatiment = null" aria-label="Fermer">✕</button>
          </div>

          <p class="sheet-desc">{{ selectedBatiment.description || 'Aucune description disponible.' }}</p>

          <div class="divider"></div>

          <h3 class="sheet-sub">Salles & activités</h3>

          <ul v-if="selectedBatiment.salles && selectedBatiment.salles.length > 0" class="rooms">
            <li v-for="salle in selectedBatiment.salles" :key="salle.id" class="room">
              <div class="room-head">
                <span class="room-name">Salle {{ salle.NumeroSalle }}</span>
              </div>

              <div v-if="salle.evenements && salle.evenements.length > 0" class="room-events">
                <article v-for="evt in salle.evenements" :key="evt.id" class="evt-card">
                  <div class="evt-top">
                    <span class="badge">Événement</span>
                    <span v-if="evt.horaire" class="evt-time">🕒 {{ evt.horaire }}</span>
                  </div>
                  <div class="evt-title">{{ evt.nom }}</div>
                </article>
              </div>
            </li>
          </ul>

          <p v-else class="no-data">Aucune salle répertoriée pour ce bâtiment.</p>
        </div>

        <div v-else class="sheet-empty">
          Sélectionnez un point sur la carte pour voir les détails.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const selectedBatiment = ref(null)
const allBatiments = ref([])
const showBatiments = ref(true)
const showEvenements = ref(true)

let map = null
let markersLayer = null

const COLOR_DEFAULT_BAT = '#0EA5E9' // Accent (bleu repère)
const COLOR_DEFAULT_EVT = '#F59E0B' // Orange événement

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
    fillOpacity: 0.95
  }).on('click', () => {
    selectedBatiment.value = data
  })
}

const refreshMarkers = () => {
  if (!markersLayer || !map) return
  markersLayer.clearLayers()

  allBatiments.value.forEach((item) => {
    const data = item.attributes || item
    const lat = parseFloat(data.Latitude)
    const lng = parseFloat(data.Longitude)
    if (isNaN(lat) || isNaN(lng)) return

    const hasEvents = data.salles?.some((s) => s.evenements && s.evenements.length > 0)
    const customColor = formatHexa(data.pin_config?.CouleurHexa)

    let shouldShow = false
    let finalColor = '#000000'

    // PRIORITÉ 1 : ÉVÉNEMENT
    if (showEvenements.value && hasEvents) {
      shouldShow = true
      finalColor = COLOR_DEFAULT_EVT
    }
    // PRIORITÉ 2 : BÂTIMENT
    else if (showBatiments.value) {
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

onMounted(async () => {
  map = L.map('map').setView([47.247, -1.492], 17)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  markersLayer = L.featureGroup().addTo(map)

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337'
    const url = `${baseUrl}/api/batiments?populate[salles][populate]=evenements&populate[pin_config]=*`
    const response = await axios.get(url)
    allBatiments.value = response.data.data || []
    refreshMarkers()
  } catch (error) {
    console.error('Erreur API:', error)
  }
})
</script>

<style scoped>
.wrap{
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

.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:20px;
  box-shadow: var(--shadow);
}

.map-shell{
  overflow:hidden;
  position:relative;
  height: calc(100vh - 120px);
  min-height: 560px;
}

.filters{
  position:absolute;
  top:12px; left:12px; right:12px;
  display:flex; gap:10px; flex-wrap:wrap;
  z-index: 500;
  background: rgba(255,255,255,.85);
  backdrop-filter: blur(6px);
  border:1px solid var(--border);
  border-radius:16px;
  padding:10px 10px;
}
.filter{display:flex;align-items:center;gap:8px;font-weight:900;font-size:13px;color:var(--slate);}
.filter input{accent-color: var(--green-dark);}
.dot{width:10px;height:10px;border-radius:999px;display:inline-block;}
.dot.bat{background: var(--sky);}
.dot.evt{background: var(--amber);}

.map{height: 100%; width: 100%;}

.sheet{
  position:absolute;
  left:0; right:0; bottom:0;
  z-index: 600;
  background: rgba(255,255,255,.96);
  border-top: 1px solid var(--border);
  padding: 14px;
  max-height: 46%;
  overflow:auto;
}
.sheet-empty{
  color: var(--text-soft);
  font-weight: 700;
  text-align:center;
  padding: 10px 0;
}
.sheet-inner{padding-bottom: 6px;}
.sheet-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;}
.sheet-title{margin:0;font-size:16px;line-height:1.2;}
.close{
  border:1px solid var(--border);
  background: var(--card);
  border-radius: 12px;
  height: 36px;
  width: 36px;
  cursor:pointer;
}
.sheet-desc{margin:8px 0 0;color:var(--text-soft);font-size:14px;}
.divider{height:1px;background:var(--border);margin:12px 0;}
.sheet-sub{margin:0 0 10px;font-size:14px;color:var(--slate);}

.rooms{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
.room{
  border:1px solid var(--border);
  border-radius: 16px;
  padding: 12px;
  background: var(--card);
}
.room-name{font-weight:900;color:var(--slate);}

.room-events{margin-top:10px;display:flex;flex-direction:column;gap:10px;}
.evt-card{
  background: var(--amber-soft);
  border:1px solid rgba(245,158,11,.25);
  border-radius: 14px;
  padding: 10px 12px;
}
.evt-top{display:flex;justify-content:space-between;gap:10px;align-items:center;}
.badge{
  background: var(--amber);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.evt-time{font-size:12px;font-weight:900;color:var(--slate);}
.evt-title{margin-top:6px;font-weight:900;color:#7c2d12;}
.no-data{color:var(--text-soft);font-style:italic;margin:0;}

@media (min-width: 720px){
  .titles h1{font-size:24px;}
  .map-shell{height: calc(100vh - 140px);}
  .sheet{max-height: 40%;}
}
</style>
