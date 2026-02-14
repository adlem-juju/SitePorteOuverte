<template>
  <div class="map-wrapper">
    <div v-if="buildingStore.loading" class="loader">Chargement de la carte...</div>
    
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBuildingStore } from '../stores/buildingStore';

const buildingStore = useBuildingStore();
const mapContainer = ref(null);
let map = null;

// Correction pour les icônes Leaflet par défaut avec Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

onMounted(async () => {
  // 1. Initialisation de la carte (coordonnées par défaut : France)
  map = L.map(mapContainer.value).setView([46.603354, 1.888334], 6);

  // 2. Ajout de la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 3. Récupération des données depuis Strapi
  await buildingStore.fetchBuildings();
  
  // 4. Affichage initial des marqueurs
  displayMarkers();
});

const displayMarkers = () => {
  if (!map) return;
  
  buildingStore.buildings.forEach(building => {
    L.marker(building.position)
      .addTo(map)
      .bindPopup(`<b>${building.name}</b><br>ID: ${building.id}`);
  });

  // Ajuster la vue si des bâtiments existent
  if (buildingStore.buildings.length > 0) {
    const group = new L.featureGroup(buildingStore.buildings.map(b => L.marker(b.position)));
    map.fitBounds(group.getBounds().pad(0.1));
  }
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 80vh; /* Ajustable pour le mobile-first */
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
