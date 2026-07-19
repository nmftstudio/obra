/* Obra del Día — lógica de cliente */

const $ = (sel) => document.querySelector(sel);

const els = {
  dateLabel: $("#date-label"),
  canvas: $("#painting-canvas"),
  canvasLoading: $("#canvas-loading"),
  plaque: $("#plaque-text"),
  attemptsRow: $("#attempts-row"),
  form: $("#guess-form"),
  input: $("#guess-input"),
  submit: $("#guess-submit"),
  feedback: $("#feedback"),
  resultCard: $("#result-card"),
  resultTitle: $("#result-title"),
  resultMeta: $("#result-meta"),
  resultFact: $("#result-fact"),
  btnShare: $("#btn-share"),
  btnHelp: $("#btn-help"),
  btnStats: $("#btn-stats"),
  helpModal: $("#help-modal"),
  statsModal: $("#stats-modal"),
  frameInner: document.querySelector(".frame-inner"),
};

const MAX_ATTEMPTS = 6;
// bloques de pixelado por intento: 0 = totalmente bloqueado, 5 = casi nítido
const PIXEL_STEPS = [42, 30, 20, 12, 6, 1];
// tamaño del "agujero" del reflector (mask), crece con cada intento
const SPOT_INNER = [10, 16, 24, 34, 48, 999];
const SPOT_MID = [26, 34, 44, 58, 74, 999];

const STORAGE_KEY = "obra-del-dia-stats-v1";

let state = {
  paintingId: null,
  date: null,
  attempt: 0,
  finished: false,
  image: null,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      played: 0, wins: 0, streak: 0, bestStreak: 0, lastPlayed: null, lastResult: null,
    };
  } catch {
    return { played: 0, wins: 0, streak: 0, bestStreak: 0, lastPlayed: null, lastResult: null };
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function recordResult(won) {
  const stats = loadStats();
  const today = todayKey();
  if (stats.lastPlayed === today) return stats; // ya jugado hoy
  stats.played += 1;
  if (won) {
    stats.wins += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  stats.lastPlayed = today;
  stats.lastResult = won ? "win" : "loss";
  saveStats(stats);
  return stats;
}

function renderStats() {
  const s = loadStats();
  const winrate = s.played ? Math.round((s.wins / s.played) * 100) : 0;
  $("#stat-played").textContent = s.played;
  $("#stat-winrate").textContent = `${winrate}%`;
  $("#stat-streak").textContent = s.streak;
  $("#stat-best").textContent = s.bestStreak;
}

function buildAttemptsRow() {
  els.attemptsRow.innerHTML = "";
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const dot = document.createElement("div");
    dot.className = "attempt-dot pending";
    dot.textContent = i + 1;
    els.attemptsRow.appendChild(dot);
  }
}

function markAttempt(index, kind) {
  const dot = els.attemptsRow.children[index];
  if (!dot) return;
  dot.classList.remove("pending");
  dot.classList.add(kind);
  dot.textContent = kind === "hit" ? "✓" : kind === "miss" ? "✕" : "~";
}

function setSpotlight(step) {
  const i = Math.min(step, SPOT_INNER.length - 1);
  els.frameInner.style.setProperty("--spot-inner", `${SPOT_INNER[i]}%`);
  els.frameInner.style.setProperty("--spot-mid", `${SPOT_MID[i]}%`);
}

function pixelate(image, blocks) {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);

  if (blocks <= 1) {
    ctx.drawImage(image, 0, 0, w, h);
    return;
  }

  const off = document.createElement("canvas");
  off.width = blocks;
  off.height = blocks;
  const offCtx = off.getContext("2d");
  offCtx.imageSmoothingEnabled = true;
  offCtx.drawImage(image, 0, 0, blocks, blocks);

  ctx.drawImage(off, 0, 0, blocks, blocks, 0, 0, w, h);
}

async function loadPaintingOfTheDay() {
  buildAttemptsRow();
  els.canvasLoading.classList.remove("hidden");
  els.plaque.textContent = "¿Qué obra es esta?";
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.resultCard.classList.add("hidden");
  els.input.value = "";
  els.input.disabled = false;
  els.submit.disabled = false;

  const res = await fetch(`/api/obra-del-dia?fecha=${todayKey()}`);
  const data = await res.json();

  state.paintingId = data.id;
  state.date = data.date;
  state.attempt = 0;
  state.finished = false;

  const d = new Date(data.date + "T00:00:00");
  const formatted = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  els.dateLabel.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    state.image = img;
    setSpotlight(0);
    pixelate(img, PIXEL_STEPS[0]);
    els.canvasLoading.classList.add("hidden");
  };
  img.onerror = () => {
    // Fallback si Wikimedia Commons no responde: degradado artístico + aviso
    els.canvasLoading.classList.add("hidden");
    const ctx = els.canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 900, 900);
    grad.addColorStop(0, "#2a2119");
    grad.addColorStop(1, "#0f0c10");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 900);
    setSpotlight(5);
  };
  img.src = data.image_url;

  const local = loadStats();
  if (local.lastPlayed === todayKey()) {
    els.input.disabled = true;
    els.submit.disabled = true;
    els.plaque.textContent = "Ya jugaste la obra de hoy — volvé mañana";
  }
}

async function submitGuess(guess) {
  if (state.finished || !guess.trim()) return;

  state.attempt += 1;
  const res = await fetch("/api/intento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      painting_id: state.paintingId,
      guess,
      attempt_number: state.attempt,
    }),
  });
  const data = await res.json();

  const dotIndex = state.attempt - 1;

  if (data.correct) {
    markAttempt(dotIndex, "hit");
    finishGame(true, data);
    return;
  }

  markAttempt(dotIndex, data.close ? "close" : "miss");
  els.feedback.textContent = data.message;
  els.feedback.className = `feedback ${data.close ? "close" : "miss"}`;

  if (state.image) pixelate(state.image, PIXEL_STEPS[Math.min(state.attempt, PIXEL_STEPS.length - 1)]);
  setSpotlight(state.attempt);

  if (state.attempt >= MAX_ATTEMPTS) {
    finishGame(false, data);
  }
}

function finishGame(won, data) {
  state.finished = true;
  els.input.disabled = true;
  els.submit.disabled = true;

  if (state.image) pixelate(state.image, 1);
  setSpotlight(5);

  els.plaque.textContent = data.solved_title || "";
  els.feedback.textContent = won ? "¡La identificaste!" : "Esta vez no salió.";
  els.feedback.className = `feedback ${won ? "hit" : "miss"}`;

  els.resultTitle.textContent = data.solved_title || "";
  els.resultMeta.textContent = `${data.solved_artist} · ${data.solved_year} · ${data.solved_museum}`;
  els.resultFact.textContent = data.fun_fact || "";
  els.resultCard.classList.remove("hidden");

  recordResult(won);
  renderStats();
}

function buildShareText() {
  const cells = Array.from(els.attemptsRow.children).map((dot) => {
    if (dot.classList.contains("hit")) return "🟩";
    if (dot.classList.contains("close")) return "🟨";
    if (dot.classList.contains("miss")) return "🟥";
    return "⬛";
  });
  return `Obra del Día — ${state.date}\n${cells.join("")}\nnmft.ar/obra-del-dia`;
}

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = els.input.value;
  els.input.value = "";
  submitGuess(value);
});

els.btnShare.addEventListener("click", async () => {
  const text = buildShareText();
  try {
    await navigator.clipboard.writeText(text);
    els.btnShare.textContent = "¡Copiado!";
    setTimeout(() => (els.btnShare.textContent = "Copiar resultado"), 1800);
  } catch {
    els.btnShare.textContent = "No se pudo copiar";
  }
});

function openModal(modal) { modal.classList.remove("hidden"); }
function closeModal(modal) { modal.classList.add("hidden"); }

els.btnHelp.addEventListener("click", () => openModal(els.helpModal));
els.btnStats.addEventListener("click", () => { renderStats(); openModal(els.statsModal); });

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", (e) => closeModal(e.target.closest(".modal")));
});
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(modal); });
});

loadPaintingOfTheDay();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/assets/sw.js").catch(() => {});
  });
}
