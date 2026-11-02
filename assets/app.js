/* =====================================================================
   RADIO LATINLOVERS — app.js
   Header + player fissi condivisi · now-playing REALE (laut.fm) ·
   slider home · palinsesto dinamico. Nessuna emoji.
   ===================================================================== */

/* ---------- stazioni (stream + API metadata abbinata) ----------
   La prima è LA DIRETTA: viene letta da assets/diretta.json, lo stesso file
   che usa l'app iOS. Per cambiare stream (es. il tuo, con speaker e pubblicità)
   basta modificare quel file: sito e app si aggiornano insieme.
   Le altre due sono riserve se la Diretta non risponde.
   "now" è l'API che restituisce il brano realmente in onda.               */
let STATIONS = [
  { stream:"https://stream.laut.fm/reggaeton", now:"https://api.laut.fm/station/reggaeton/current_song", name:"La Diretta" },
  { stream:"https://stream.laut.fm/salsa",     now:"https://api.laut.fm/station/salsa/current_song",     name:"Salsa & Latino" },
  { stream:"https://stream.zeno.fm/qmhf2yd9dm0uv", now:null, name:"Latino" }
];

/* Legge la configurazione condivisa della Diretta (con tempo massimo e riserva) */
async function loadLiveConfig(){
  try{
    const me = document.querySelector('script[src$="app.js"]');
    const base = me ? me.src.replace(/app\.js.*$/, "") : "assets/";
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), 2500);
    const r = await fetch(base + "diretta.json", {cache:"no-store", signal:ctrl.signal});
    clearTimeout(t);
    if(!r.ok) return;
    const c = await r.json();
    if(c && c.stream){
      STATIONS[0] = { stream:c.stream, now:c.nowPlaying || null, name:c.name || "La Diretta" };
    }
  }catch(e){ /* resta la configurazione di riserva */ }
}

/* ---------- icone SVG ---------- */
const SVG = {
  fb:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 9V7.3c0-.7.5-.9.8-.9h2V3.5h-2.6C10.8 3.5 10 5.3 10 6.6V9H8v3h2v9h3.5v-9H16l.3-3h-2.8Z"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.4c2.5 0 2.8 0 3.8.05 2.5.1 3.7 1.3 3.8 3.8.05 1 .05 1.3.05 3.8s0 2.8-.05 3.8c-.1 2.5-1.3 3.7-3.8 3.8-1 .05-1.3.05-3.8.05s-2.8 0-3.8-.05c-2.5-.1-3.7-1.3-3.8-3.8C4.4 14.8 4.4 14.5 4.4 12s0-2.8.05-3.8C4.5 5.7 5.7 4.5 8.2 4.4c1-.05 1.3-.05 3.8-.05ZM12 2.6c-2.5 0-2.9 0-3.9.06C4.7 2.8 2.8 4.7 2.66 8.1 2.6 9.1 2.6 9.5 2.6 12s0 2.9.06 3.9C2.8 19.3 4.7 21.2 8.1 21.34c1 .05 1.4.06 3.9.06s2.9 0 3.9-.06c3.4-.15 5.3-2 5.44-5.44.05-1 .06-1.4.06-3.9s0-2.9-.06-3.9C21.2 4.7 19.3 2.8 15.9 2.66c-1-.06-1.4-.06-3.9-.06Zm0 4.6a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Z"/></svg>',
  in:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.5h3.1V21H3.4V8.5Zm5.06 0h2.97v1.7h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.7 2.06 3.7 4.73V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.5Z"/></svg>',
  sp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4-.9 7.4-.5 10.1 1.1.4.2.5.6.2 1Zm1.2-2.7c-.2.4-.7.5-1.1.3-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.1 8.4-.6 11.6 1.4.3.2.5.7.2 1.1Zm.1-2.8C14.6 8.9 9.2 8.7 6 9.7c-.5.2-1.1-.1-1.2-.7-.2-.5.1-1.1.7-1.2 3.7-1.1 9.7-.9 13.5 1.4.5.3.7.9.4 1.4-.3.4-.9.6-1.4.3Z"/></svg>',
  tw:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L2 3h6.8l4.7 6.2L17.7 3Zm-1.2 16h1.8L7.6 4.8H5.7L16.5 19Z"/></svg>',
  yt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.6 4 12 4 12 4s-4.6 0-7.8.2c-.5.1-1.4.1-2.3 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.3C.8 14.5 1 16.4 1 16.4s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s4.6 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.3c0-1.9-.2-3.8-.2-3.8ZM9.8 15V9l5 3-5 3Z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  vol:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4Zm12 .5a3 3 0 0 1 0 5v-5Zm0-4a7 7 0 0 1 0 13v-2a5 5 0 0 0 0-9V5.5Z"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4Zm16.3-.3-1.4 1.4L20.6 12l-1.7 1.9 1.4 1.4L22 13.4l1.7 1.9 1.4-1.4L23.4 12l1.7-1.9-1.4-1.4L22 10.6l-1.7-1.9Z"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5l-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 5l7 7-7 7"/></svg>'
};

const SOCIAL = [
  ["facebook","fb"],["instagram","ig"],["linkedin","in"],
  ["spotify","sp"],["twitter","tw"],["youtube","yt"]
];

const CFG = window.LL_CONFIG || {};
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* Icone social: con URL in config.js diventano link, senza URL restano senza collegamento */
function socialHtml(){
  return SOCIAL.map(([name,k])=>{
    const url=(CFG.social||{})[name];
    return url
      ? `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${name}">${SVG[k]}</a>`
      : `<span class="soc" aria-label="${name}">${SVG[k]}</span>`;
  }).join("");
}

/* ---------- iniezione header + player (uguale su ogni pagina) ---------- */
function buildChrome(){
  const page = document.body.dataset.page || "home";

  const topMenu = [["Schedule","palinsesto.html"],["Show","programmi.html"],
                   ["Staff","chi-siamo.html#staff"],["Collabora","contatta.html#collabora"]]
    .map(([t,h])=>`<a href="${h}">${t}</a>`).join("");

  const social = socialHtml();

  const nav = [["Radio","palinsesto.html","radio"],["Podcast","podcast.html","podcast"],
               ["Blog","blog.html","blog"],["About","chi-siamo.html","about"],
               ["Contatta","contatta.html","contatta"]]
    .map(([t,h,k])=>`<a href="${h}" class="${page===k?"active":""}">${t}</a>`).join("");

  const header = `
  <div class="topbar">
    <div class="container">
      <nav class="topbar-menu">${topMenu}</nav>
      <div class="topbar-social">${social}</div>
    </div>
  </div>
  <header class="masthead">
    <div class="container">
      <a href="index.html" class="logo">
        <span class="l1">radio</span>
        <span class="l2">latin<b>lovers</b></span>
      </a>
      <nav class="mainnav" id="mainnav">${nav}</nav>
      <div class="mast-right">
        <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const player = `
  <div class="player" id="player">
    <div class="container">
      <button class="player-play" id="playBtn" aria-label="Play">${SVG.play}</button>
      <div class="player-onair"><small>ON</small><b>AIR</b></div>
      <div class="player-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <div class="player-track">
        <span class="lbl">Live now</span>
        <span class="title" id="npTitle">Radio LatinLovers</span>
        <span class="artist" id="npArtist">Diretta reggaeton &amp; música latina</span>
        <span class="sub" id="npSub">Ascolta la diretta di Radio LatinLovers</span>
      </div>
      <div class="player-vol">
        <button class="vbtn" id="muteBtn" aria-label="Volume">${SVG.vol}</button>
        <input type="range" id="volume" min="0" max="100" value="80" aria-label="Volume">
      </div>
    </div>
  </div>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo"><span class="l1">radio</span><span class="l2">latin<b>lovers</b></span></a>
          <p>La radio della community latina in Italia. Reggaeton e música latina. Progetto in fase di lancio.</p>
          <div class="footer-social">${socialHtml()}</div>
        </div>
        <div class="footer-col"><h4>Radio</h4><a href="palinsesto.html">Palinsesto</a><a href="programmi.html">Programmi</a><a href="podcast.html">Podcast</a></div>
        <div class="footer-col"><h4>Esplora</h4><a href="blog.html">Blog</a><a href="chi-siamo.html">Chi siamo</a><a href="chi-siamo.html#staff">Staff</a></div>
        <div class="footer-col"><h4>Contatti</h4>${CFG.email?`<a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a>`:""}<a href="contatta.html">Contatta</a><a href="contatta.html#collabora">Collabora con noi</a><a href="privacy.html">Privacy</a></div>
      </div>
      <div class="footer-bottom">
        <p class="disclaimer">Progetto in fase di lancio: palinsesto, programmi, podcast e staff sono anteprime dei contenuti in arrivo. I flussi audio sono forniti da laut.fm e dalle rispettive emittenti, a cui spettano licenze e diritti sui brani.</p>
        <p>© 2026 Radio LatinLovers · Tutti i diritti riservati</p>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Vai al contenuto</a>` + header);
  const firstSection = document.querySelector("body > section");
  if(firstSection){ firstSection.id = firstSection.id || "main"; firstSection.setAttribute("tabindex","-1"); }
  document.body.insertAdjacentHTML("beforeend", footer + player);

  // menu mobile
  const navToggle = document.getElementById("navToggle");
  const mainnav = document.getElementById("mainnav");
  navToggle.addEventListener("click", ()=>{
    const open = mainnav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
  });
  mainnav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    mainnav.classList.remove("open"); navToggle.classList.remove("open");
  }));
}

/* ===================================================================
   PLAYER + NOW PLAYING REALE
   =================================================================== */
const audio = new Audio();
audio.preload = "none";
let stationIdx = 0;
let isPlaying = false, wantPlay = false;
let npTimer = null;

const station = ()=>STATIONS[stationIdx];

function cleanTitle(raw, artist){
  let t = (raw||"").trim();
  // convenzione "Artist - Song": tieni la parte canzone dopo il primo trattino
  const m = t.match(/^(.{1,60}?)\s[-–—]\s(.+)$/);
  if(m) t = m[2];
  // togli parentesi tipo (Official Video), [Audio], ecc.
  t = t.replace(/[\(\[][^)\]]*(official|video|audio|lyric|oficial|visualizer|hd|4k|mv|prod)[^)\]]*[)\]]/ig,"");
  // simboli di collaborazione e rimozione di eventuali emoji
  t = t.replace(/[❌✖✕]/g,"x").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}️]/gu,"");
  return t.replace(/\s{2,}/g," ").trim() || (raw||"").trim();
}
function parseLautDate(s){
  const m = (s||"").match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/);
  return m ? new Date(`${m[1]}T${m[2]}${m[3]}:${m[4]}`).getTime() : null;
}
function setTrack(title, artist){
  const t = document.getElementById("npTitle");
  const a = document.getElementById("npArtist");
  if(t) t.textContent = title;
  if(a) a.textContent = artist;
  if("mediaSession" in navigator){
    navigator.mediaSession.metadata = new MediaMetadata({title, artist, album:"Radio LatinLovers"});
  }
}

async function updateNowPlaying(){
  clearTimeout(npTimer);
  const nowUrl = station().now;
  if(!nowUrl){ // stazione senza metadata
    setTrack("Radio LatinLovers", station().name + " · diretta");
    npTimer = setTimeout(updateNowPlaying, 25000);
    return;
  }
  try{
    const r = await fetch(nowUrl,{cache:"no-store"});
    const d = await r.json();
    const artist = ((d.artist && d.artist.name) || "Radio LatinLovers").split("/").map(x=>x.trim()).filter(Boolean).slice(0,3).join(", ");
    const title  = cleanTitle(d.title, (d.artist&&d.artist.name)||"") || "Diretta";
    setTrack(title, artist);
    const ends = parseLautDate(d.ends_at);
    let delay = 20000;
    if(ends) delay = Math.min(Math.max(ends - Date.now() + 1500, 5000), 60000);
    npTimer = setTimeout(updateNowPlaying, delay);
  }catch(e){
    npTimer = setTimeout(updateNowPlaying, 20000);
  }
}

function setPlayingUI(p){
  const btn = document.getElementById("playBtn");
  const pl = document.getElementById("player");
  if(btn) btn.innerHTML = p ? SVG.pause : SVG.play;
  if(pl) pl.classList.toggle("playing", p);
}

function startPlay(){
  wantPlay = true;
  const pl = document.getElementById("player");
  if(pl) pl.classList.add("loading");
  audio.src = station().stream + (station().stream.includes("?")?"&":"?") + "cb=" + Date.now();
  audio.volume = (document.getElementById("volume").value||80)/100;
  const p = audio.play();
  if(p && p.catch) p.catch(()=>{
    // il browser ha bloccato l'avvio: serve un tocco su Play
    wantPlay=false; isPlaying=false; setPlayingUI(false);
    if(pl) pl.classList.remove("loading");
    const sub=document.getElementById("npSub"); if(sub) sub.textContent="Premi play per ascoltare";
  });
}
function stopPlay(){
  wantPlay = false; isPlaying = false;
  audio.pause(); audio.removeAttribute("src"); audio.load();
  setPlayingUI(false);
  const pl = document.getElementById("player"); if(pl) pl.classList.remove("loading");
  sessionStorage.removeItem("ll_playing");
}
function toggle(){ (isPlaying||wantPlay) ? stopPlay() : startPlay(); }

audio.addEventListener("playing", ()=>{
  isPlaying = true; setPlayingUI(true);
  const pl = document.getElementById("player"); if(pl) pl.classList.remove("loading");
  sessionStorage.setItem("ll_playing","1");
});
audio.addEventListener("error", ()=>{
  if(!wantPlay) return;
  if(stationIdx < STATIONS.length-1){ stationIdx++; updateNowPlaying(); startPlay(); }
  else {
    stopPlay();
    const sub=document.getElementById("npSub"); if(sub) sub.textContent="Connessione non riuscita. Riprova tra poco.";
  }
});

function initPlayer(){
  document.getElementById("playBtn").addEventListener("click", toggle);
  const vol = document.getElementById("volume");
  const mute = document.getElementById("muteBtn");
  const savedVol = sessionStorage.getItem("ll_vol");
  if(savedVol!==null){ vol.value = savedVol; }
  audio.volume = vol.value/100;
  vol.addEventListener("input", ()=>{
    audio.volume = vol.value/100; audio.muted=false;
    mute.innerHTML = vol.value==0 ? SVG.mute : SVG.vol;
    sessionStorage.setItem("ll_vol", vol.value);
  });
  mute.addEventListener("click", ()=>{
    audio.muted = !audio.muted;
    mute.innerHTML = audio.muted ? SVG.mute : SVG.vol;
  });
  if("mediaSession" in navigator){
    navigator.mediaSession.setActionHandler("play", ()=>{ if(!isPlaying && !wantPlay) startPlay(); });
    navigator.mediaSession.setActionHandler("pause", ()=>{ if(isPlaying || wantPlay) stopPlay(); });
  }
  // pulsanti "Ascolta" nelle pagine
  document.addEventListener("click", e=>{
    const b = e.target.closest("[data-play]");
    if(b && !isPlaying && !wantPlay) startPlay();
  });
  // mostra subito il brano in onda, anche da fermo
  updateNowPlaying();
  // riprende la riproduzione se si stava ascoltando (cambio pagina)
  if(sessionStorage.getItem("ll_playing")==="1"){ startPlay(); }
}

/* ===================================================================
   HERO SLIDER (solo home)
   =================================================================== */
function initSlider(){
  const hero = document.querySelector(".hero");
  if(!hero) return;
  const slides = [...hero.querySelectorAll(".hero-slide")];
  const dotsWrap = hero.querySelector(".hero-dots");
  let i = 0, timer;
  slides.forEach((_,idx)=>{
    const b = document.createElement("button");
    b.addEventListener("click", ()=>go(idx,true));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];
  function go(n,manual){
    i = (n+slides.length)%slides.length;
    slides.forEach((s,idx)=>s.classList.toggle("active", idx===i));
    dots.forEach((d,idx)=>d.classList.toggle("active", idx===i));
    if(manual) restart();
  }
  function restart(){ clearInterval(timer); timer=setInterval(()=>go(i+1), 6000); }
  hero.querySelector(".prev").addEventListener("click", ()=>go(i-1,true));
  hero.querySelector(".next").addEventListener("click", ()=>go(i+1,true));
  go(0); restart();
}

/* ===================================================================
   PALINSESTO (solo pagina palinsesto)
   =================================================================== */
const SCHEDULE = {
  weekday:[
    {s:"06:00",e:"09:00",t:"Despertar Latino",h:"Camila Restrepo",g:"Morning",d:"Sveglia con energía: hit latine e news della scena."},
    {s:"09:00",e:"12:00",t:"Reggaetón Caliente",h:"DJ Maluco",g:"Reggaeton",d:"I brani del momento, mixati senza pausa."},
    {s:"12:00",e:"14:00",t:"La Hora del Perreo",h:"La Catrina",g:"Perreo",d:"Pausa pranzo a tutto ritmo."},
    {s:"14:00",e:"16:00",t:"Trópico",h:"Sol",g:"Tropical",d:"Cumbia, afrobeat latino e sound tropicale."},
    {s:"16:00",e:"19:00",t:"Top 20 Latino",h:"Andrés",g:"Classifica",d:"La classifica delle hit più suonate."},
    {s:"19:00",e:"21:00",t:"Bachata & Corazón",h:"Valentina",g:"Bachata",d:"Bachata sensual e dediche."},
    {s:"21:00",e:"24:00",t:"Noche de Fiesta",h:"DJ Rumba",g:"Club",d:"Set dal vivo per la notte."},
    {s:"00:00",e:"06:00",t:"Madrugada Mix",h:"Auto DJ",g:"Non-stop",d:"Latino non-stop nella notte."}
  ],
  sat:[
    {s:"00:00",e:"08:00",t:"Club Caliente",h:"DJ Rumba",g:"Club",d:"La notte continua fino all'alba."},
    {s:"08:00",e:"11:00",t:"Resaca Brunch",h:"Camila Restrepo",g:"Chill",d:"Sveglia morbida con latino soft."},
    {s:"11:00",e:"14:00",t:"Latino Top Mix",h:"DJ Maluco",g:"Hits",d:"Le hit per scaldare il weekend."},
    {s:"14:00",e:"17:00",t:"Salsa & Timba",h:"El Sonero",g:"Salsa",d:"Le radici del sound latino."},
    {s:"17:00",e:"20:00",t:"Sunset Perreo",h:"Sol",g:"Reggaeton",d:"Aperitivo latino al tramonto."},
    {s:"20:00",e:"23:00",t:"LatinLovers Live",h:"Guest DJ",g:"Live Set",d:"Set dal vivo con ospiti."},
    {s:"23:00",e:"24:00",t:"Club Caliente",h:"DJ Rumba",g:"Club",d:"Si entra nella notte."}
  ],
  sun:[
    {s:"00:00",e:"09:00",t:"Madrugada Mix",h:"Auto DJ",g:"Non-stop",d:"Latino non-stop."},
    {s:"09:00",e:"12:00",t:"Domingo Tranquilo",h:"Valentina",g:"Baladas",d:"Bachata e baladas per la domenica."},
    {s:"12:00",e:"15:00",t:"Cumbia Sunday",h:"Sol",g:"Cumbia",d:"Cumbia e sound tropicale."},
    {s:"15:00",e:"18:00",t:"Reggaetón Classics",h:"Andrés",g:"Classics",d:"L'epoca d'oro del genere."},
    {s:"18:00",e:"21:00",t:"Top 20 Latino · Replay",h:"Andrés",g:"Classifica",d:"La classifica della settimana."},
    {s:"21:00",e:"24:00",t:"Noche Romántica",h:"Valentina",g:"Romantica",d:"Per chiudere il weekend."}
  ]
};
const DAYS=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const jsToIdx=d=>(d+6)%7;
const daySched=i=> i===5?SCHEDULE.sat : i===6?SCHEDULE.sun : SCHEDULE.weekday;
const toMin=t=>{const[h,m]=t.split(":").map(Number);return h*60+m;};
function curSlot(sch,now){
  for(const s of sch){let a=toMin(s.s),b=toMin(s.e);if(b<=a)b+=1440;
    if(now>=a&&now<b)return s; if(now+1440>=a&&now+1440<b)return s;}
  return sch[0];
}
function initSchedule(){
  const wrap = document.getElementById("schedule");
  const bar = document.getElementById("daybar");
  if(!wrap||!bar) return;
  const today = jsToIdx(new Date().getDay());
  let active = today;
  function render(){
    const sch = daySched(active);
    const now = new Date(); const nowMin = now.getHours()*60+now.getMinutes();
    const live = active===today ? curSlot(sch,nowMin) : null;
    bar.innerHTML = DAYS.map((d,i)=>`<button class="${i===active?"active":""}" data-i="${i}">${i===today?d+" · oggi":d}</button>`).join("");
    bar.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{active=+b.dataset.i;render();}));
    wrap.innerHTML = sch.map(s=>{
      const isLive = live && live.t===s.t && live.s===s.s;
      return `<div class="slot ${isLive?"now":""}">
        <div class="slot-time">${s.s}<small>— ${s.e==="24:00"?"00:00":s.e}</small></div>
        <div class="slot-main"><h3>${s.t}</h3><span class="host">${s.h}</span><p>${s.d}</p></div>
        ${isLive?`<span class="slot-now-badge">On air</span>`:`<span class="slot-genre">${s.g}</span>`}
      </div>`;
    }).join("");
  }
  render();
  setInterval(render, 60000);
}

/* ===================================================================
   FORM (newsletter / contatti) — solo feedback, niente invio reale
   =================================================================== */
function initForms(){
  document.querySelectorAll("form[data-mailto]").forEach(f=>{
    const msg = f.querySelector(".form-msg");
    f.addEventListener("submit", e=>{
      e.preventDefault();
      if(!CFG.email){
        if(msg){ msg.textContent="L'indirizzo email di contatto sarà pubblicato a breve. Riprova più tardi."; msg.hidden=false; }
        return;
      }
      const d = new FormData(f);
      const subject = `${d.get("ruolo")||"Contatto"} · ${d.get("nome")||""}`.trim();
      const body = `${d.get("messaggio")||""}\n\n— ${d.get("nome")||""}\n${d.get("email")||""}`;
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if(msg){ msg.textContent="Si è aperta la tua app di posta con il messaggio pronto: premi invia."; msg.hidden=false; }
    });
  });
}

/* ---------- header ombra allo scroll ---------- */
function initScroll(){
  window.addEventListener("scroll", ()=>{
    const m = document.querySelector(".masthead");
    if(m) m.style.boxShadow = window.scrollY>10 ? "0 10px 30px -18px #000" : "none";
  },{passive:true});
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", async ()=>{
  buildChrome();
  await loadLiveConfig();
  initPlayer();
  initSlider();
  initSchedule();
  initForms();
  initScroll();
});
