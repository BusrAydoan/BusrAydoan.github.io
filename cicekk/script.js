const canvas = document.getElementById('plantCanvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('spirit-cursor');
const dialogue = document.getElementById('dialogue-bubble');
const happinessBar = document.getElementById('happiness-bar');
const heightText = document.getElementById('height-text');
const flowerText = document.getElementById('flower-text');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Durum Değişkenleri
let happiness = 60;
let stemHeight = 70;
let flowerScale = 0; // 0: yok, 0.3-0.5: tomurcuk, 1+: tam çiçek
let mousePos = { x: width / 2, y: height / 2 };
let isMouseFar = false;

// Canlı Dinamikleri (Küçülme, Solma ve Bükülme)
let currentScale = 1.0;
let currentSaturation = 1.0;
let currentDroop = 0;

// Web Audio API (Ses Efektleri)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type = 'sine', duration = 0.15) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Fare Pozisyonu Takibi
document.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Klavye Kontrolleri
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  // S Tuşu: Gübre Verme (Gövdeyi Uzatma)
  if (key === 's') {
    if (stemHeight < 280) {
      stemHeight += 16;
      playTone(180 + stemHeight * 1.5, 'triangle');
      showDialogue('Uzuyorum ve yeni dallar salıyorum! 🌿');
    } else {
      showDialogue('Maksimum boyuma ulaştım! ✨');
    }
  }

  // A Tuşu: Çiçek Açtırma (Tomurcuk Çıkartma)
  if (key === 'a') {
    if (flowerScale === 0) {
      flowerScale = 0.35;
      playTone(523, 'sine');
      showDialogue('Dallarımda pembe tomurcuklar belirdi! 🌸');
    } else {
      showDialogue('Çiçekleri büyütmek için W tuşuna bas! 💕');
    }
  }

  // W Tuşu: Çiçekleri Büyütme
  if (key === 'w') {
    if (flowerScale > 0) {
      if (flowerScale < 1.5) {
        flowerScale += 0.18;
        playTone(500 + flowerScale * 200, 'sine');
        showDialogue('Çiçeklerim büyüyor ve renk saçıyor! 🌺');
      } else {
        showDialogue('Tüm çiçeklerim rengarenk açtı! ✨');
      }
    } else {
      showDialogue('Önce A tuşuna basarak tomurcuk çıkarmalısın! 🌸');
    }
  }

  happiness = Math.min(100, happiness + 4);
  updateUI();
});

// Sekme Değişikliği Tepkisi
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    showDialogue('Nereye gittin?...');
  } else {
    showDialogue('Geri döndün! Çok sevindim! ✨');
  }
});

// Diyalog Balonu Gösterici
let dialogueTimeout;
function showDialogue(text) {
  dialogue.textContent = text;
  dialogue.classList.add('active');
  clearTimeout(dialogueTimeout);
  dialogueTimeout = setTimeout(() => dialogue.classList.remove('active'), 3200);
}

function updateUI() {
  happinessBar.style.width = happiness + '%';
  heightText.textContent = Math.round(stemHeight) + ' px';
  
  if (flowerScale === 0) flowerText.textContent = 'Yok';
  else if (flowerScale < 0.8) flowerText.textContent = 'Tomurcuk';
  else flowerText.textContent = 'Tam Açmış';
}

// Vektörel Yaprak Çizimi
function drawLeaf(ctx, x, y, size, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.5, 0, -size);
  ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, 0, 0);
  
  ctx.fillStyle = `hsl(140, ${60 * currentSaturation}%, ${35 * currentSaturation}%)`;
  ctx.fill();
  ctx.strokeStyle = `hsl(140, ${40 * currentSaturation}%, ${25 * currentSaturation}%)`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// Vektörel Pembe Çiçek Çizimi (5 Taç Yaprak)
function drawFlower(ctx, x, y, scale) {
  if (scale <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  
  const petalCount = 5;
  const radius = 11 * scale;

  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, -radius * 0.6, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(340, ${85 * currentSaturation}%, ${75 * currentSaturation}%)`;
    ctx.fill();
    ctx.restore();
  }

  // Tohum Merkezi
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(45, ${90 * currentSaturation}%, ${60 * currentSaturation}%)`;
  ctx.fill();

  ctx.restore();
}

// Dallar Çizimi
function drawBranch(ctx, startX, startY, length, angle, depth) {
  if (depth <= 0) return;

  const endX = startX + Math.cos(angle) * length;
  const endY = startY + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = `hsl(140, ${50 * currentSaturation}%, ${30 * currentSaturation}%)`;
  ctx.lineWidth = Math.max(2, depth * 2);
  ctx.stroke();

  // Dal Yaprakları
  drawLeaf(ctx, endX, endY, 14, angle + 0.4);
  drawLeaf(ctx, endX, endY, 14, angle - 0.4);

  // Dal Üzeri Çiçek
  if (flowerScale > 0) {
    drawFlower(ctx, endX, endY, flowerScale * 0.85);
  }

  // Alt Dallar
  if (depth > 1) {
    drawBranch(ctx, endX, endY, length * 0.7, angle - 0.4, depth - 1);
    drawBranch(ctx, endX, endY, length * 0.7, angle + 0.4, depth - 1);
  }
}

// Ana Çizim Döngüsü
function animate() {
  ctx.clearRect(0, 0, width, height);

  const potX = width / 2;
  const potY = height - 110;
  
  // Mesafe ve Uzaklaşma Analizi
  const dist = Math.hypot(mousePos.x - potX, mousePos.y - (potY - stemHeight));
  
  if (dist > 220) {
    if (!isMouseFar) {
      isMouseFar = true;
      showDialogue('Lütfen geri gel...');
    }
    // Uzaklaşınca yumuşak şekilde KÜÇÜLÜR, SOLUR ve BÜKÜLÜR
    currentScale = Math.max(0.65, currentScale - 0.015);
    currentSaturation = Math.max(0.2, currentSaturation - 0.02);
    currentDroop = Math.min(35, currentDroop + 0.8);
  } else {
    isMouseFar = false;
    // Yaklaşınca tekrar BÜYÜR, CANLANIR ve DİKLEŞİR
    currentScale = Math.min(1.0, currentScale + 0.02);
    currentSaturation = Math.min(1.0, currentSaturation + 0.03);
    currentDroop = Math.max(0, currentDroop - 1.2);
  }

  // 1. Sabit Saksı Çizimi
  ctx.save();
  // Saksı Ağzı
  ctx.fillStyle = '#d35400';
  ctx.beginPath();
  ctx.roundRect(potX - 55, potY - 14, 110, 18, 5);
  ctx.fill();
  
  // Saksı Gövdesi
  ctx.beginPath();
  ctx.moveTo(potX - 45, potY);
  ctx.lineTo(potX + 45, potY);
  ctx.lineTo(potX + 34, potY + 75);
  ctx.lineTo(potX - 34, potY + 75);
  ctx.closePath();
  ctx.fillStyle = '#e67e22';
  ctx.fill();
  ctx.restore();

  // 2. Küçülen, Boynu Bükülen ve Solan Canlı Bitki
  const lean = (mousePos.x - potX) * 0.06 - currentDroop; // Solduğunda boynu bükülür
  const scaledStemHeight = stemHeight * currentScale; // Boyutu küçülür

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(potX, potY - 8);
  
  const midY = potY - 8 - scaledStemHeight * 0.5;
  const topY = potY - 8 - scaledStemHeight;
  
  ctx.quadraticCurveTo(potX + lean * 0.6, midY, potX + lean, topY);
  ctx.strokeStyle = `hsl(140, ${50 * currentSaturation}%, ${30 * currentSaturation}%)`;
  ctx.lineWidth = Math.max(3, (10 - stemHeight * 0.015) * currentScale);
  ctx.lineCap = 'round';
  ctx.stroke();

  // Düğüm Noktaları (Gövde Üzerindeki Yaprak ve Dallar)
  const nodeCount = Math.floor(scaledStemHeight / 32);
  for (let i = 1; i <= nodeCount; i++) {
    const t = i / (nodeCount + 1);
    const nx = potX + lean * t;
    const ny = potY - 8 - scaledStemHeight * t;
    const side = i % 2 === 0 ? 1 : -1;

    // Gövde Yaprakları
    drawLeaf(ctx, nx, ny, 16 * currentScale, side * 0.7);

    // Dallar (Gövde büyüdükçe çıkar)
    if (i > 1) {
      drawBranch(ctx, nx, ny, 25 * currentScale, side * 0.5 - 1.2, 1);
    }
  }

  // Tepe Çiçeği
  if (flowerScale > 0) {
    drawFlower(ctx, potX + lean, topY, flowerScale * currentScale * 1.3);
  }

  ctx.restore();

  // Zamanla Yavaşça Azalan Mutluluk
  happiness = Math.max(0, happiness - 0.015);
  updateUI();

  requestAnimationFrame(animate);
}

animate();