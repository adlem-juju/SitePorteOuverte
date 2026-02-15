<template>
  <div class="map-view">
    <header class="header">
      <router-link to="/" class="back-btn">←</router-link>
      <h1>Géolocalisation</h1>
    </header>

    <div class="filters-container">
      <label class="filter-item">
        <input type="checkbox" v-model="showBatiments" @change="refreshMarkers">
        <span class="dot batiment"></span> Bâtiments
      </label>
      <label class="filter-item">
        <input type="checkbox" v-model="showEvenements" @change="refreshMarkers">
        <span class="dot evenement"></span> Événements
      </label>
    </div>

    <div id="map" class="map-container"></div>

    <div class="details-zone" :class="{ 'active': selectedBatiment }">
      <div v-if="selectedBatiment">
        <h2>{{ selectedBatiment.NomDuBatiment }}</h2>
        <p class="bat-desc">{{ selectedBatiment.description || 'Aucune description disponible.' }}</p>
        <hr />
        <h3>Salles & Activités :</h3>
        <ul class="salles-list" v-if="selectedBatiment.salles && selectedBatiment.salles.length > 0">
          <li v-for="salle in selectedBatiment.salles" :key="salle.id" class="salle-item">
            <div class="salle-content">
              <span class="salle-nom">Salle {{ salle.NumeroSalle }}</span>
              
              <div v-if="salle.evenements && salle.evenements.length > 0" class="events-container">
                <div v-for="evt in salle.evenements" :key="evt.id" class="event-box">
                  <span class="event-badge">Événement</span>
                  <p class="event-title">{{ evt.nom }}</p>
                  <p class="event-time" v-if="evt.horaire">🕒 {{ evt.horaire }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no-data">Aucune salle répertoriée pour ce bâtiment.</p>
      </div>
      <div v-else class="placeholder-text">Sélectionnez un point sur la carte pour voir les détails</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const selectedBatiment = ref(null);
const allBatiments = ref([]);
const showBatiments = ref(true);
const showEvenements = ref(true);

let map = null;
let markersLayer = null;

const COLOR_DEFAULT_BAT = '#3498db'; 
const COLOR_DEFAULT_EVT = '#e74c3c'; 

const formatHexa = (hex) => {
  if (!hex) return null;
  const cleanHex = String(hex).trim();
  return cleanHex.startsWith('#') ? cleanHex : `#${cleanHex}`;
};

const createMarker = (lat, lng, color, data) => {
  return L.circleMarker([lat, lng], {
    radius: 10,
    fillColor: color,
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).on('click', () => { selectedBatiment.value = data; });
};

const refreshMarkers = () => {
  if (!markersLayer || !map) return;
  markersLayer.clearLayers();

  allBatiments.value.forEach(item => {
    // 1. Accès sécurisé aux données (Strapi 5 peut mettre les infos dans .attributes ou en direct)
    const data = item.attributes || item;
    const lat = parseFloat(data.Latitude);
    const lng = parseFloat(data.Longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    // 2. Détection précise des événements
    // On vérifie si "evenements" existe ET n'est pas vide
    const hasEvents = data.salles?.some(s => s.evenements && s.evenements.length > 0);
    
    // 3. Récupération de la couleur personnalisée
    const customColor = formatHexa(data.pin_config?.CouleurHexa);

    // 4. LOGIQUE DE DÉCISION STRICTE
    let shouldShow = false;
    let finalColor = '#000000'; // Noir par défaut pour repérer les erreurs

    // --- PRIORITÉ 1 : ÉVÉNEMENT ---
    // Si le filtre est actif ET qu'il y a un événement
    if (showEvenements.value && hasEvents) {
      shouldShow = true;
      finalColor = COLOR_DEFAULT_EVT; // ON FORCE LE ROUGE (priorité visuelle absolue)
    } 
    // --- PRIORITÉ 2 : BÂTIMENT ---
    // On ne rentre ici que si le point n'est pas déjà affiché comme événement
    else if (showBatiments.value) {
      shouldShow = true;
      // On prend la couleur perso si elle existe, sinon le bleu
      finalColor = customColor || COLOR_DEFAULT_BAT;
    }

    // 5. AFFICHAGE
    if (shouldShow) {
      createMarker(lat, lng, finalColor, data).addTo(markersLayer);
    }
  });

  const bounds = markersLayer.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
};

onMounted(async () => {
  map = L.map('map').setView([47.247, -1.492], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  markersLayer = L.featureGroup().addTo(map);

  try {
    // Note : On change le pluriel dans le populate pour 'evenements' (selon ton nouveau nom de relation)
    const url = 'http://localhost:1337/api/batiments?populate[salles][populate]=evenements&populate[pin_config]=*';
    const response = await axios.get(url);
    allBatiments.value = response.data.data;
    refreshMarkers();
  } catch (error) {
    console.error("Erreur API:", error);
  }
});
</script>

<style scoped>
.map-view { display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; }
.header { background: #34495e; color: white; padding: 1rem; display: flex; align-items: center; gap: 20px; }
.filters-container { display: flex; gap: 20px; padding: 12px; background: #f8f9fa; border-bottom: 1px solid #ddd; justify-content: center; }
.filter-item { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: bold; }
.dot { height: 12px; width: 12px; border-radius: 50%; display: inline-block; }
.dot.batiment { background-color: #3498db; }
.dot.evenement { background-color: #e74c3c; }
.map-container { flex: 2; width: 100%; z-index: 1; }
.details-zone { flex: 1; background: white; padding: 20px; overflow-y: auto; border-top: 3px solid #3498db; }
.event-box { margin-top: 8px; padding: 8px; background: #fff5f5; border-left: 3px solid #e74c3c; border-radius: 4px; }
.event-badge { background: #e74c3c; color: white; font-size: 0.6rem; padding: 1px 6px; border-radius: 10px; text-transform: uppercase; }
.event-title { font-weight: bold; margin: 3px 0; color: #c0392b; font-size: 0.9rem; }
.event-time { font-size: 0.8rem; color: #666; margin: 0; }
.placeholder-text { text-align: center; color: #7f8c8d; margin-top: 20px; font-style: italic; }
.salle-item { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
</style>