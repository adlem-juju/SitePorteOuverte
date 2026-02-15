<template>
  <div style="position:fixed;bottom:8px;right:8px;z-index:9999;background:#000;color:#fff;padding:6px 10px;border-radius:10px;font-size:12px;">
    MADE BY ADLEM
  </div>

  <div id="layout">
    <AppHeader :title="pageTitle" :subtitle="pageSubtitle" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.path) {
    case '/':
      return 'Lycée de la Collinière'

    case '/map':
      return 'Carte'

    case '/evenements':
      return 'Événements'

    case '/filieres':
      return 'Filières'

    default:
      if (route.path.startsWith('/filiere/')) return 'Filière'
      return 'Portes ouvertes'
  }
})

const pageSubtitle = computed(() => {
  if (route.path === '/')
    return 'Portes ouvertes'

  return 'Lycée de la Collinière'
})

</script>

<style>
#layout { min-height: 100vh; }
</style>
