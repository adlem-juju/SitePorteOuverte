<template>
  <main class="page">
    <header class="topbar">
      <div class="brand">
        <img class="logo" src="/logo.png" alt="Logo du lycée" />
        <div class="brand-text">
          <h1>Lycée de la Collinière</h1>
          <p class="subtitle">Portes ouvertes</p>
        </div>
      </div>
    </header>

    <section class="hero card">
      <img class="hero-img" :src="heroImg" alt="Photo du campus" />
      <div class="hero-body">
        <div class="meta">
          <span class="chip"><span class="dot dot-green"></span> Nantes</span>
          <span class="chip"><span class="dot dot-amber"></span> Samedi 15 mars</span>
          <span class="chip"><span class="dot dot-sky"></span> 9h – 16h</span>
        </div>

        <div class="actions">
          <router-link class="btn btn-primary" to="/map">Commencer la visite</router-link>
          <router-link class="btn btn-ghost" to="/evenements">Voir le programme du jour</router-link>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Accès rapides</h2>

      <nav class="nav-cards" aria-label="Navigation principale">
        <router-link to="/map" class="nav-card nav-map">
          <div class="icon">📍</div>
          <div class="txt">
            <div class="title">Carte interactive</div>
            <div class="desc">Trouver votre chemin</div>
          </div>
          <div class="chev">›</div>
        </router-link>

        <router-link to="/evenements" class="nav-card nav-events">
          <div class="icon">📅</div>
          <div class="txt">
            <div class="title">Événements</div>
            <div class="desc">Conférences & animations</div>
          </div>
          <div class="chev">›</div>
        </router-link>

        <router-link to="/filieres" class="nav-card nav-filieres">
          <div class="icon">🎓</div>
          <div class="txt">
            <div class="title">Filières</div>
            <div class="desc">Découvrir les formations</div>
          </div>
          <div class="chev">›</div>
        </router-link>
      </nav>
    </section>

    <section class="section">
      <h2>Infos pratiques</h2>

      <details class="accordion card">
        <summary>Accès & accueil</summary>
        <div class="acc-body">
          <ul>
            <li><strong>Entrée :</strong> suivez la signalétique « Accueil » à l’arrivée.</li>
            <li><strong>Besoin d’aide :</strong> passez par le point information (hall).</li>
            <li><strong>Conseil :</strong> utilisez la carte pour repérer votre prochain bâtiment.</li>
          </ul>
        </div>
      </details>

      <details class="accordion card">
        <summary>Pendant la visite</summary>
        <div class="acc-body">
          <ul>
            <li>Préférez des étapes courtes (10–15 min) : événements → bâtiment → filière.</li>
            <li>Chaque événement indique le bâtiment et la salle.</li>
          </ul>
        </div>
      </details>
    </section>

    <section class="section subtle">
      <div class="mini-media card">
        <img class="mini-img" :src="cdiImg" alt="Photo intérieure (CDI)" />
        <div class="mini-txt">
          <div class="kicker">À découvrir</div>
          <div class="mini-title">Un lycée accueillant & arboré</div>
          <div class="mini-desc">Des espaces de travail, de projets et d’échanges pendant toute la journée.</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import heroImg from '../assets/media/hero-campus.png'
import cdiImg from '../assets/media/cdi.png'
</script>

<style scoped>
.page{
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  padding:16px;
  padding-bottom:24px;
  max-width: 680px;
  margin: 0 auto;
  font-family: var(--font);
}

.topbar{padding:6px 2px 14px;}
.brand{display:flex; gap:12px; align-items:center;}
.logo{width:44px;height:44px;object-fit:contain;}
.brand-text h1{font-size:20px;line-height:1.2;margin:0;}
.subtitle{margin:2px 0 0;color:var(--text-soft);font-size:14px;}

.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:20px;
  box-shadow: var(--shadow);
}

.hero{overflow:hidden;}
.hero-img{width:100%;height:170px;object-fit:cover;display:block;}
.hero-body{padding:14px;}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
.chip{
  display:inline-flex;gap:8px;align-items:center;
  padding:8px 10px;border-radius:999px;
  background:var(--chip-bg); border:1px solid var(--border);
  font-size:13px;color:var(--text);
}
.dot{width:10px;height:10px;border-radius:999px;display:inline-block;}
.dot-green{background:var(--green);}
.dot-amber{background:var(--amber);}
.dot-sky{background:var(--sky);}

.actions{display:flex;flex-direction:column;gap:10px;}
.btn{
  height:52px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-weight:700;text-decoration:none;
  border:1px solid transparent;
}
.btn-primary{background:var(--green-dark); color:white;}
.btn-primary:active{transform:scale(.99);}
.btn-ghost{background:transparent; color:var(--text); border-color:var(--border);}

.section{margin-top:18px;}
.section h2{font-size:16px;margin:0 0 10px;color:var(--text);}

.nav-cards{display:flex;flex-direction:column;gap:10px;}
.nav-card{
  display:flex;align-items:center;gap:12px;
  padding:14px 14px;
  border-radius:20px;
  background:var(--card);
  border:1px solid var(--border);
  text-decoration:none;color:inherit;
}
.nav-card:active{transform:scale(.99);}
.icon{
  width:44px;height:44px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;
  background:var(--chip-bg);
}
.txt{flex:1;min-width:0;}
.title{font-weight:800;}
.desc{color:var(--text-soft);font-size:13px;margin-top:2px;}
.chev{font-size:22px;color:var(--text-soft);}

.nav-map .icon{background:var(--sky-soft);}
.nav-events .icon{background:var(--amber-soft);}
.nav-filieres .icon{background:var(--green-soft);}

.accordion{padding:10px 14px;}
.accordion summary{
  cursor:pointer;
  list-style:none;
  font-weight:800;
  padding:6px 0;
}
.accordion summary::-webkit-details-marker{display:none;}
.acc-body{padding:8px 0 4px;color:var(--text-soft);font-size:14px;}
.acc-body ul{margin:0;padding-left:18px;}
.acc-body li{margin:8px 0;}

.subtle{margin-top:18px;}
.mini-media{display:flex;gap:12px;overflow:hidden;}
.mini-img{width:120px;min-width:120px;height:120px;object-fit:cover;display:block;}
.mini-txt{padding:12px 12px 12px 0;}
.kicker{font-size:12px;color:var(--text-soft);font-weight:700;text-transform:uppercase;letter-spacing:.04em;}
.mini-title{font-weight:900;margin-top:2px;}
.mini-desc{color:var(--text-soft);font-size:13px;margin-top:4px;}

@media (min-width: 520px){
  .hero-img{height:210px;}
  .actions{flex-direction:row;}
  .btn{flex:1;}
  .mini-img{height:140px;}
}
</style>
