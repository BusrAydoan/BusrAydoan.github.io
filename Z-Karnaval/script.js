const DESIGN = {
  delayMs: 2000,
  paintColor: '#d61c1c',
  woodDark: '#3a2113',
  woodMid: '#5c371d',
  goldDark: '#99741e',
  goldLight: '#fce38a',
  topTrackSpeed: 1.4,
  bottomTrackSpeed: 2.6,
  targetRadius: 22,
  splatterRadius: 30,
  splatterDurationMs: 3800
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playHitSound() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.08);
    osc.stop(audioCtx.currentTime + idx * 0.08 + 0.35);
  });
}

function playWinFanfare() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.45);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.12);
    osc.stop(audioCtx.currentTime + idx * 0.12 + 0.45);
  });
}

const state = { 
  shots: [], 
  splatters: [], 
  targets: [], 
  particles: [], 
  popups: [], 
  mouseX: 480, 
  mouseY: 270,
  score: 0,
  gameWon: false,
  bearScale: 0
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const overlayResetBtn = document.getElementById('overlayResetBtn');
const restartOverlay = document.getElementById('restartOverlay');
const statusLabel = document.getElementById('statusLabel');

// TOPUN KONUMU (Siyah Dairesel Taban ile Namlu Aynı Noktada Hizalandı)
const GUN_X = 800;
const GUN_Y = 500;

function initTargets() {
  state.targets = [];
  for (let i = 0; i < 6; i++) {
    state.targets.push({ x: i * 160 + 50, y: 190, track: 'top', type: i % 2 === 0 ? 'duck' : 'target' });
  }
  for (let i = 0; i < 5; i++) {
    state.targets.push({ x: i * 190 + 80, y: 325, track: 'bottom', type: i % 2 === 0 ? 'target' : 'duck' });
  }
}

function resetGame() {
  state.shots = [];
  state.splatters = [];
  state.particles = [];
  state.popups = [];
  state.score = 0;
  state.gameWon = false;
  state.bearScale = 0;
  restartOverlay.classList.remove('active');
  initTargets();
  statusLabel.textContent = "Hazır: 3 Hedef Vur ve Ödülü Kazan!";
}

function handleShoot(targetX, targetY) {
  if (state.gameWon) return;
  const now = performance.now();
  // Merminin çıkış noktası doğrudan siyah top tabanı (GUN_X, GUN_Y) yapıldı
  state.shots.push({ startX: GUN_X, startY: GUN_Y, targetX, targetY, timestamp: now, triggered: false });
  statusLabel.textContent = `Ateşlendi! Mermi 2.0 saniye sonra varış noktasına ulaşacak.`;
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  state.mouseX = e.clientX - rect.left;
  state.mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  handleShoot(e.clientX - rect.left, e.clientY - rect.top);
});

resetBtn.addEventListener('click', resetGame);
overlayResetBtn.addEventListener('click', resetGame);

function triggerCelebration(x, y) {
  playHitSound();
  const colors = ['#fce38a', '#ffffff', '#e62e2e', '#1f6d8a', '#ff77c6'];
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 7;
    state.particles.push({ 
      x, y, 
      vx: Math.cos(angle) * speed, 
      vy: Math.sin(angle) * speed - 2.5, 
      color: colors[Math.floor(Math.random() * colors.length)], 
      radius: 3 + Math.random() * 4, 
      alpha: 1.0 
    });
  }
  const messages = ["TEBRİKLER!", "HARİKA VURUŞ!", "MÜKEMMEL!", "TAM İSABET!"];
  state.popups.push({ x, y: y - 25, text: messages[Math.floor(Math.random() * messages.length)], alpha: 1.0 });
}

function triggerWinCelebration() {
  state.gameWon = true;
  playWinFanfare();

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);
    const colors = ['#fce38a', '#ffffff', '#e62e2e', '#00ff77', '#ff77c6', '#00e5ff'];
    state.particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * 6 - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: 4 + Math.random() * 6,
      alpha: 1.0
    });
  }

  setTimeout(() => {
    restartOverlay.classList.add('active');
  }, 2800);
}

function updateRules(now) {
  state.targets.forEach(target => {
    const speed = target.track === 'top' ? DESIGN.topTrackSpeed : DESIGN.bottomTrackSpeed;
    target.x += speed;
    if (target.x > canvas.width - 70) target.x = 70;
  });

  state.shots.forEach(shot => {
    const elapsed = now - shot.timestamp;
    if (elapsed >= DESIGN.delayMs && !shot.triggered) {
      shot.triggered = true;
      state.splatters.push({ x: shot.targetX, y: shot.targetY, timestamp: now });
      let hit = false;
      state.targets.forEach(target => {
        const dx = target.x - shot.targetX;
        const dy = target.y - shot.targetY;
        if (Math.sqrt(dx * dx + dy * dy) < DESIGN.targetRadius + 14) {
          hit = true;
          target.x = 70;
        }
      });

      if (hit) {
        triggerCelebration(shot.targetX, shot.targetY);
        if (!state.gameWon) {
          state.score += 1;
          statusLabel.textContent = `Vurulan Hedef: ${state.score} / 3`;
          if (state.score >= 3) {
            triggerWinCelebration();
          }
        }
      }
    }
  });

  if (state.gameWon && state.bearScale < 1) {
    state.bearScale += 0.025;
  }

  state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.14; p.alpha -= 0.01; });
  state.popups.forEach(pop => { pop.y -= 0.9; pop.alpha -= 0.012; });

  state.shots = state.shots.filter(s => !s.triggered);
  state.splatters = state.splatters.filter(s => now - s.timestamp < DESIGN.splatterDurationMs);
  state.particles = state.particles.filter(p => p.alpha > 0);
  state.popups = state.popups.filter(pop => pop.alpha > 0);
}

function drawCarnivalStage() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2;

  const bgGrad = ctx.createRadialGradient(cx, -50, 50, cx, -50, 600);
  bgGrad.addColorStop(0, '#731418');
  bgGrad.addColorStop(1, '#240608');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const numRays = 18, angleStep = Math.PI / numRays;
  for (let i = 0; i < numRays; i += 2) {
    ctx.beginPath(); 
    ctx.moveTo(cx, -80); 
    ctx.arc(cx, -80, 550, i * angleStep, (i + 1) * angleStep); 
    ctx.closePath();
    ctx.fillStyle = 'rgba(180, 20, 30, 0.35)'; 
    ctx.fill();
  }

  ctx.fillStyle = '#30180d';
  ctx.fillRect(70, 70, w - 140, 330);
  
  const stripeW = 24;
  for (let x = 70; x < w - 70; x += stripeW) {
    const grad = ctx.createLinearGradient(x, 0, x + stripeW, 0);
    grad.addColorStop(0, '#261209');
    grad.addColorStop(0.5, '#402013');
    grad.addColorStop(1, '#261209');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 70, stripeW - 1, 330);
  }

  draw3DShelfAndWaves(140, 225);
  draw3DShelfAndWaves(275, 360);

  drawCurtain(0, false);
  drawCurtain(w, true);
  drawGoldenArch();

  const counterGrad = ctx.createLinearGradient(0, 400, 0, h);
  counterGrad.addColorStop(0, '#754625');
  counterGrad.addColorStop(0.15, '#4a2b15');
  counterGrad.addColorStop(1, '#211207');
  ctx.fillStyle = counterGrad;
  ctx.fillRect(0, 400, w, h - 400);

  ctx.fillStyle = DESIGN.goldDark;
  ctx.fillRect(0, 400, w, 14);
  const goldChutes = ctx.createLinearGradient(0, 400, 0, 414);
  goldChutes.addColorStop(0, '#ffe885');
  goldChutes.addColorStop(1, '#99741e');
  ctx.fillStyle = goldChutes;
  ctx.fillRect(0, 402, w, 5);

  for (let x = 40; x < w; x += 55) {
    const bulbGlow = ctx.createRadialGradient(x, 407, 1, x, 407, 14);
    bulbGlow.addColorStop(0, '#ffffff');
    bulbGlow.addColorStop(0.4, '#ffdb66');
    bulbGlow.addColorStop(1, 'rgba(255, 219, 102, 0)');
    ctx.fillStyle = bulbGlow;
    ctx.beginPath(); ctx.arc(x, 407, 14, 0, Math.PI * 2); ctx.fill();
  }

  drawScoreBoard();
}

function drawGoldenArch() {
  const w = canvas.width;
  ctx.save();
  const archGrad = ctx.createLinearGradient(0, 50, 0, 85);
  archGrad.addColorStop(0, '#fff3a8');
  archGrad.addColorStop(0.5, '#d4af37');
  archGrad.addColorStop(1, '#7a5b13');
  ctx.fillStyle = archGrad;
  ctx.fillRect(0, 50, w, 28);

  for (let x = 30; x < w; x += 45) {
    draw3DStar(x, 64, 5, 8, 4);
  }
  ctx.restore();
}

function draw3DStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3, x = cx, y = cy, step = Math.PI / spikes;
  ctx.beginPath(); ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius; ctx.lineTo(x, y); rot += step;
    x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius; ctx.lineTo(x, y); rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius); ctx.closePath(); 
  ctx.fillStyle = '#fff7cc'; ctx.fill();
}

function drawCurtain(startX, isRight) {
  ctx.save();
  if (isRight) {
    ctx.translate(startX, 0);
    ctx.scale(-1, 1);
  }
  const curtainGrad = ctx.createLinearGradient(0, 0, 100, 0);
  curtainGrad.addColorStop(0, '#b81424');
  curtainGrad.addColorStop(0.3, '#750914');
  curtainGrad.addColorStop(0.7, '#a81322');
  curtainGrad.addColorStop(1, '#3d0208');

  ctx.fillStyle = curtainGrad;
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.quadraticCurveTo(90, 200, 85, 410);
  ctx.lineTo(0, 410);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffd700';
  ctx.fillRect(0, 230, 75, 10);
  ctx.restore();
}

function draw3DShelfAndWaves(shelfY, waveY) {
  const w = canvas.width;
  const shelfGrad = ctx.createLinearGradient(0, shelfY, 0, shelfY + 22);
  shelfGrad.addColorStop(0, '#804b24');
  shelfGrad.addColorStop(0.3, '#5c3518');
  shelfGrad.addColorStop(1, '#2e1809');
  ctx.fillStyle = shelfGrad;
  ctx.fillRect(70, shelfY, w - 140, 22);

  const waveGrad = ctx.createLinearGradient(0, waveY, 0, waveY + 35);
  waveGrad.addColorStop(0, '#2486a6');
  waveGrad.addColorStop(1, '#0b3947');
  ctx.fillStyle = waveGrad;

  ctx.beginPath(); 
  ctx.moveTo(70, waveY);
  for (let x = 70; x <= w - 70; x += 45) {
    ctx.quadraticCurveTo(x + 12, waveY - 18, x + 22, waveY);
    ctx.quadraticCurveTo(x + 33, waveY + 14, x + 45, waveY);
  }
  ctx.lineTo(w - 70, waveY + 35); 
  ctx.lineTo(70, waveY + 35); 
  ctx.closePath(); 
  ctx.fill();
}

function drawScoreBoard() {
  ctx.save();
  ctx.translate(140, 45);
  
  const boardGrad = ctx.createLinearGradient(0, -25, 0, 25);
  boardGrad.addColorStop(0, '#4a2c17');
  boardGrad.addColorStop(1, '#1c0f07');
  ctx.fillStyle = boardGrad;
  ctx.fillRect(-75, -25, 150, 50);

  ctx.strokeStyle = DESIGN.goldLight;
  ctx.lineWidth = 3;
  ctx.strokeRect(-75, -25, 150, 50);

  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillStyle = DESIGN.goldLight;
  ctx.textAlign = 'center';
  ctx.fillText("SKOR TABELASI", 0, -7);

  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${state.score} / 3 HEDEF`, 0, 16);
  ctx.restore();
}

function drawTargets() {
  state.targets.forEach(target => {
    ctx.save(); 
    ctx.translate(target.x, target.y);

    const rodGrad = ctx.createLinearGradient(-4, 0, 4, 0);
    rodGrad.addColorStop(0, '#404040');
    rodGrad.addColorStop(0.5, '#aaaaaa');
    rodGrad.addColorStop(1, '#222222');
    ctx.fillStyle = rodGrad; 
    ctx.fillRect(-4, 0, 8, 40);

    if (target.type === 'duck') {
      const duckGrad = ctx.createRadialGradient(-4, -12, 2, 0, -10, 22);
      duckGrad.addColorStop(0, '#fff4b8');
      duckGrad.addColorStop(0.4, '#ffd700');
      duckGrad.addColorStop(1, '#b8860b');

      ctx.fillStyle = duckGrad;
      ctx.beginPath(); ctx.ellipse(-2, -5, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(12, -18, 10, 0, Math.PI * 2); ctx.fill();
      
      ctx.fillStyle = '#ff6600';
      ctx.beginPath(); ctx.ellipse(20, -16, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath(); ctx.arc(14, -20, 2, 0, Math.PI * 2); ctx.fill();
    } else {
      const r = DESIGN.targetRadius;
      
      const tGrad1 = ctx.createRadialGradient(-4, -14, 2, 0, -10, r);
      tGrad1.addColorStop(0, '#ff6666');
      tGrad1.addColorStop(1, '#990000');
      ctx.fillStyle = tGrad1; ctx.beginPath(); ctx.arc(0, -10, r, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, -10, r * 0.65, 0, Math.PI * 2); ctx.fill();

      const tGrad2 = ctx.createRadialGradient(-2, -12, 1, 0, -10, r * 0.35);
      tGrad2.addColorStop(0, '#ff4d4d');
      tGrad2.addColorStop(1, '#800000');
      ctx.fillStyle = tGrad2; ctx.beginPath(); ctx.arc(0, -10, r * 0.35, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });
}

function drawTemporalShots(now) {
  state.shots.forEach(shot => {
    const elapsed = now - shot.timestamp;
    const progress = Math.min(elapsed / DESIGN.delayMs, 1.0);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; 
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(shot.targetX, shot.targetY, 22, 0, Math.PI * 2); ctx.stroke();
    
    ctx.strokeStyle = DESIGN.paintColor; 
    ctx.lineWidth = 5;
    ctx.beginPath(); 
    ctx.arc(shot.targetX, shot.targetY, 22, -Math.PI / 2, (-Math.PI / 2) + (progress * Math.PI * 2)); 
    ctx.stroke();

    const currentX = shot.startX + (shot.targetX - shot.startX) * progress;
    const currentY = shot.startY + (shot.targetY - shot.startY) * progress;
    
    const ballGrad = ctx.createRadialGradient(currentX - 3, currentY - 3, 1, currentX, currentY, 10);
    ballGrad.addColorStop(0, '#ff9999');
    ballGrad.addColorStop(0.3, '#ff0000');
    ballGrad.addColorStop(1, '#660000');
    
    ctx.fillStyle = ballGrad; 
    ctx.beginPath(); ctx.arc(currentX, currentY, 10, 0, Math.PI * 2); ctx.fill();
  });

  state.splatters.forEach(splatter => {
    const age = now - splatter.timestamp;
    ctx.save(); 
    ctx.globalAlpha = Math.max(1.0 - (age / DESIGN.splatterDurationMs), 0);
    
    const splatGrad = ctx.createRadialGradient(splatter.x, splatter.y, 2, splatter.x, splatter.y, DESIGN.splatterRadius);
    splatGrad.addColorStop(0, '#ff3333');
    splatGrad.addColorStop(0.8, '#b30000');
    splatGrad.addColorStop(1, 'rgba(128, 0, 0, 0)');
    
    ctx.fillStyle = splatGrad; 
    ctx.beginPath(); ctx.arc(splatter.x, splatter.y, DESIGN.splatterRadius, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function drawGiantBearPrize() {
  if (!state.gameWon) return;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
  ctx.scale(state.bearScale, state.bearScale);

  drawSoftCircle(-60, -100, 26, '#a66733', '#5e3819');
  drawSoftCircle(-60, -100, 14, '#e6b88a', '#a67c53');
  drawSoftCircle(60, -100, 26, '#a66733', '#5e3819');
  drawSoftCircle(60, -100, 14, '#e6b88a', '#a67c53');

  drawSoftCircle(0, 45, 85, '#b8753d', '#6e411b');
  drawSoftCircle(0, -55, 70, '#b8753d', '#6e411b');

  drawSoftCircle(0, -40, 32, '#ebd0b2', '#b39272');
  drawSoftCircle(0, -52, 12, '#2e190e', '#000000');

  ctx.fillStyle = '#1c100a';
  ctx.beginPath(); ctx.arc(-26, -72, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(26, -72, 8, 0, Math.PI * 2); ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-23, -75, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(29, -75, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#c71c2c';
  ctx.beginPath(); ctx.arc(0, -5, 14, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(-35, 15); ctx.lineTo(-25, -20); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(35, 15); ctx.lineTo(25, -20); ctx.closePath(); ctx.fill();

  ctx.restore();
}

function drawSoftCircle(x, y, r, colorLight, colorDark) {
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  grad.addColorStop(0, colorLight);
  grad.addColorStop(1, colorDark);
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function drawBigPaintballGun() {
  const angle = Math.atan2(state.mouseY - GUN_Y, state.mouseX - GUN_X);

  // Top Yönlendirme ve Çizim
  ctx.save(); 
  ctx.translate(GUN_X, GUN_Y); 
  ctx.rotate(angle + Math.PI / 2);

  const brassGrad = ctx.createLinearGradient(-25, 0, 25, 0);
  brassGrad.addColorStop(0, '#7a5711');
  brassGrad.addColorStop(0.4, '#fce38a');
  brassGrad.addColorStop(0.7, '#d4af37');
  brassGrad.addColorStop(1, '#4a3307');

  ctx.fillStyle = brassGrad;
  ctx.fillRect(-14, -95, 28, 85);

  ctx.fillStyle = '#fff0a8';
  ctx.fillRect(-17, -100, 34, 10);
  ctx.fillRect(-16, -55, 32, 8);

  ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Döner Pirinç Ayaklık (GUN_X, GUN_Y tam ortasında)
  const standGrad = ctx.createLinearGradient(GUN_X - 35, 0, GUN_X + 35, 0);
  standGrad.addColorStop(0, '#5e410b');
  standGrad.addColorStop(0.5, '#d4af37');
  standGrad.addColorStop(1, '#3b2804');
  ctx.fillStyle = standGrad;
  ctx.beginPath(); ctx.arc(GUN_X, GUN_Y + 25, 35, 0, Math.PI, true); ctx.fill();
}

function drawCelebrations() {
  state.particles.forEach(p => {
    ctx.save(); ctx.globalAlpha = Math.max(p.alpha, 0); ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  });
  state.popups.forEach(pop => {
    ctx.save(); 
    ctx.globalAlpha = Math.max(pop.alpha, 0); 
    ctx.font = 'bold 28px "Segoe UI", sans-serif';
    ctx.fillStyle = '#fce38a'; 
    ctx.strokeStyle = '#800a0a'; 
    ctx.lineWidth = 5;
    ctx.textAlign = 'center'; 
    ctx.strokeText(pop.text, pop.x, pop.y); 
    ctx.fillText(pop.text, pop.x, pop.y); 
    ctx.restore();
  });
}

function loop(timestamp) {
  updateRules(timestamp);
  drawCarnivalStage();
  drawTargets();
  drawTemporalShots(timestamp);
  drawCelebrations();
  drawGiantBearPrize();
  drawBigPaintballGun();
  requestAnimationFrame(loop);
}

initTargets();
requestAnimationFrame(loop);