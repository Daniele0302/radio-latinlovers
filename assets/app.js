/* =====================================================================
   RADIO LATINLOVERS — app.js
   Header, footer e player fissi condivisi · canali reali con brano in
   onda e cronologia (API laut.fm) · slider home. Nessun contenuto finto.
   ===================================================================== */

const CFG = window.LL_CONFIG || {};

/* ---------- canali: stream e API usano la stessa chiave ---------- */
const CHANNELS = [
  { key:"reggaeton", name:"Reggaeton", desc:"Perreo, urbano e le hit del momento." },
  { key:"latin",     name:"Latin Pop", desc:"Pop latino, ballate e brani da cantare." },
  { key:"bachata",   name:"Bachata",   desc:"Bachata dominicana, dai classici ai nuovi nomi." },
  { key:"salsa",     name:"Salsa",     desc:"Salsa e ritmi caraibici da ballare." },
  { key:"cumbia",    name:"Cumbia",    desc:"Cumbia e sonidos tropicales." },
  { key:"merengue",  name:"Merengue",  desc:"Merengue veloce e festoso." }
];
const streamUrl = k => `https://stream.laut.fm/${k}`;
const apiUrl    = (k, ep) => `https://api.laut.fm/station/${k}/${ep}`;

/* ---------- icone SVG ---------- */
const SVG = {
  fb:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 9V7.3c0-.7.5-.9.8-.9h2V3.5h-2.6C10.8 3.5 10 5.3 10 6.6V9H8v3h2v9h3.5v-9H16l.3-3h-2.8Z"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.4c2.5 0 2.8 0 3.8.05 2.5.1 3.7 1.3 3.8 3.8.05 1 .05 1.3.05 3.8s0 2.8-.05 3.8c-.1 2.5-1.3 3.7-3.8 3.8-1 .05-1.3.05-3.8.05s-2.8 0-3.8-.05c-2.5-.1-3.7-1.3-3.8-3.8C4.4 14.8 4.4 14.5 4.4 12s0-2.8.05-3.8C4.5 5.7 5.7 4.5 8.2 4.4c1-.05 1.3-.05 3.8-.05ZM12 2.6c-2.5 0-2.9 0-3.9.06C4.7 2.8 2.8 4.7 2.66 8.1 2.6 9.1 2.6 9.5 2.6 12s0 2.9.06 3.9C2.8 19.3 4.7 21.2 8.1 21.34c1 .05 1.4.06 3.9.06s2.9 0 3.9-.06c3.4-.15 5.3-2 5.44-5.44.05-1 .06-1.4.06-3.9s0-2.9-.06-3.9C21.2 4.7 19.3 2.8 15.9 2.66c-1-.06-1.4-.06-3.9-.06Zm0 4.6a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Z"/></svg>',
  tt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.6 3.7 3.7 4v2.6c-1.4 0-2.7-.4-3.9-1.1v6.2a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2.1 2.9V3h2.9Z"/></svg>',
  sp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4-.9 7.4-.5 10.1 1.1.4.2.5.6.2 1Zm1.2-2.7c-.2.4-.7.5-1.1.3-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.1 8.4-.6 11.6 1.4.3.2.5.7.2 1.1Zm.1-2.8C14.6 8.9 9.2 8.7 6 9.7c-.5.2-1.1-.1-1.2-.7-.2-.5.1-1.1.7-1.2 3.7-1.1 9.7-.9 13.5 1.4.5.3.7.9.4 1.4-.3.4-.9.6-1.4.3Z"/></svg>',
  yt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.6 4 12 4 12 4s-4.6 0-7.8.2c-.5.1-1.4.1-2.3 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.3C.8 14.5 1 16.4 1 16.4s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s4.6 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.3c0-1.9-.2-3.8-.2-3.8ZM9.8 15V9l5 3-5 3Z"/></svg>',
  tw:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L2 3h6.8l4.7 6.2L17.7 3Zm-1.2 16h1.8L7.6 4.8H5.7L16.5 19Z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  vol:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4Zm12 .5a3 3 0 0 1 0 5v-5Zm0-4a7 7 0 0 1 0 13v-2a5 5 0 0 0 0-9V5.5Z"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4Zm12.3.7 1.4-1.4L19.4 10l1.7-1.7 1.4 1.4-1.7 1.7 1.7 1.7-1.4 1.4-1.7-1.7-1.7 1.7-1.4-1.4 1.7-1.7-1.7-1.7Z"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5l-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 5l7 7-7 7"/></svg>'
};

const SOCIAL = [
  ["facebook","fb"],["instagram","ig"],["tiktok","tt"],
  ["spotify","sp"],["youtube","yt"],["twitter","tw"]
];

/* ---------- utilità ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const store = {
  get(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} },
  del(k){ try{ sessionStorage.removeItem(k); }catch(e){} }
};

function socialIcons(){
  // Con URL → link; senza URL → icona senza collegamento
  return SOCIAL.map(([name,k]) => {
    const url = (CFG.social || {})[name];
    return url
      ? `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${name}">${SVG[k]}</a>`
      : `<span class="soc" aria-label="${name}">${SVG[k]}</span>`;
  }).join("");
}

/* ---------- header + footer + player iniettati su ogni pagina ---------- */
function buildChrome(){
  const page = document.body.dataset.page || "home";

  const topMenu = [["Canali","radio.html#canali"],["Ultimi brani","radio.html#ultimi"],
                   ["Blog","blog.html"],["Contatta","contatta.html"]]
    .map(([t,h]) => `<a href="${h}">${t}</a>`).join("");

  const nav = [["Radio","radio.html","radio"],["Blog","blog.html","blog"],
               ["About","chi-siamo.html","about"],["Contatta","contatta.html","contatta"]]
    .map(([t,h,k]) => `<a href="${h}" class="${page===k?"active":""}">${t}</a>`).join("");

  const header = `
  <div class="topbar">
    <div class="container">
      <nav class="topbar-menu">${topMenu}</nav>
      <div class="topbar-social">${socialIcons()}</div>
    </div>
  </div>
  <header class="masthead">
    <div class="container">
      <a href="index.html" class="logo" aria-label="Radio LatinLovers">
        <span class="l1">radio</span>
        <span class="l2">latin<b>lovers</b></span>
      </a>
      <nav class="mainnav" id="mainnav">${nav}</nav>
      <div class="mast-right">
        <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const mail = CFG.email
    ? `<a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a>`
    : `<a href="contatta.html">Contatta</a>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo"><span class="l1">radio</span><span class="l2">latin<b>lovers</b></span></a>
          <p>Musica e cultura latina in Italia. Sei canali in diretta, un blog e una community che cresce.</p>
          <div class="footer-social">${socialIcons()}</div>
        </div>
        <div class="footer-col"><h4>Radio</h4><a href="radio.html#canali">Canali</a><a href="radio.html#ultimi">Ultimi brani</a></div>
        <div class="footer-col"><h4>Esplora</h4><a href="blog.html">Blog</a><a href="chi-siamo.html">Chi siamo</a></div>
        <div class="footer-col"><h4>Contatti</h4>${mail}<a href="contatta.html">Collabora con noi</a></div>
      </div>
      <div class="footer-bottom">
        <p class="disclaimer">I flussi audio sono forniti da laut.fm e dalle rispettive emittenti, a cui spettano licenze e diritti sui brani. I nomi di artisti e brani appartengono ai legittimi titolari.</p>
        <p>© 2026 Radio LatinLovers</p>
      </div>
    </div>
  </footer>`;

  const player = `
  <div class="player" id="player">
    <div class="container">
      <button class="player-play" id="playBtn" aria-label="Play">${SVG.play}</button>
      <div class="player-onair"><small>ON</small><b>AIR</b></div>
      <div class="player-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <div class="player-track">
        <span class="lbl" id="npLabel">Live now</span>
        <span class="title" id="npTitle">Radio LatinLovers</span>
        <span class="artist" id="npArtist">Premi play per ascoltare</span>
        <span class="sub" id="npSub">Ascolta la diretta di Radio LatinLovers</span>
      </div>
      <select class="player-ch" id="chSelect" aria-label="Canale">
        ${CHANNELS.map(c => `<option value="${c.key}">${c.name}</option>`).join("")}
      </select>
      <div class="player-vol">
        <button class="vbtn" id="muteBtn" aria-label="Volume">${SVG.vol}</button>
        <input type="range" id="volume" min="0" max="100" value="80" aria-label="Volume">
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer + player);

  const toggle = $("#navToggle"), mainnav = $("#mainnav");
  toggle.addEventListener("click", () => {
    const open = mainnav.classList.toggle("open");
    toggle.classList.toggle("open", open);
  });
  $$("a", mainnav).forEach(a => a.addEventListener("click", () => {
    mainnav.classList.remove("open"); toggle.classList.remove("open");
  }));
}

/* ===================================================================
   PLAYER + BRANO IN ONDA REALE
   =================================================================== */
const audio = new Audio();
audio.preload = "none";

let current = store.get("ll_ch");
if(!CHANNELS.some(c => c.key === current)) current = "reggaeton";
let isPlaying = false, wantPlay = false, npTimer = null;

const chOf = k => CHANNELS.find(c => c.key === k) || CHANNELS[0];

/* Pulizia titolo: "Artista - Brano (Official Video)" → "Brano" */
const norm = s => (s || "").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "").trim();
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;

function songTitle(raw, artist){
  let t = (raw || "").trim();
  const i = t.indexOf(" - ");
  if(i > 0){
    const left = norm(t.slice(0, i));
    const a = norm((artist || "").split("/")[0]);
    const first = a.split(" ")[0];
    if(a && left && (left.includes(a) || a.includes(left) || (first && left.includes(first)))){
      t = t.slice(i + 3);
    }
  }
  t = t.replace(/\s*[\(\[][^)\]]*(official|video|audio|lyric|oficial|visualizer|4k|hd|mv)[^)\]]*[)\]]/ig, "");
  t = t.replace(/[❌✖✕]/g, "x").replace(EMOJI, "");
  return t.replace(/\s{2,}/g, " ").trim() || (raw || "").trim();
}
const artistLine = a => (a || "").split("/").map(s => s.trim()).filter(Boolean).slice(0,3).join(", ");

function parseLaut(s){
  const m = (s || "").match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/);
  return m ? new Date(`${m[1]}T${m[2]}${m[3]}:${m[4]}`) : null;
}
const hhmm = d => d ? d.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}) : "";

async function getJSON(url){
  const r = await fetch(url, {cache:"no-store"});
  const txt = await r.text();
  if(!r.ok || !txt) throw new Error("vuoto");
  return JSON.parse(txt);
}

function setText(sel, v){ $$(sel).forEach(el => el.textContent = v); }

function setTrack(title, artist){
  setText("#npTitle", title);
  setText("#npArtist", artist);
  setText("[data-np-title]", title);
  setText("[data-np-artist]", artist);
}

function renderRecent(list, nowId){
  const box = $("#recent");
  if(!box) return;
  if(!list.length){ box.innerHTML = `<p class="muted">Cronologia non disponibile in questo momento.</p>`; return; }
  box.innerHTML = list.slice(0,10).map((x, i) => {
    const a = artistLine(x.artist && x.artist.name);
    const live = i === 0 && String(x.id) === String(nowId);
    return `<div class="track ${live?"live":""}">
      <span class="t-time">${live ? "In onda" : esc(hhmm(parseLaut(x.started_at)))}</span>
      <span class="t-main"><b>${esc(songTitle(x.title, x.artist && x.artist.name))}</b><i>${esc(a)}</i></span>
    </div>`;
  }).join("");
}

async function refreshNow(){
  clearTimeout(npTimer);
  const ch = current, name = chOf(ch).name;
  setText("#npLabel", `Live now · ${name}`);
  setText("[data-np-channel]", name);
  const wantsRecent = !!$("#recent");
  try{
    const [now, last] = await Promise.all([
      getJSON(apiUrl(ch, "current_song")),
      wantsRecent ? getJSON(apiUrl(ch, "last_songs")).catch(() => []) : Promise.resolve([])
    ]);
    if(ch !== current) return;                      // canale cambiato nel frattempo
    const artist = artistLine(now.artist && now.artist.name) || name;
    setTrack(songTitle(now.title, now.artist && now.artist.name) || name, artist);
    renderRecent(last, now.id);
    const ends = parseLaut(now.ends_at);
    const delay = ends ? Math.min(Math.max(ends - Date.now() + 1500, 6000), 60000) : 20000;
    npTimer = setTimeout(refreshNow, delay);
  }catch(e){
    if(ch !== current) return;
    setTrack(name, "Diretta in corso");
    renderRecent([], null);
    npTimer = setTimeout(refreshNow, 15000);
  }
}

function setPlayingUI(p){
  const btn = $("#playBtn"), pl = $("#player");
  if(btn) btn.innerHTML = p ? SVG.pause : SVG.play;
  if(pl) pl.classList.toggle("playing", p);
  $$("[data-play]").forEach(b => b.classList.toggle("is-playing", p && b.dataset.ch === current));
  $$(".ch-card").forEach(c => c.classList.toggle("active", c.dataset.ch === current));
}
function setSub(msg){ setText("#npSub", msg); }

function startPlay(){
  wantPlay = true;
  const pl = $("#player"); if(pl) pl.classList.add("loading");
  setSub("Connessione in corso…");
  audio.src = streamUrl(current) + "?cb=" + Date.now();
  const p = audio.play();
  if(p && p.catch) p.catch(() => {
    // il browser ha bloccato l'avvio automatico: serve un tocco su Play
    wantPlay = false; isPlaying = false; setPlayingUI(false);
    if(pl) pl.classList.remove("loading");
    setSub("Premi play per ascoltare");
  });
}
function stopPlay(){
  wantPlay = false; isPlaying = false;
  audio.pause(); audio.removeAttribute("src"); audio.load();
  setPlayingUI(false);
  const pl = $("#player"); if(pl) pl.classList.remove("loading");
  setSub("Ascolta la diretta di Radio LatinLovers");
  store.del("ll_playing");
}
function toggle(){ (isPlaying || wantPlay) ? stopPlay() : startPlay(); }

function selectChannel(key, autoplay){
  if(!CHANNELS.some(c => c.key === key)) return;
  const changed = key !== current;
  current = key; store.set("ll_ch", key);
  const sel = $("#chSelect"); if(sel) sel.value = key;
  setPlayingUI(isPlaying);
  if(changed){ setTrack(chOf(key).name, "Caricamento…"); refreshNow(); }
  if(autoplay){ if(isPlaying || wantPlay) audio.pause(); startPlay(); }
  else if(changed && (isPlaying || wantPlay)){ startPlay(); }
}

audio.addEventListener("playing", () => {
  isPlaying = true; setPlayingUI(true);
  const pl = $("#player"); if(pl) pl.classList.remove("loading");
  setSub("Ascolta la diretta di Radio LatinLovers");
  store.set("ll_playing", "1");
});
audio.addEventListener("error", () => {
  if(!wantPlay) return;
  wantPlay = false; isPlaying = false; setPlayingUI(false);
  const pl = $("#player"); if(pl) pl.classList.remove("loading");
  setSub("Connessione non riuscita. Riprova.");
});

function initPlayer(){
  $("#playBtn").addEventListener("click", toggle);
  const sel = $("#chSelect"); sel.value = current;
  sel.addEventListener("change", () => selectChannel(sel.value, false));

  const vol = $("#volume"), mute = $("#muteBtn");
  const saved = store.get("ll_vol"); if(saved !== null) vol.value = saved;
  audio.volume = vol.value / 100;
  vol.addEventListener("input", () => {
    audio.volume = vol.value / 100; audio.muted = false;
    mute.innerHTML = Number(vol.value) === 0 ? SVG.mute : SVG.vol;
    store.set("ll_vol", vol.value);
  });
  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    mute.innerHTML = audio.muted ? SVG.mute : SVG.vol;
  });

  // pulsanti "Ascolta" nelle pagine
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-play]");
    if(!b) return;
    const key = b.dataset.ch || current;
    if(key === current && (isPlaying || wantPlay)) stopPlay();
    else selectChannel(key, true);
  });

  refreshNow();
  if(store.get("ll_playing") === "1") startPlay();   // riprende dopo il cambio pagina
}

/* ---------- schede canale (home e pagina Radio) ---------- */
function initChannels(){
  const box = $("#channels");
  if(!box) return;
  box.innerHTML = CHANNELS.map(c => `
    <button class="ch-card" data-play data-ch="${c.key}" type="button">
      <span class="ch-name">${c.name}</span>
      <span class="ch-desc">${c.desc}</span>
      <span class="ch-cta"><span class="ch-on">In ascolto</span><span class="ch-off">Ascolta</span></span>
    </button>`).join("");
  setPlayingUI(isPlaying);
}

/* ===================================================================
   HERO SLIDER (solo home)
   =================================================================== */
function initSlider(){
  const hero = $(".hero");
  if(!hero) return;
  const slides = $$(".hero-slide", hero);
  const dotsWrap = $(".hero-dots", hero);
  let i = 0, timer;
  $(".prev", hero).innerHTML = SVG.prev;
  $(".next", hero).innerHTML = SVG.next;
  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Slide " + (idx + 1));
    b.addEventListener("click", () => go(idx, true));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];
  function go(n, manual){
    i = (n + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    if(manual) restart();
  }
  function restart(){ clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); }
  $(".prev", hero).addEventListener("click", () => go(i - 1, true));
  $(".next", hero).addEventListener("click", () => go(i + 1, true));
  go(0); restart();
}

/* ---------- email nella pagina Contatta ---------- */
function initContact(){
  const slot = $("#mailSlot");
  if(!slot) return;
  slot.innerHTML = CFG.email
    ? `<a class="btn btn-red" href="mailto:${esc(CFG.email)}?subject=${encodeURIComponent("Collaborazione Radio LatinLovers")}">Scrivici a ${esc(CFG.email)}</a>`
    : `<p class="muted">L'indirizzo email di contatto sarà pubblicato a breve.</p>`;
}

function initScroll(){
  window.addEventListener("scroll", () => {
    const m = $(".masthead");
    if(m) m.style.boxShadow = window.scrollY > 10 ? "0 10px 30px -18px #000" : "none";
  }, {passive:true});
}

document.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  initPlayer();
  initChannels();
  initSlider();
  initContact();
  initScroll();
});
