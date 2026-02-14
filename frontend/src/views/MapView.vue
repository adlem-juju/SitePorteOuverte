<template>
  <div class="map-view">
    <header class="header">
      <router-link to="/" class="back-btn">←</router-link>
      <h1>Géolocalisation</h1>
    </header>

    <div id="map" class="map-container"></div>
     <div class="details-zone" :class="{ 'active': selectedBatiment }">
        <div v-if="selectedBatiment">
          <h2>{{ selectedBatiment.NomDuBatiment }}</h2>
          <p class="bat-desc">{{ selectedBatiment.description }}</p>
          
          <hr />

          <h3>Salles dans ce bâtiment :</h3>
          <ul class="salles-list" v-if="selectedBatiment.salles && selectedBatiment.salles.length > 0">
            <li v-for="salle in selectedBatiment.salles" :key="salle.id" class="salle-item">
              <div class="salle-content">
                <span class="salle-nom">Porte {{ salle.NumeroSalle }}</span>
                
                <div v-if="salle.evenement" class="event-box">
                  <span class="event-badge">Événement</span>
                  <p class="event-title">{{ salle.evenement.nom }}</p>
                  <p class="event-time" v-if="salle.evenement.horaire">
                    🕒 {{ salle.evenement.horaire }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <p v-else class="no-data">Aucune salle répertoriée pour ce bâtiment.</p>
        </div>
        <p v-else class="placeholder">Cliquez sur un bâtiment sur la carte pour voir les détails.</p>
      </div> 
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// CONFIGURATION DES ICONES (Méthode CDN robuste)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// On applique cette icône par défaut à tous les futurs marqueurs
L.Marker.prototype.options.icon = DefaultIcon;

const selectedBatiment = ref(null)
let map = null

onMounted(async () => {
  // Initialisation de la carte centrée sur le lycée
  map = L.map('map').setView([47.248, -1.503], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  try {
  
     //const response = await axios.get('http://localhost:1337/api/batiments');
    // On demande à Strapi d'inclure les salles, et pour chaque salle, d'inclure la matière
// Remplace ta ligne axios.get par celle-ci :
//const response = await axios.get('http://localhost:1337/api/batiments?populate[salles][populate]=*');
// Dans onMounted, remplace ton axios.get par celui-ci :
//const response = await axios.get('http://localhost:1337/api/batiments?populate=salles');
const response = await axios.get('http://localhost:1337/api/batiments?populate[salles][populate]=evenement');

    // Strapi 5 renvoie souvent les données directement dans data.data
    const batiments = response.data.data;

    if (batiments && batiments.length > 0) {
      const markersBounds = [];

      batiments.forEach(item => {
        const b = item.attributes || item;
        
        // Sécurité : Conversion forcée en nombres
        const lat = parseFloat(b.Latitude);
        const lng = parseFloat(b.Longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          // On crée le marqueur en lui passant explicitement notre icône
          const marker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(map);
          markersBounds.push([lat, lng]);

          marker.on('click', () => {
            selectedBatiment.value = b;
          });
        }
      });

      if (markersBounds.length > 0) {
        map.fitBounds(markersBounds);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des bâtiments:", error);
  }
  
  // Juste après ton bloc try/catch dans onMounted
  nextTick(() => {
    if (map) {
      map.invalidateSize();
    }
  });
});
</script>

<style scoped>
.map-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background: #34495e;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
}

.map-container {
  flex: 2; /* Prend 2/3 de l'espace */
  width: 100%;
  z-index: 1;
}

.details-zone {
  flex: 1; /* Prend 1/3 de l'espace */
  background: white;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  overflow-y: auto;
  border-top: 3px solid #3498db;
  transition: all 0.3s ease;
}

.details-zone.active {
  background-color: #f0f7ff;
}

.bat-desc { font-style: italic; color: #666; margin-bottom: 15px; }

.salles-list { list-style: none; padding: 0; }

.salle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.salle-nom { font-weight: bold; color: #2c3e50; }

.matiere-badge {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.event-box {
  margin-top: 8px;
  padding: 8px;
  background-color: #fcf3cf; /* Un jaune léger pour attirer l'oeil */
  border-left: 4px solid #f1c40f;
  border-radius: 4px;
}

.event-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #d4ac0d;
}

.event-title {
  margin: 4px 0;
  font-weight: bold;
  color: #2c3e50;
}

.event-time {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}
.no-data { color: #e74c3c; font-size: 0.9rem; }

h2 { color: #2c3e50; margin-top: 0; }
.placeholder { color: #7f8c8d; font-style: italic; text-align: center; margin-top: 20px; }
</style>
