const DESIGN = {
  delayMs: 2000,
  paintColor: '#ff1a1a',
  tentRed: '#d82323',
  tentWhite: '#f5e4c3',
  gold: '#d4af37',
  goldLight: '#f7d046',
  curtainRed: '#b51818',
  bgStripesRed: '#961c1c',
  bgStripesGray: '#4a444a',
  waveDark: '#0e4d64',
  waveLight: '#187b9b',
  woodBg: '#7c5836',
  woodDark: '#523820',
  topTrackSpeed: 1.5,
  bottomTrackSpeed: 2.8,
  targetRadius: 20,
  splatterRadius: 28,
  splatterDurationMs: 3500
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
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.08);
    osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
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
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.12);
    osc.stop(audioCtx.currentTime + idx * 0.12 + 0.4);
  });
}

const state = { 
  shots: [], 
  splatters: [], 
  targets: [], 
  particles: [], 
  popups: [], 
  mouseX: 400, 
  mouseY: 300,
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

function initTargets() {
  state.targets = [];
  for (let i = 0; i < 6; i++) {
    state.targets.push({ x: i * 140 + 40, y: 200, track: 'top', type: i % 2 === 0 ? 'duck' : 'target' });
  }
  for (let i = 0; i < 5; i++) {
    state.targets.push({ x: i * 170 + 70, y: 350, track: 'bottom', type: i % 2 === 0 ? 'target' : 'duck' });
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
  state.shots.push({ startX: canvas.width / 2, startY: canvas.height - 20, targetX, targetY, timestamp: now, triggered: false });
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
  const colors = [DESIGN.goldLight, '#ffffff', DESIGN.tentRed, '#187b9b', '#ff66c4'];
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, color: colors[Math.floor(Math.random() * colors.length)], radius: 3 + Math.random() * 4, alpha: 1.0 });
  }
  const messages = ["TEBRİKLER!", "HARİKA VURUŞ!", "MÜKEMMEL!", "TAM İSABET!"];
  state.popups.push({ x, y: y - 20, text: messages[Math.floor(Math.random() * messages.length)], alpha: 1.0 });
}

function triggerWinCelebration() {
  state.gameWon = true;
  playWinFanfare();

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);
    const colors = [DESIGN.goldLight, '#ffffff', DESIGN.tentRed, '#00ff66', '#ff66c4', '#00c2cb'];
    state.particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 5 - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: 4 + Math.random() * 6,
      alpha: 1.0
    });
  }

  setTimeout(() => {
    restartOverlay.classList.add('active');
  }, 2500);
}

function updateRules(now) {
  state.targets.forEach(target => {
    const speed = target.track === 'top' ? DESIGN.topTrackSpeed : DESIGN.bottomTrackSpeed;
    target.x += speed;
    if (target.x > canvas.width - 60) target.x = 60;
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
        if (Math.sqrt(dx * dx + dy * dy) < DESIGN.targetRadius + 12) {
          hit = true;
          target.x = 60;
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
    state.bearScale += 0.03;
  }

  state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.alpha -= 0.01; });
  state.popups.forEach(pop => { pop.y -= 0.8; pop.alpha -= 0.012; });

  state.shots = state.shots.filter(s => !s.triggered);
  state.splatters = state.splatters.filter(s => now - s.timestamp < DESIGN.splatterDurationMs);
  state.particles = state.particles.filter(p => p.alpha > 0);
  state.popups = state.popups.filter(pop => pop.alpha > 0);
}

function drawCarnivalStage() {
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, numRays = 16, angleStep = Math.PI / numRays;
  ctx.fillStyle = DESIGN.tentWhite;
  ctx.fillRect(0, 0, w, 80);
  for (let i = 0; i < numRays; i += 2) {
    ctx.beginPath(); ctx.moveTo(cx, -100); ctx.arc(cx, -100, 300, i * angleStep, (i + 1) * angleStep); ctx.closePath();
    ctx.fillStyle = DESIGN.tentRed; ctx.fill();
  }
  const stripeW = 20;
  for (let x = 60; x < w - 60; x += stripeW * 2) {
    ctx.fillStyle = DESIGN.bgStripesRed; ctx.fillRect(x, 80, stripeW, 360);
    ctx.fillStyle = DESIGN.bgStripesGray; ctx.fillRect(x + stripeW, 80, stripeW, 360);
  }
  ctx.fillStyle = DESIGN.gold; ctx.fillRect(0, 75, w, 25);
  ctx.fillStyle = DESIGN.goldLight; ctx.fillRect(0, 78, w, 4);
  for (let x = 25; x < w; x += 40) drawStar(x, 87, 5, 6, 3, DESIGN.goldLight);

  ctx.fillStyle = DESIGN.curtainRed;
  ctx.beginPath(); ctx.moveTo(0, 75); ctx.quadraticCurveTo(65, 200, 60, 440); ctx.lineTo(0, 440); ctx.closePath(); ctx.fill();
  ctx.fillStyle = DESIGN.gold; ctx.fillRect(0, 240, 60, 8);

  ctx.fillStyle = DESIGN.curtainRed;
  ctx.beginPath(); ctx.moveTo(w, 75); ctx.quadraticCurveTo(w - 65, 200, w - 60, 440); ctx.lineTo(w, 440); ctx.closePath(); ctx.fill();
  ctx.fillStyle = DESIGN.gold; ctx.fillRect(w - 60, 240, 60, 8);

  drawShelfAndWaves(150, 240);
  drawShelfAndWaves(300, 390);

  ctx.fillStyle = DESIGN.woodBg; ctx.fillRect(0, 440, w, h - 440);
  ctx.strokeStyle = DESIGN.woodDark; ctx.lineWidth = 2;
  for (let x = 40; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 465); ctx.lineTo(x, h); ctx.stroke(); }
  ctx.fillStyle = DESIGN.gold; ctx.fillRect(0, 440, w, 25);
  ctx.fillStyle = DESIGN.goldLight; ctx.fillRect(0, 443, w, 4);
  for (let x = 25; x < w; x += 45) drawStar(x, 452, 5, 6, 3, DESIGN.goldLight);

  drawScoreBoard();
}

function drawScoreBoard() {
  ctx.save();
  ctx.translate(130, 42);
  ctx.fillStyle = DESIGN.woodDark;
  ctx.fillRect(-65, -22, 130, 44);
  ctx.strokeStyle = DESIGN.goldLight;
  ctx.lineWidth = 3;
  ctx.strokeRect(-65, -22, 130, 44);

  ctx.font = 'bold 13px "Segoe UI", sans-serif';
  ctx.fillStyle = DESIGN.goldLight;
  ctx.textAlign = 'center';
  ctx.fillText("SKOR TABELASI", 0, -5);

  ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${state.score} / 3 HEDEF`, 0, 14);
  ctx.restore();
}

function drawShelfAndWaves(shelfY, waveY) {
  const w = canvas.width;
  ctx.fillStyle = DESIGN.woodBg; ctx.fillRect(60, shelfY, w - 120, 18);
  ctx.fillStyle = DESIGN.woodDark; ctx.fillRect(60, shelfY + 18, w - 120, 6);
  ctx.fillStyle = DESIGN.waveDark;
  ctx.beginPath(); ctx.moveTo(60, waveY);
  for (let x = 60; x <= w - 60; x += 40) {
    ctx.quadraticCurveTo(x + 10, waveY - 18, x + 20, waveY);
    ctx.quadraticCurveTo(x + 30, waveY + 12, x + 40, waveY);
  }
  ctx.lineTo(w - 60, waveY + 30); ctx.lineTo(60, waveY + 30); ctx.closePath(); ctx.fill();

  ctx.fillStyle = DESIGN.waveLight;
  ctx.beginPath(); ctx.moveTo(60, waveY + 8);
  for (let x = 60; x <= w - 60; x += 40) {
    ctx.quadraticCurveTo(x + 10, waveY - 10, x + 20, waveY + 8);
    ctx.quadraticCurveTo(x + 30, waveY + 18, x + 40, waveY + 8);
  }
  ctx.lineTo(w - 60, waveY + 30); ctx.lineTo(60, waveY + 30); ctx.closePath(); ctx.fill();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3, x = cx, y = cy, step = Math.PI / spikes;
  ctx.beginPath(); ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius; ctx.lineTo(x, y); rot += step;
    x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius; ctx.lineTo(x, y); rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}

function drawTargets() {
  state.targets.forEach(target => {
    ctx.save(); ctx.translate(target.x, target.y);
    ctx.fillStyle = DESIGN.woodBg; ctx.fillRect(-4, 0, 8, 35);
    if (target.type === 'duck') {
      ctx.fillStyle = DESIGN.goldLight;
      ctx.beginPath(); ctx.ellipse(-2, -5, 18, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(10, -16, 9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, -14, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = DESIGN.tentRed; ctx.beginPath(); ctx.arc(0, -10, DESIGN.targetRadius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, -10, DESIGN.targetRadius * 0.65, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = DESIGN.tentRed; ctx.beginPath(); ctx.arc(0, -10, DESIGN.targetRadius * 0.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });
}

function drawTemporalShots(now) {
  state.shots.forEach(shot => {
    const elapsed = now - shot.timestamp;
    const progress = Math.min(elapsed / DESIGN.delayMs, 1.0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(shot.targetX, shot.targetY, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = DESIGN.paintColor; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(shot.targetX, shot.targetY, 20, -Math.PI / 2, (-Math.PI / 2) + (progress * Math.PI * 2)); ctx.stroke();

    const currentX = shot.startX + (shot.targetX - shot.startX) * progress;
    const currentY = shot.startY + (shot.targetY - shot.startY) * progress;
    ctx.fillStyle = DESIGN.paintColor; ctx.beginPath(); ctx.arc(currentX, currentY, 9, 0, Math.PI * 2); ctx.fill();
  });

  state.splatters.forEach(splatter => {
    const age = now - splatter.timestamp;
    ctx.save(); ctx.globalAlpha = Math.max(1.0 - (age / DESIGN.splatterDurationMs), 0);
    ctx.fillStyle = DESIGN.paintColor; ctx.beginPath(); ctx.arc(splatter.x, splatter.y, DESIGN.splatterRadius, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function drawGiantBearPrize() {
  if (!state.gameWon) return;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 - 30);
  ctx.scale(state.bearScale, state.bearScale);

  ctx.fillStyle = '#c28544';
  ctx.beginPath(); ctx.arc(0, 40, 75, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -50, 60, 0, Math.PI * 2); ctx.fill();

  ctx.beginPath(); ctx.arc(-50, -90, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(50, -90, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e6c280';
  ctx.beginPath(); ctx.arc(-50, -90, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(50, -90, 12, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#e6c280';
  ctx.beginPath(); ctx.arc(0, -35, 28, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3d2314';
  ctx.beginPath(); ctx.arc(0, -48, 10, 0, Math.PI * 2); ctx.fill();

  ctx.beginPath(); ctx.arc(-22, -65, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(22, -65, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-20, -67, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(24, -67, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = DESIGN.tentRed;
  ctx.beginPath(); ctx.arc(0, -2, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-12, 10, 24, 45);

  ctx.fillStyle = DESIGN.goldLight;
  ctx.font = 'bold 32px "Segoe UI", sans-serif';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 5;
  ctx.textAlign = 'center';
  ctx.strokeText("TEBRİKLER KAZANDIN!", 0, -130);
  ctx.fillText("TEBRİKLER KAZANDIN!", 0, -130);

  ctx.restore();
}

function drawBigPaintballGun() {
  const gunX = canvas.width / 2, gunY = canvas.height - 15;
  const angle = Math.atan2(state.mouseY - gunY, state.mouseX - gunX);
  ctx.save(); ctx.translate(gunX, gunY); ctx.rotate(angle + Math.PI / 2);
  ctx.fillStyle = DESIGN.gold; ctx.fillRect(-18, 15, 36, 40);
  ctx.fillStyle = DESIGN.tentRed; ctx.fillRect(-20, -25, 40, 45);
  ctx.fillStyle = DESIGN.goldLight; ctx.fillRect(-22, -10, 44, 8);
  ctx.fillStyle = '#222222'; ctx.fillRect(-10, -85, 20, 60);
  ctx.fillStyle = DESIGN.goldLight; ctx.fillRect(-13, -90, 26, 8);
  ctx.restore();
  ctx.fillStyle = DESIGN.woodDark; ctx.beginPath(); ctx.arc(gunX, gunY + 20, 45, 0, Math.PI, true); ctx.fill();
}

function drawCelebrations() {
  state.particles.forEach(p => {
    ctx.save(); ctx.globalAlpha = Math.max(p.alpha, 0); ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  });
  state.popups.forEach(pop => {
    ctx.save(); ctx.globalAlpha = Math.max(pop.alpha, 0); ctx.font = 'bold 26px "Segoe UI", sans-serif';
    ctx.fillStyle = DESIGN.goldLight; ctx.strokeStyle = DESIGN.tentRed; ctx.lineWidth = 4;
    ctx.textAlign = 'center'; ctx.strokeText(pop.text, pop.x, pop.y); ctx.fillText(pop.text, pop.x, pop.y); ctx.restore();
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