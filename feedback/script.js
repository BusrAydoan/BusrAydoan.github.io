const CONFIG = {
  platformLength: 400,
  ballRadius: 16,
  maxTiltDegrees: 12,
  tiltStepDegrees: 4,
  accelerationScale: 380,
  drag: 0.1,
  initialVelocity: 35
};

const state = {
  x: 0,
  velocity: CONFIG.initialVelocity,
  tilt: 0,
  mode: 'full',
  ended: false,
  fallSide: null,
  lastFrameMs: null
};

const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');

const elements = {
  positionText: document.getElementById('position-text'),
  tiltText: document.getElementById('tilt-text'),
  momentumReadout: document.getElementById('momentum-readout'),
  momentumText: document.getElementById('momentum-text'),
  momentumArrow: document.getElementById('momentum-arrow'),
  status: document.getElementById('attempt-status'),
  acknowledgement: document.getElementById('acknowledgement'),
  liveMessage: document.getElementById('live-message'),
  outcome: document.getElementById('outcome'),
  outcomeTitle: document.getElementById('outcome-title'),
  leftBtn: document.getElementById('tilt-left'),
  levelBtn: document.getElementById('level'),
  rightBtn: document.getElementById('tilt-right'),
  resetBtn: document.getElementById('reset')
};

function init() {
  setupEventListeners();
  resetAttempt('Deneme başladı. Top merkeze yakın.');
  requestAnimationFrame(gameLoop);
}

function setupEventListeners() {
  elements.leftBtn.addEventListener('click', () => applyTilt(-1));
  elements.rightBtn.addEventListener('click', () => applyTilt(1));
  elements.levelBtn.addEventListener('click', levelPlatform);
  elements.resetBtn.addEventListener('click', () => resetAttempt('Deneme sıfırlandı. Yeni deneme başladı.'));

  document.querySelectorAll('input[name="feedback-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.mode = e.target.value;
      resetAttempt(`${state.mode === 'full' ? 'Tam' : 'Sınırlı'} geri bildirim modu seçildi.`);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') applyTilt(-1);
    if (e.key === 'ArrowRight') applyTilt(1);
    if (e.key === ' ' || e.key === 'ArrowDown') levelPlatform();
  });
}

function applyTilt(dir) {
  if (state.ended) return;
  state.tilt = Math.max(-CONFIG.maxTiltDegrees, Math.min(CONFIG.maxTiltDegrees, state.tilt + dir * CONFIG.tiltStepDegrees));
  updateReadouts();
}

function levelPlatform() {
  if (state.ended) return;
  state.tilt = 0;
  updateReadouts();
}

function resetAttempt(msg) {
  state.x = 0;
  state.velocity = CONFIG.initialVelocity;
  state.tilt = 0;
  state.ended = false;
  state.fallSide = null;

  elements.leftBtn.disabled = false;
  elements.rightBtn.disabled = false;
  elements.levelBtn.disabled = false;
  elements.outcome.hidden = true;
  elements.status.textContent = 'Devam ediyor';
  elements.status.classList.remove('ended');
  elements.liveMessage.textContent = msg;

  updateReadouts();
}

function updatePhysics(dt) {
  if (state.ended) return;

  const rad = (state.tilt * Math.PI) / 180;
  const accel = CONFIG.accelerationScale * Math.sin(rad);

  state.velocity += accel * dt;
  state.velocity *= Math.exp(-CONFIG.drag * dt);
  state.x += state.velocity * dt;

  const limit = CONFIG.platformLength / 2 - CONFIG.ballRadius;
  if (Math.abs(state.x) >= limit) {
    state.ended = true;
    state.fallSide = state.x > 0 ? 'sağ' : 'sol';
    state.x = Math.sign(state.x) * limit;
    endAttempt();
  }
}

function endAttempt() {
  elements.leftBtn.disabled = true;
  elements.rightBtn.disabled = true;
  elements.levelBtn.disabled = true;

  elements.status.textContent = 'Top düştü';
  elements.status.classList.add('ended');
  elements.outcomeTitle.textContent = `Top ${state.fallSide} kenardan düştü.`;
  elements.outcome.hidden = false;
  elements.liveMessage.textContent = `Top ${state.fallSide} kenardan düştü. Yeniden başlatmak için Sıfırla düğmesine basın.`;
}

function updateReadouts() {
  const limit = CONFIG.platformLength / 2 - CONFIG.ballRadius;
  const ratio = state.x / limit;

  let posLabel = 'Merkeze Yakın';
  if (ratio <= -0.75) posLabel = 'Sol Kenara Yakın';
  else if (ratio <= -0.25) posLabel = 'Sol Taraf';
  else if (ratio >= 0.75) posLabel = 'Sağ Kenara Yakın';
  else if (ratio >= 0.25) posLabel = 'Sağ Taraf';

  elements.positionText.textContent = posLabel;
  elements.tiltText.textContent = state.tilt === 0 ? 'Düz · 0°' : `${state.tilt > 0 ? 'Sağ' : 'Sol'} · ${Math.abs(state.tilt)}°`;

  const isFull = state.mode === 'full';
  elements.momentumReadout.hidden = !isFull;

  if (isFull) {
    const speed = Math.abs(state.velocity);
    const dir = speed < 1.5 ? 'Hareketsiz' : state.velocity > 0 ? 'Sağ' : 'Sol';
    elements.momentumText.textContent = speed < 1.5 ? 'Hareketsiz · 0 birim/sn' : `${dir} · ${speed.toFixed(1)} birim/sn`;
    elements.momentumArrow.textContent = speed < 1.5 ? '•' : state.velocity > 0 ? '→' : '←';
  }
}

function renderCanvas() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + 20;

  ctx.clearRect(0, 0, width, height);

  // Arka plan ızgarası (Grid)
  ctx.strokeStyle = 'rgba(38, 51, 77, 0.4)';
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Merkez Kesikli Çizgisi
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(centerX, 40);
  ctx.lineTo(centerX, height - 40);
  ctx.stroke();
  ctx.setLineDash([]);

  // Destek Noktası (Fulcrum)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 6);
  ctx.lineTo(centerX - 20, centerY + 45);
  ctx.lineTo(centerX + 20, centerY + 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Platform Dönüşünü Uygula
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((state.tilt * Math.PI) / 180);

  // Platform Çizimi
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-CONFIG.platformLength / 2, -6, CONFIG.platformLength, 12, 6);
  ctx.fill();
  ctx.stroke();

  // Top Çizimi
  const ballY = -6 - CONFIG.ballRadius;
  const ballX = state.x;

  ctx.beginPath();
  ctx.arc(ballX, ballY, CONFIG.ballRadius, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(
    ballX - 4, ballY - 4, 2,
    ballX, ballY, CONFIG.ballRadius
  );
  grad.addColorStop(0, '#00f3ff');
  grad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = grad;
  ctx.shadowColor = '#00f3ff';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

function gameLoop(timestamp) {
  if (state.lastFrameMs !== null) {
    const dt = Math.min((timestamp - state.lastFrameMs) / 1000, 0.05);
    updatePhysics(dt);
    updateReadouts();
  }
  state.lastFrameMs = timestamp;
  renderCanvas();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', init);