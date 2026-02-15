<template>
  <header class="app-header">
    <div class="row">
      <router-link to="/" class="brand" aria-label="Retour à l'accueil">
        <img class="logo" :src="logoUrl" alt="Logo Lycée de la Collinière" />
      </router-link>

      <div class="title-wrap">
        <div class="title" v-if="title">{{ title }}</div>
        <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
      </div>

      <button class="burger" type="button" @click="open = true" aria-label="Ouvrir le menu">
        ☰
      </button>
    </div>

    <!-- Overlay -->
    <div v-if="open" class="overlay" @click="open = false"></div>

    <!-- Drawer -->
    <aside v-if="open" class="drawer" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="drawer-head">
        <router-link to="/" class="drawer-brand" @click="open = false">
          <img class="logo" :src="logoUrl" alt="Logo" />
          <div class="drawer-name">
            <div class="school">Lycée de la Collinière</div>
            <div class="small">Portes ouvertes</div>
          </div>
        </router-link>

        <button class="close" type="button" @click="open = false" aria-label="Fermer le menu">✕</button>
      </div>

      <nav class="nav">
        <router-link to="/" class="nav-item" @click="open=false">
          <span class="ico">🏠</span> Accueil
        </router-link>

        <router-link to="/map" class="nav-item" @click="open=false">
          <span class="ico">📍</span> Carte
        </router-link>

        <router-link to="/evenements" class="nav-item" @click="open=false">
          <span class="ico">📅</span> Événements
        </router-link>

        <router-link to="/filieres" class="nav-item" @click="open=false">
          <span class="ico">🎓</span> Filières
        </router-link>
      </nav>

      <div class="drawer-foot">
        <div class="hint">Astuce : utilisez la carte pour vous repérer pendant la visite.</div>
      </div>
    </aside>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import logoUrl from '../assets/branding/logo.png'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})

const open = ref(false)
const route = useRoute()

// Ferme le menu quand on change de page (sécurité)
let stop = null
onMounted(() => {
  const onKey = (e) => {
    if (e.key === 'Escape') open.value = false
  }
  window.addEventListener('keydown', onKey)

  // fermeture automatique quand la route change
  stop = () => { open.value = false }

  // Vue Router n’a pas de "watch route" automatique ici -> on utilise un watch simple
  // (solution minimaliste sans import de watch pour éviter le bruit)
  const origPushState = history.pushState
  history.pushState = function () {
    origPushState.apply(this, arguments)
    stop && stop()
  }

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    history.pushState = origPushState
  })
})
</script>

<style scoped>
.app-header{
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(245,247,248,.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.row{
  display:flex;
  align-items:center;
  gap:12px;
  padding: 10px 14px;
  max-width: 980px;
  margin: 0 auto;
}

.brand{
  display:flex;
  align-items:center;
  justify-content:center;
  width:44px;
  height:44px;
  border-radius: 14px;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.logo{
  width:28px;
  height:28px;
  object-fit:contain;
}

.title-wrap{
  flex:1;
  min-width:0;
}
.title{
  font-weight: 950;
  font-size: 16px;
  line-height: 1.2;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subtitle{
  margin-top: 2px;
  font-size: 13px;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.burger{
  width:44px;
  height:44px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: var(--shadow);
  font-size: 20px;
  cursor: pointer;
}

.overlay{
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,.45);
  z-index: 60;
}

.drawer{
  position: fixed;
  top: 0;
  right: 0;
  width: min(86vw, 360px);
  height: 100vh;
  background: var(--card);
  border-left: 1px solid var(--border);
  box-shadow: 0 20px 80px rgba(0,0,0,.25);
  z-index: 70;
  display:flex;
  flex-direction:column;
}

.drawer-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 14px;
  border-bottom: 1px solid var(--border);
}

.drawer-brand{
  display:flex;
  align-items:center;
  gap:10px;
  text-decoration:none;
  color: inherit;
}
.drawer-name .school{
  font-weight: 950;
  line-height: 1.1;
}
.drawer-name .small{
  font-size: 13px;
  color: var(--text-soft);
  margin-top: 2px;
}

.close{
  width:40px;
  height:40px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  font-weight: 900;
}

.nav{
  display:flex;
  flex-direction:column;
  padding: 10px;
  gap: 8px;
}
.nav-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fff;
  text-decoration:none;
  color: var(--text);
  font-weight: 850;
}
.nav-item.router-link-active{
  background: var(--green-soft);
  border-color: rgba(47,125,50,.35);
}
.ico{ width: 22px; text-align:center; }

.drawer-foot{
  margin-top:auto;
  padding: 14px;
  border-top: 1px solid var(--border);
}
.hint{
  font-size: 13px;
  color: var(--text-soft);
}
</style>
