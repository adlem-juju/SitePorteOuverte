<template>
  <div class="home-container">
    <header class="hero">
      <img src="/logo.png" alt="Logo Lycée" class="logo" />
      <h1>Lycée de la Collinière</h1>
      <p class="welcome-msg">On est heureux de vous recevoir</p>
      <p class="date">Samedi 15 Mars 2026</p>
    </header>

    <nav class="grid-nav">
      <router-link to="/map" class="nav-zone zone-1">
        <h2>📍 Carte Interactive</h2>
        <p>Trouver votre chemin</p>
      </router-link>

      <router-link to="/evenements" class="nav-zone zone-2">
        <h2>📅 Événements</h2>
        <p>Conférences et animations</p>
      </router-link>

      <router-link to="/filieres" class="nav-zone zone-3">
        <h2>🎓 Filières</h2>
        <p>Découvrir nos formations</p>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.home-container {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.logo { max-height: 100px; margin-bottom: 10px; }

.hero { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }

.grid-nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-zone {
  padding: 30px;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  transition: transform 0.2s;
}

.nav-zone:active { transform: scale(0.98); }

/* Couleurs minimales pour différencier les zones */
.zone-1 { background-color: #3498db; }
.zone-2 { background-color: #e67e22; }
.zone-3 { background-color: #2ecc71; }

.nav-zone h2 { margin: 0; font-size: 1.5rem; }
.nav-zone p { margin: 5px 0 0; opacity: 0.9; }
</style>
