<template>
  <header class="app-header">
    <div class="header-row">
      <router-link to="/" class="brand">
        <div class="logo-circle">LC</div>
        <div class="brand-text">
          <span class="title">La Colinière</span>
        </div>
      </router-link>

      <nav class="nav-desktop">
        <router-link to="/" class="nav-link">Accueil</router-link>
        <router-link to="/map" class="nav-link">Carte</router-link>
        <router-link to="/evenements" class="nav-link">Événements</router-link>
        <router-link to="/filieres" class="nav-link">Formations</router-link>
      </nav>

      <button class="burger-btn" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span v-if="!menuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <transition name="slide">
      <nav v-if="menuOpen" class="nav-mobile">
        <router-link to="/" @click="menuOpen = false">Accueil</router-link>
        <router-link to="/map" @click="menuOpen = false">Carte</router-link>
        <router-link to="/evenements" @click="menuOpen = false">Événements</router-link>
        <router-link to="/filieres" @click="menuOpen = false">Formations</router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<style scoped>
.app-header {
  background: var(--primary-dark);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 10px 16px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

/* BRAND */
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: white; }
.logo-circle { background: var(--accent-gold); color: var(--primary-dark); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.title { font-weight: 800; font-size: 1.1rem; }

/* NAV DESKTOP */
.nav-desktop { display: none; gap: 20px; }
.nav-link { color: white; text-decoration: none; font-weight: 600; font-size: 0.9rem; opacity: 0.8; }
.nav-link:hover, .router-link-active { opacity: 1; color: var(--accent-gold); }

/* BURGER */
.burger-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; display: block; }

/* NAV MOBILE */
.nav-mobile {
  position: absolute; top: 100%; left: 0; width: 100%;
  background: var(--primary-dark);
  display: flex; flex-direction: column;
  padding: 20px; gap: 15px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.nav-mobile a { color: white; text-decoration: none; font-size: 1.2rem; font-weight: 700; }

/* RESPONSIVE LOGIC */
@media (min-width: 768px) {
  .nav-desktop { display: flex; }
  .burger-btn { display: none; }
  .nav-mobile { display: none; }
}

/* ANIMATION */
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-10px); opacity: 0; }
</style>