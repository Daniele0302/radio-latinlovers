/* ===================================================================
   RADIO LATINLOVERS — app.js
   Player live + palinsesto dinamico + interazioni
   =================================================================== */

/* -------------------------------------------------------------------
   CONFIG  ·  ⚙️  PERSONALIZZA QUI
   streamUrls: l'URL del tuo stream. Il primo è quello usato; gli altri
   sono fallback automatici. Per usare il TUO stream (Zeno.fm / Radio.co /
   Icecast) incolla qui l'indirizzo, es: "https://stream.zeno.fm/TUO_ID".
------------------------------------------------------------------- */
const CONFIG = {
  streamUrls: [
    "https://stream.zeno.fm/qmhf2yd9dm0uv", // 100% Reggaeton (default funzionante)
    "https://stream.zeno.fm/3m0kdgcpq18uv", // fallback
    "https://stream.zeno.fm/wdvk4mdarmzuv", // fallback
    "https://stream.zeno.fm/383wp845echvv"  // fallback
  ],
  // Playlist mostrata come "ora in onda" (simulazione metadata)
  tracks: [
    "Bad Bunny — Tití Me Preguntó",
    "KAROL G — TQG",
    "Daddy Yankee — Gasolina",
    "Rauw Alejandro — Todo de Ti",
    "Feid — Classy 101",
    "Don Omar — Danza Kuduro",
    "Shakira, Bizarrap — BZRP Music Sessions #53",
    "Manuel Turizo — La Bachata",
    "Ozuna — Taki Taki",
    "Myke Towers — LALA",
    "Quevedo — Columbia",
    "Peso Pluma, Eslabon Armado — Ella Baila Sola",
    "ROSALÍA — Despechá",
    "J Balvin — Mi Gente",
    "Wisin & Yandel — Rakata"
  ]
};

/* -------------------------------------------------------------------
   PALINSESTO
------------------------------------------------------------------- */
const SCHEDULE = {
  weekday: [ // Lun–Ven
    { start: "00:00", end: "06:00", title: "Madrugada Mix",       host: "Auto DJ",          genre: "Non-stop", emoji: "🌙", desc: "Latino non-stop per chi vive la notte." },
    { start: "06:00", end: "09:00", title: "Despertar Latino",    host: "Camila Restrepo",  genre: "Morning",  emoji: "🌅", desc: "Sveglia con energía: hit latine e buon umore." },
    { start: "09:00", end: "12:00", title: "Reggaetón Caliente",  host: "DJ Maluco",        genre: "Reggaeton",emoji: "🔥", desc: "I tormentoni del momento, mixati senza pausa." },
    { start: "12:00", end: "14:00", title: "La Hora del Perreo",  host: "La Catrina",       genre: "Perreo",   emoji: "💥", desc: "Pausa pranzo? Solo perreo intenso." },
    { start: "14:00", end: "16:00", title: "Trópico",             host: "Sol",              genre: "Tropical", emoji: "🌴", desc: "Cumbia, afrobeat latino e vibes tropicali." },
    { start: "16:00", end: "19:00", title: "Top 20 Latino",       host: "Andrés",           genre: "Classifica",emoji:"📊", desc: "La classifica delle hit più suonate." },
    { start: "19:00", end: "21:00", title: "Bachata & Corazón",   host: "Valentina",        genre: "Bachata",  emoji: "💃", desc: "Bachata sensual e dediche d'amore." },
    { start: "21:00", end: "24:00", title: "Noche de Fiesta",     host: "DJ Rumba",         genre: "Club",     emoji: "🪩", desc: "Il club arriva a casa tua: set dal vivo." }
  ],
  sat: [ // Sabato
    { start: "00:00", end: "08:00", title: "Club Caliente",       host: "DJ Rumba",         genre: "Club",     emoji: "🪩", desc: "La notte non finisce mai. Perreo fino all'alba." },
    { start: "08:00", end: "11:00", title: "Resaca Brunch",       host: "Camila Restrepo",  genre: "Chill",    emoji: "☕", desc: "Sveglia morbida con latino soft e baladas." },
    { start: "11:00", end: "14:00", title: "Latino Top Mix",      host: "DJ Maluco",        genre: "Hits",     emoji: "🎉", desc: "Le hit del momento per scaldare il weekend." },
    { start: "14:00", end: "17:00", title: "Salsa & Timba",       host: "El Sonero",        genre: "Salsa",    emoji: "🎺", desc: "Le radici del sound latino. A ballare!" },
    { start: "17:00", end: "20:00", title: "Sunset Perreo",       host: "Sol",              genre: "Reggaeton",emoji: "🌇", desc: "Aperitivo latino al tramonto." },
    { start: "20:00", end: "23:00", title: "LatinLovers Live",    host: "Guest DJ",         genre: "Live Set", emoji: "🎧", desc: "Set dal vivo con ospiti della scena." },
    { start: "23:00", end: "24:00", title: "Club Caliente",       host: "DJ Rumba",         genre: "Club",     emoji: "🪩", desc: "Si entra nella notte. Sube el volumen." }
  ],
  sun: [ // Domenica
    { start: "00:00", end: "09:00", title: "Madrugada Mix",       host: "Auto DJ",          genre: "Non-stop", emoji: "🌙", desc: "Latino non-stop nella notte della domenica." },
    { start: "09:00", end: "12:00", title: "Domingo Tranquilo",   host: "Valentina",        genre: "Baladas",  emoji: "🌤️", desc: "Bachata e baladas per una domenica dolce." },
    { start: "12:00", end: "15:00", title: "Cumbia Sunday",       host: "Sol",              genre: "Cumbia",   emoji: "🪅", desc: "Cumbia e sound tropicale per il pranzo." },
    { start: "15:00", end: "18:00", title: "Reggaetón Classics",  host: "Andrés",           genre: "Classics", emoji: "📀", desc: "L'epoca d'oro: Daddy Yankee, Don Omar & co." },
    { start: "18:00", end: "21:00", title: "Top 20 Latino · Replay", host: "Andrés",        genre: "Classifica",emoji:"📊", desc: "La classifica della settimana, ancora una volta." },
    { start: "21:00", end: "24:00", title: "Noche Romántica",     host: "Valentina",        genre: "Romantica",emoji: "💖", desc: "Per chiudere il weekend in dolcezza." }
  ]
};

const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]; // indice 0 = Lunedì

// Converte getDay() (0=Dom) nel nostro indice (0=Lun)
function jsDayToIdx(d) { return (d + 6) % 7; }

function getDaySchedule(idx) {
  if (idx === 5) return SCHEDULE.sat;
  if (idx === 6) return SCHEDULE.sun;
  return SCHEDULE.weekday;
}

function toMin(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }

// Trova lo slot attualmente in onda (gestisce il wrap di mezzanotte)
function currentSlot(schedule, nowMin) {
  for (const s of schedule) {
    let a = toMin(s.start), b = toMin(s.end);
    if (b <= a) b += 1440; // attraversa la mezzanotte
    if (nowMin >= a && nowMin < b) return s;
    if (nowMin + 1440 >= a && nowMin + 1440 < b) return s;
  }
  return schedule[0];
}

/* -------------------------------------------------------------------
   RENDER PALINSESTO
------------------------------------------------------------------- */
const dayTabs = document.getElementById("dayTabs");
const scheduleList = document.getElementById("scheduleList");
const todayIdx = jsDayToIdx(new Date().getDay());
let activeDay = todayIdx;

function buildTabs() {
  dayTabs.innerHTML = "";
  DAYS.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "day-tab" + (i === activeDay ? " active" : "");
    b.textContent = i === todayIdx ? d + " · oggi" : d;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { activeDay = i; buildTabs(); renderSchedule(); });
    dayTabs.appendChild(b);
  });
}

function renderSchedule() {
  const schedule = getDaySchedule(activeDay);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const liveSlot = activeDay === todayIdx ? currentSlot(schedule, nowMin) : null;

  scheduleList.innerHTML = "";
  schedule.forEach(s => {
    const isLive = liveSlot && s.title === liveSlot.title && s.start === liveSlot.start;
    const row = document.createElement("div");
    row.className = "slot" + (isLive ? " live" : "");
    row.innerHTML = `
      <div class="slot-time">${s.start}<small>– ${s.end === "24:00" ? "00:00" : s.end}</small></div>
      <div class="slot-cover">${s.emoji}</div>
      <div class="slot-info">
        <h3>${s.title}</h3>
        <p><span class="slot-host">${s.host}</span> · ${s.desc}</p>
      </div>
      <div class="slot-meta">
        ${isLive
          ? `<span class="slot-live-badge"><span class="live-dot"></span> ON AIR</span>`
          : `<span class="slot-genre">${s.genre}</span>`}
      </div>`;
    scheduleList.appendChild(row);
  });
}

/* Aggiorna il programma in onda mostrato nel player e nel ticker */
function updateOnAir() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const schedule = getDaySchedule(todayIdx);
  const slot = currentSlot(schedule, nowMin);

  document.getElementById("playerShow").textContent = slot.title;
  document.getElementById("playerHost").textContent = "con " + slot.host;
  document.getElementById("playerArt").querySelector(".player-art-emoji").textContent = slot.emoji;
  document.getElementById("tickerShow").textContent = slot.title;

  if (activeDay === todayIdx) renderSchedule();
}

/* -------------------------------------------------------------------
   PLAYER AUDIO
------------------------------------------------------------------- */
const audio        = document.getElementById("audio");
const playerCard   = document.getElementById("playerCard");
const mainPlayBtn  = document.getElementById("mainPlayBtn");
const mainPlayIcon = document.getElementById("mainPlayIcon");
const heroPlayBtn  = document.getElementById("heroPlayBtn");
const heroPlayIcon = document.getElementById("heroPlayIcon");
const statusEl     = document.getElementById("playerStatus");
const volume       = document.getElementById("volume");
const muteBtn      = document.getElementById("muteBtn");

let streamIdx = 0;
let isPlaying = false;
let wantPlay = false;

audio.volume = volume.value / 100;

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", isError);
}

function setIcons(playing) {
  mainPlayIcon.textContent = playing ? "❚❚" : "▶";
  heroPlayIcon.textContent = playing ? "❚❚" : "▶";
  playerCard.classList.toggle("playing", playing);
}

function startPlayback() {
  wantPlay = true;
  streamIdx = 0;
  loadAndPlay();
}

function loadAndPlay() {
  setStatus("Connessione allo stream…");
  audio.src = CONFIG.streamUrls[streamIdx] + "?t=" + Date.now();
  audio.load();
  const p = audio.play();
  if (p && p.catch) {
    p.catch(() => {
      // autoplay bloccato o errore: gestito da 'error'/'stalled'
      if (!isPlaying) tryNextOrFail();
    });
  }
}

function tryNextOrFail() {
  if (!wantPlay) return;
  streamIdx++;
  if (streamIdx < CONFIG.streamUrls.length) {
    setStatus("Provo un altro stream…");
    audio.src = CONFIG.streamUrls[streamIdx] + "?t=" + Date.now();
    audio.load();
    audio.play().catch(() => {});
  } else {
    // Tutti gli stream falliti → modalità demo (animazione attiva)
    wantPlay = false;
    isPlaying = false;
    setIcons(false);
    setStatus("Stream non raggiungibile ora — riprova tra poco.", true);
  }
}

function stopPlayback() {
  wantPlay = false;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  isPlaying = false;
  setIcons(false);
  setStatus("In pausa — premi play per riprendere");
}

function togglePlay() {
  if (isPlaying || wantPlay) stopPlayback();
  else startPlayback();
}

audio.addEventListener("playing", () => {
  isPlaying = true;
  setIcons(true);
  setStatus("▶ In riproduzione · stream reggaeton (anteprima)");
  nextTrack();
});
audio.addEventListener("waiting", () => { if (wantPlay) setStatus("Buffering…"); });
audio.addEventListener("error", () => { if (wantPlay) tryNextOrFail(); });
audio.addEventListener("stalled", () => { if (wantPlay && !isPlaying) tryNextOrFail(); });

mainPlayBtn.addEventListener("click", togglePlay);
heroPlayBtn.addEventListener("click", togglePlay);
document.getElementById("headerListenBtn").addEventListener("click", e => {
  if (!isPlaying && !wantPlay) { /* lascia scrollare al player, poi parte */ setTimeout(startPlayback, 400); }
});

volume.addEventListener("input", () => {
  audio.volume = volume.value / 100;
  audio.muted = false;
  muteBtn.textContent = volume.value == 0 ? "🔇" : (volume.value < 50 ? "🔉" : "🔊");
});
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : (volume.value < 50 ? "🔉" : "🔊");
});

/* -------------------------------------------------------------------
   NOW PLAYING TICKER (simulazione metadata)
------------------------------------------------------------------- */
const nowPlayingEl = document.getElementById("nowPlaying");
const tickerTrackEl = document.getElementById("tickerTrack");
let trackIdx = Math.floor(Math.random() * CONFIG.tracks.length);

function setTrack(t) {
  nowPlayingEl.textContent = t;
  tickerTrackEl.textContent = "♪ " + t;
}
function nextTrack() {
  trackIdx = (trackIdx + 1) % CONFIG.tracks.length;
  setTrack(CONFIG.tracks[trackIdx]);
}
setTrack(CONFIG.tracks[trackIdx]);
setInterval(() => { if (isPlaying) nextTrack(); }, 19000);

/* -------------------------------------------------------------------
   NAV MOBILE
------------------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  navToggle.classList.remove("open");
}));

/* -------------------------------------------------------------------
   HEADER ombra allo scroll
------------------------------------------------------------------- */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

/* -------------------------------------------------------------------
   REVEAL on scroll
------------------------------------------------------------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".section-head, .show-card, .podcast-card, .blog-card, .event-row, .stat-box, .perk, .player-card")
  .forEach(el => { el.classList.add("reveal"); io.observe(el); });

/* -------------------------------------------------------------------
   NEWSLETTER
   TODO (prima del lancio pubblico): collegare un servizio newsletter reale
   (Mailchimp, Brevo, ecc.) e i link social/donazione ai canali ufficiali.
   Allo stato attuale l'email NON viene inviata o salvata da nessuna parte:
   mostra solo un messaggio di conferma lato pagina.
------------------------------------------------------------------- */
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  document.getElementById("newsletterMsg").hidden = false;
});

/* -------------------------------------------------------------------
   INIT
------------------------------------------------------------------- */
buildTabs();
renderSchedule();
updateOnAir();
setInterval(updateOnAir, 60000); // aggiorna il programma in onda ogni minuto
