/* ============================================================
   易經 · EL ORÁCULO DE LAS MUTACIONES — app.js
   Fusiona: el ritual de monedas/altar/pergamino, la narración
   completa de los 64 hexagramas, y el minijuego ampliado
   de Acertijos del Sabio.
   ============================================================ */
(function(){
"use strict";

const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

/* ============================================================
   TEXTURA DE PAPEL + AMBIENTE
   ============================================================ */
(function(){
  const c = $('paper-bg');
  const ctx = c.getContext('2d');
  function draw(){
    c.width = innerWidth; c.height = innerHeight;
    const grad = ctx.createLinearGradient(0,0,c.width,c.height);
    grad.addColorStop(0,'#ecdfc0');
    grad.addColorStop(0.5,'#e6d4ac');
    grad.addColorStop(1,'#dcc899');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,c.width,c.height);
    for(let i=0;i<2200;i++){
      const x = Math.random()*c.width, y = Math.random()*c.height;
      ctx.fillStyle = Math.random()>0.5 ? 'rgba(43,32,24,0.025)' : 'rgba(255,250,235,0.03)';
      ctx.fillRect(x,y,1,1);
    }
  }
  draw();
  addEventListener('resize', draw);
})();

[[10,15,140],[85,70,110],[15,80,90],[92,30,120]].forEach(([top,left,size])=>{
  const s = document.createElement('div');
  s.className = 'stain';
  s.style.top = top+'%'; s.style.left = left+'%';
  s.style.width = size+'px'; s.style.height = size+'px';
  document.body.appendChild(s);
});

function spawnIncense(x){
  const wrap = document.createElement('div');
  wrap.className = 'incense';
  wrap.style.left = x + '%';
  wrap.innerHTML = `<svg viewBox="0 0 60 340"><path d="M30 340 C 20 280, 40 240, 28 190 C 18 150, 42 120, 30 70 C 22 40, 38 20, 30 0"
    fill="none" stroke="rgba(91,70,54,0.25)" stroke-width="6" stroke-linecap="round"/></svg>`;
  document.body.appendChild(wrap);
  wrap.animate([
    { opacity:0, transform:'translateY(0px)' },
    { opacity:0.5, offset:0.2 },
    { opacity:0.35, offset:0.7 },
    { opacity:0, transform:'translateY(-40px)' }
  ], { duration:7000, easing:'ease-in-out' });
  setTimeout(()=>wrap.remove(), 7000);
}
if(!reduceMotion){
  setInterval(()=>spawnIncense(12 + Math.random()*6), 2600);
  setInterval(()=>spawnIncense(84 + Math.random()*6), 3400);
  spawnIncense(14); spawnIncense(86);
}

/* ============================================================
   ÍNDICE DE HEXAGRAMAS POR BINARIO
   ============================================================ */
const HEX_BY_BIN = {};
HEXAGRAMAS.forEach(h => { HEX_BY_BIN[h.binario] = h; });

function trigramFromBits(bits){
  const asStr = bits.join('');
  return Object.keys(TRIGRAMAS).find(k => TRIGRAMAS[k].binario === asStr);
}

/* ============================================================
   FLUJO PRINCIPAL: pantallas
   ============================================================ */
const screenLanding = $('screen-landing');
const screenToss = $('screen-toss');
const screenReveal = $('screen-reveal');
const caption = $('caption');
const hexBuilding = $('hex-building');
const coinsWrap = $('coins');

let motionEnabled = false;
let tossing = false;
let currentLine = 0;      // líneas ya arrojadas en esta consulta (0-6)
let linesSoFar = [];      // resultados acumulados de esta consulta

const LINE_LABELS = ['la primera línea (la base)','la segunda línea','la tercera línea','la cuarta línea','la quinta línea','la sexta línea (la cúspide)'];

function tossPrompt(){
  if(currentLine >= 6) return '';
  const label = LINE_LABELS[currentLine];
  return motionEnabled
    ? `Agitá el celular para tirar ${label}`
    : `Tocá el altar para tirar ${label}`;
}

function resetTossState(){
  currentLine = 0;
  linesSoFar = [];
  tossing = false;
  hexBuilding.innerHTML = '';
}

$('btn-start').addEventListener('click', async () => {
  try{
    if(typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'){
      const res = await DeviceMotionEvent.requestPermission();
      if(res === 'granted'){ enableShake(); }
    } else if('DeviceMotionEvent' in window){
      enableShake();
    }
  }catch(e){ /* seguimos sin acelerómetro, con el toque táctil */ }

  resetTossState();
  screenLanding.classList.add('hidden');
  screenToss.classList.remove('hidden');
  caption.textContent = tossPrompt();
});

// El altar siempre puede tocarse, tenga o no sensor de movimiento.
$('altar').addEventListener('click', () => {
  altarShakeEffect(1);
  requestLineToss(1);
});

function enableShake(){
  if(motionEnabled) return; // evita agregar el listener más de una vez
  motionEnabled = true;
  let lastX=null,lastY=null,lastZ=null,lastTime=0;
  window.addEventListener('devicemotion', (e)=>{
    if(screenToss.classList.contains('hidden')) return; // solo cuenta durante la tirada
    const acc = e.accelerationIncludingGravity;
    if(!acc || acc.x===null) return;
    const now = Date.now();
    if(now - lastTime < 120) return;
    if(lastX!==null){
      const delta = Math.abs(acc.x-lastX)+Math.abs(acc.y-lastY)+Math.abs(acc.z-lastZ);
      if(delta > 26){
        // la magnitud de la sacudida se traduce en la intensidad de la animación:
        // un movimiento apenas por encima del umbral tira las monedas con suavidad;
        // una sacudida fuerte las hace volar más alto y girar más rápido.
        const intensity = clamp(delta / 55, 0.85, 2.6);
        altarShakeEffect(intensity);
        requestLineToss(intensity);
      }
    }
    lastX=acc.x; lastY=acc.y; lastZ=acc.z; lastTime=now;
  });
}

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

function altarShakeEffect(intensity){
  if(reduceMotion) return;
  const amp = 4 * intensity;
  $('altar').animate([
    { transform:`translate(0,0) rotate(0deg)` },
    { transform:`translate(${amp}px,${-amp*0.6}px) rotate(${amp*0.4}deg)` },
    { transform:`translate(${-amp}px,${amp*0.4}px) rotate(${-amp*0.4}deg)` },
    { transform:`translate(${amp*0.5}px,${-amp*0.3}px) rotate(${amp*0.2}deg)` },
    { transform:`translate(0,0) rotate(0deg)` }
  ], { duration: 260, easing:'ease-out' });
}

function requestLineToss(intensity){
  if(tossing || currentLine >= 6) return;
  tossing = true;
  caption.textContent = 'Las monedas caen...';
  tossThreeCoins(intensity).then(async (result) => {
    linesSoFar.push(result);
    addLineToBuilding(result);
    currentLine++;
    if(currentLine >= 6){
      caption.textContent = 'El hexagrama está completo.';
      await wait(reduceMotion ? 60 : 700);
      revealHexagram(linesSoFar);
    } else {
      await wait(reduceMotion ? 40 : 300);
      caption.textContent = tossPrompt();
      tossing = false;
    }
  });
}

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

function tossThreeCoins(intensity){
  const coinEls = coinsWrap.querySelectorAll('.coin');
  const outcomes = [0,1,2].map(()=> Math.random() < 0.5); // true = cara (yang, valor 3)
  const anims = [];
  coinEls.forEach((el, idx)=>{
    anims.push(animateCoin(el, outcomes[idx], intensity));
  });
  return Promise.all(anims).then(()=>{
    const sum = outcomes.reduce((acc,isHeads)=> acc + (isHeads?3:2), 0);
    const bit = (sum===7 || sum===9) ? 1 : 0;
    const changing = (sum===6 || sum===9);
    return { sum, bit, changing };
  });
}

function animateCoin(el, isHeads, intensity){
  if(reduceMotion){
    el.style.transform = `rotateX(${isHeads?0:180}deg)`;
    return Promise.resolve();
  }
  intensity = intensity || 1;
  const finalRotate = isHeads ? 0 : 180;
  // más intensidad = más vueltas en el aire y un vuelo más alto
  const spins = Math.round((2 + Math.random()*1.5) * (0.75 + intensity*0.4));
  const total = spins*360 + finalRotate;
  const height = 120 * (0.7 + intensity*0.5);
  const wobbleY = (Math.random()*40 - 20) * (0.7 + intensity*0.4);
  const duration = 950 + 260 * clamp(intensity, 0.85, 2.6);
  const anim = el.animate([
    { transform:`translateY(-${height}px) translateX(0px) rotateX(0deg) rotateY(0deg)`, offset:0 },
    { transform:`translateY(6px) translateX(${wobbleY*0.3}px) rotateX(${total*0.55}deg) rotateY(140deg)`, offset:0.5 },
    { transform:`translateY(-16px) translateX(${wobbleY*0.5}px) rotateX(${total*0.75}deg) rotateY(220deg)`, offset:0.65 },
    { transform:`translateY(2px) translateX(${wobbleY*0.7}px) rotateX(${total*0.9}deg) rotateY(300deg)`, offset:0.8 },
    { transform:`translateY(-5px) translateX(${wobbleY}px) rotateX(${total*0.96}deg) rotateY(340deg)`, offset:0.9 },
    { transform:`translateY(0px) translateX(${wobbleY}px) rotateX(${total}deg) rotateY(360deg)`, offset:1 }
  ], { duration, easing:'cubic-bezier(.25,.55,.3,1)', fill:'forwards' });
  return anim.finished.catch(()=>{});
}

function addLineToBuilding(result){
  const row = document.createElement('div');
  row.className = 'line-row';
  row.appendChild(buildBar(result.bit, result.changing));
  hexBuilding.appendChild(row);
}

function buildBar(bit, changing){
  const wrap = document.createElement('div');
  wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='6px';
  const bar = document.createElement('div');
  if(bit===1){
    bar.className = 'bar';
  } else {
    bar.className = 'bar yin';
    const h1 = document.createElement('div'); h1.className='half';
    const h2 = document.createElement('div'); h2.className='half';
    bar.appendChild(h1); bar.appendChild(h2);
  }
  const mark = document.createElement('span');
  mark.className = 'mark';
  mark.textContent = changing ? (bit===1 ? '○' : '×') : '';
  wrap.appendChild(bar);
  wrap.appendChild(mark);
  return wrap;
}

/* ------------------- Renderizado de la narración completa ------------------- */

function fillHexagramBlock(hex, prefix){
  $(`${prefix}-glyph`).textContent = hex.unicode;
  $(`${prefix}-cn`).textContent = hex.hanzi;
  $(`${prefix}-py`).textContent = hex.pinyin;
  $(`${prefix}-name`).textContent = hex.nombre;
  $(`${prefix}-subtitle`).textContent = hex.subtitulo || '';
  const es = document.getElementById(`${prefix}-essence`);
  if(es) es.textContent = hex.esencia;
  const na = document.getElementById(`${prefix}-narrative`);
  if(na) na.textContent = hex.narracion;
  const d = document.getElementById(`${prefix}-dictamen`);
  if(d) d.textContent = hex.dictamen;
  const im = document.getElementById(`${prefix}-imagen`);
  if(im) im.textContent = hex.imagen;
}

function revealHexagram(lines){
  const bits = lines.map(l=>l.bit);
  const bin = bits.join('');
  const hex = HEX_BY_BIN[bin];

  $('out-number').textContent = 'Hexagrama ' + hex.num + ' de 64';
  fillHexagramBlock(hex, 'out');
  $('out-trigrams').innerHTML =
    `<span><span class="sym">${TRIGRAMAS[hex.trigSup].simbolo}</span>Arriba: ${TRIGRAMAS[hex.trigSup].nombre}</span>` +
    `<span><span class="sym">${TRIGRAMAS[hex.trigInf].simbolo}</span>Abajo: ${TRIGRAMAS[hex.trigInf].nombre}</span>`;

  const linesFinal = $('out-lines');
  linesFinal.innerHTML = '';
  lines.forEach(l=>{
    const row = document.createElement('div');
    row.className = 'line-row';
    row.appendChild(buildBar(l.bit, l.changing));
    linesFinal.appendChild(row);
  });

  // colapsar el bloque expandible cada vez que se muestra un hexagrama nuevo
  $('expand-out').classList.remove('open');
  $('btn-expand-out').textContent = 'Ver dictamen e imagen ▾';
  $('btn-expand-out').setAttribute('aria-expanded','false');

  const changingLines = lines
    .map((l,i)=>({...l, pos:i+1}))
    .filter(l=>l.changing);

  const changingBox = $('changing-lines-box');
  const changingText = $('changing-lines-text');
  if(changingLines.length > 0){
    changingBox.classList.remove('hidden');
    changingText.innerHTML = changingLines.map(l=>{
      const tipoOriginal = l.bit===1 ? 'yang viejo (9)' : 'yin viejo (6)';
      const seConvierte = l.bit===1 ? 'yin' : 'yang';
      return `<div>Línea ${l.pos}: ${tipoOriginal}, en transformación hacia ${seConvierte}.</div>`;
    }).join('');
  } else {
    changingBox.classList.add('hidden');
    changingText.innerHTML = '';
  }

  const hasChanging = changingLines.length > 0;
  const transformNote = $('transform-note');
  $('screen-transform').classList.add('hidden');
  if(hasChanging){
    transformNote.classList.remove('hidden');
    const transBits = bits.map((b,i)=> lines[i].changing ? (1-b) : b);
    const tBin = transBits.join('');
    const tHex = HEX_BY_BIN[tBin];
    fillHexagramBlock(tHex, 't');
    $('expand-t').classList.remove('open');
    $('btn-expand-t').textContent = 'Ver dictamen e imagen ▾';
    $('btn-expand-t').setAttribute('aria-expanded','false');
    $('btn-show-transform').onclick = () => {
      $('screen-transform').classList.remove('hidden');
      transformNote.classList.add('hidden');
    };
  } else {
    transformNote.classList.add('hidden');
  }

  screenToss.classList.add('hidden');
  screenReveal.classList.remove('hidden');
  requestAnimationFrame(()=>{
    $('scroll-primary').classList.add('open');
    setTimeout(()=>{ $('stamp').classList.add('stamp-in'); }, reduceMotion ? 0 : 700);
  });
}

$('btn-expand-out').addEventListener('click', () => {
  const opening = !$('expand-out').classList.contains('open');
  $('expand-out').classList.toggle('open', opening);
  $('btn-expand-out').textContent = opening ? 'Ver menos ▴' : 'Ver dictamen e imagen ▾';
  $('btn-expand-out').setAttribute('aria-expanded', String(opening));
});
$('btn-expand-t').addEventListener('click', () => {
  const opening = !$('expand-t').classList.contains('open');
  $('expand-t').classList.toggle('open', opening);
  $('btn-expand-t').textContent = opening ? 'Ver menos ▴' : 'Ver dictamen e imagen ▾';
  $('btn-expand-t').setAttribute('aria-expanded', String(opening));
});

$('btn-again').addEventListener('click', () => {
  $('scroll-primary').classList.remove('open');
  $('stamp').classList.remove('stamp-in');
  $('screen-transform').classList.add('hidden');
  screenReveal.classList.add('hidden');
  resetTossState();
  screenLanding.classList.remove('hidden');
});

/* ============================================================
   OVERLAYS: cómo funciona
   ============================================================ */
function openOverlay(el){
  el.classList.remove('hidden');
  requestAnimationFrame(()=> el.classList.add('visible'));
}
function closeOverlay(el){
  el.classList.remove('visible');
  setTimeout(()=> el.classList.add('hidden'), reduceMotion ? 0 : 200);
}
document.querySelectorAll('.overlay').forEach(el=>{
  el.addEventListener('click', (ev)=>{ if(ev.target === el) closeOverlay(el); });
});
document.addEventListener('keydown', (ev)=>{
  if(ev.key === 'Escape'){
    document.querySelectorAll('.overlay.visible').forEach(closeOverlay);
  }
});

const overlayInfo = $('overlay-info');
$('btn-open-info').addEventListener('click', ()=> openOverlay(overlayInfo));
$('btn-close-info').addEventListener('click', ()=> closeOverlay(overlayInfo));

/* ============================================================
   MINIJUEGO: Acertijos del Sabio
   ============================================================ */
const overlayGame = $('overlay-game');
const viewIntro = $('game-view-intro');
const viewQuestion = $('game-view-question');
const viewEnd = $('game-view-end');
const elProgress = $('game-progress-text');
const elScore = $('game-score-text');
const elTag = $('game-tag');
const elQuestion = $('game-question-text');
const elOptions = $('game-options');
const elFeedback = $('game-feedback');
const elNextBtn = $('btn-next-question');
const elFinalScore = $('game-final-score');
const elFinalRank = $('game-final-rank');

const QUESTIONS_PER_ROUND = 10;
let deck = [];
let qIndex = 0;
let score = 0;
let answered = false;

function shuffle(arr){
  const copy = arr.slice();
  for(let i=copy.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy;
}

function startGame(){
  deck = shuffle(ACERTIJOS).slice(0, QUESTIONS_PER_ROUND);
  qIndex = 0;
  score = 0;
  viewIntro.classList.add('hidden');
  viewEnd.classList.add('hidden');
  viewQuestion.classList.remove('hidden');
  showQuestion();
}

function showQuestion(){
  answered = false;
  const item = deck[qIndex];
  elProgress.textContent = `Pregunta ${qIndex+1} de ${deck.length}`;
  elScore.textContent = `Puntaje: ${score}`;
  elTag.textContent = item.tipo === 'trivia' ? 'Trivia' : 'Acertijo';
  elQuestion.textContent = item.pregunta;
  elFeedback.classList.add('hidden');
  elFeedback.innerHTML = '';
  elNextBtn.classList.add('hidden');
  elOptions.innerHTML = '';

  if(item.tipo === 'trivia'){
    // Mezclamos las opciones en cada partida para que la posición
    // de la respuesta correcta no sea siempre la misma.
    const order = shuffle(item.opciones.map((texto, i) => ({ texto, esCorrecta: i === item.correcta })));
    order.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option';
      btn.type = 'button';
      btn.textContent = opt.texto;
      btn.addEventListener('click', () => answerTrivia(opt.esCorrecta, order, btn));
      elOptions.appendChild(btn);
    });
  } else {
    const btn = document.createElement('button');
    btn.className = 'game-reveal-btn';
    btn.type = 'button';
    btn.textContent = '🔮 Revelar respuesta';
    btn.addEventListener('click', () => revealRiddle());
    elOptions.appendChild(btn);
  }
}

function answerTrivia(isCorrect, order, chosenBtn){
  if(answered) return;
  answered = true;
  const item = deck[qIndex];
  if(isCorrect) score++;

  Array.from(elOptions.children).forEach((btn, i) => {
    btn.disabled = true;
    if(order[i].esCorrecta) btn.classList.add('correct');
    else if(btn === chosenBtn) btn.classList.add('incorrect');
  });

  elFeedback.classList.remove('hidden');
  elFeedback.className = 'game-feedback ' + (isCorrect ? 'is-correct' : 'is-incorrect');
  elFeedback.innerHTML = `<strong>${isCorrect ? '✓ Correcto.' : '✕ No exactamente.'}</strong>${item.explicacion}`;
  elScore.textContent = `Puntaje: ${score}`;
  elNextBtn.classList.remove('hidden');
}

function revealRiddle(){
  if(answered) return;
  answered = true;
  const item = deck[qIndex];
  elOptions.innerHTML = '';

  elFeedback.classList.remove('hidden');
  elFeedback.className = 'game-feedback is-revealed';
  elFeedback.innerHTML = `<strong>Respuesta:</strong>${item.respuesta}<br><br>${item.explicacion}
    <div class="mini-answer-check">
      <span>¿Lo tenías?</span>
      <button type="button" class="mini-btn" data-si="1">Sí</button>
      <button type="button" class="mini-btn" data-si="0">No, pero aprendí</button>
    </div>`;
  elFeedback.querySelectorAll('.mini-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(b.dataset.si === '1') score++;
      elScore.textContent = `Puntaje: ${score}`;
      elFeedback.querySelectorAll('.mini-btn').forEach(x=>x.disabled = true);
      elNextBtn.classList.remove('hidden');
    });
  });
}

function nextQuestion(){
  qIndex++;
  if(qIndex >= deck.length){
    showEnd();
  } else {
    showQuestion();
  }
}

function rankForScore(p, total){
  const pct = p/total;
  if(pct >= 1) return 'Sabio Iluminado 卦';
  if(pct >= 0.8) return 'Guardián del Tao';
  if(pct >= 0.55) return 'Discípulo del Sabio';
  if(pct >= 0.3) return 'Buscador del Camino';
  return 'Aprendiz de las Sombras';
}

function showEnd(){
  viewQuestion.classList.add('hidden');
  viewEnd.classList.remove('hidden');
  elFinalScore.textContent = `Obtuviste ${score} de ${deck.length} respuestas.`;
  elFinalRank.textContent = 'Tu rango: ' + rankForScore(score, deck.length);
}

function openGame(){
  viewQuestion.classList.add('hidden');
  viewEnd.classList.add('hidden');
  viewIntro.classList.remove('hidden');
  openOverlay(overlayGame);
}

$('btn-start-game').addEventListener('click', startGame);
$('btn-play-again').addEventListener('click', startGame);
$('btn-next-question').addEventListener('click', nextQuestion);
$('btn-close-game').addEventListener('click', ()=> closeOverlay(overlayGame));
$('btn-open-game-from-landing').addEventListener('click', openGame);
$('btn-open-game-from-reveal').addEventListener('click', openGame);

})();
