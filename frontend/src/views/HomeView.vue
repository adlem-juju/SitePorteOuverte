<template>
  <main class="main-wrapper">
    <section class="hero-full" :style="{ backgroundImage: `url(${heroImg})` }">
      <div class="hero-overlay"></div>

      <div class="hero-content page-container">
        <div class="hero-text-area">
          
          <div class="hero-date-top">
            Samedi 15 mars de 9h – 16h
          </div>

          <div class="hero-main-group">
            <h1 class="hero-title">Lycée<br>La Colinière</h1>
            <p class="hero-tagline">« Heureux de vous accueillir pour ses portes ouvertes »</p>

            <div class="hero-actions">
              <router-link to="/evenements" class="btn-programme">
                Voir le programme du jour
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="wave-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>

    <div class="page-container content-sections spacing-top">
      
      <section class="section section-spacing">
        <h2 class="section-title">Accès rapides</h2>
        <p class="section-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        
        <div class="grid-nav">
          <router-link to="/map" class="grid-card">
            <div class="grid-icon-box">📍</div>
            <h3 class="grid-title">Carte interactive</h3>
          </router-link>

          <router-link to="/filieres" class="grid-card">
            <div class="grid-icon-box">🎓</div>
            <h3 class="grid-title">Nos filières</h3>
          </router-link>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Infos pratiques</h2>
        <div class="contact-list">
          <div class="contact-item">
            <div class="contact-icon-box">🤝</div>
            <div class="contact-txt">
              <h3 class="contact-label">Accueil & Visites</h3>
              <p class="contact-value">Une équipe vous attend pour répondre à toutes vos questions. Une équipe d'étudiants vous fera visiter l'établissement.</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon-box">☕</div>
            <div class="contact-txt">
              <h3 class="contact-label">Pause gourmande</h3>
              <p class="contact-value">Une collation vous sera offerte sur place.</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon-box">📍</div>
            <div class="contact-txt">
              <h3 class="contact-label">Nous rendre visite</h3>
              <p class="contact-value">129 rue du Landreau, 44319 Nantes Cedex 3</p>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon-box">📞</div>
            <div class="contact-txt">
              <h3 class="contact-label">Téléphone</h3>
              <p class="contact-value">02 40 93 93 33</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import heroImg from '../assets/media/HeroColliniere.png'
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  overflow-x: hidden;
}

/* --- HERO AJUSTÉ --- */
.hero-full {
  position: relative;
  min-height: 80vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-start; /* REMONTE TOUT LE CONTENU VERS LE HAUT */
  padding-top: 60px; /* Distance par rapport au haut de l'image */
  width: 100%;
  overflow: hidden;
}

.hero-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(26, 43, 72, 0.3) 0%, rgba(26, 43, 72, 0.7) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-text-area {
  display: flex;
  flex-direction: column;  
}

.hero-date-top {
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 20px; /* Espace entre date et titre */
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-title {
  color: white;
  font-size: clamp(2.2rem, 8vw, 4.5rem);
  line-height: 1.1;
  font-weight: 900;
  margin-bottom: 15px;
}

.hero-tagline {
  color: white;
  font-size: 1.3rem;
  font-style: italic;
  margin-bottom: 30px;
}

.btn-programme {
  display: inline-block;
  padding: 16px 36px;
  background: white;
  color: #1A2B48;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.wave-divider {
  position: absolute; bottom: -1px; left: 0; width: 100%;
  line-height: 0; z-index: 10;
}
.wave-divider svg { width: 100%; height: 80px; }

/* --- CONTENU --- */
.page-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  display: flex; align-items: center; gap: 15px;
  font-size: 14px; font-weight: 800; text-transform: uppercase;
  color: #1A2B48;
  margin-bottom: 25px;
}
.section-title::before { content: ""; width: 40px; height: 2px; background-color: #1A2B48; }

.grid-nav { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%; }
.grid-card {
  background: white; border: 1px solid #E2E8F0; border-radius: 18px;
  padding: 20px; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center;
}
.grid-icon-box { width: 44px; height: 44px; background: #f7f3e8; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; font-size: 20px; }
.grid-title { font-size: 1rem; font-weight: 800; color: #1A2B48; }

.contact-list { display: flex; flex-direction: column; gap: 24px; }
.contact-item { display: flex; align-items: flex-start; gap: 20px; }
.contact-icon-box {
  width: 52px; height: 52px; background: #f7f3e8; border-radius: 14px; 
  display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
}
.contact-label { font-size: 18px; font-weight: 800; color: #1A2B48; margin: 0; }
.contact-value { font-size: 15px; color: #64748B; margin: 0; line-height: 1.5; }

@media (max-width: 768px) {
  .hero-full { min-height: 50vh; padding-top: 30px; }
  .hero-title { font-size: 2rem; }
  .grid-nav { grid-template-columns: repeat(2, 1fr); }
}
</style>