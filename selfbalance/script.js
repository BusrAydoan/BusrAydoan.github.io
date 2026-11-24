/**
 * DESIGN: Yapılandırma ve Ayarlar
 * - gravity: Yerçekimi kuvveti sabiti.
 * - tiltSensitivity: Blok ağırlığının platform eğimine etkisi.
 * - maxTiltAngle: Platformun devrilme eşiği (radyan cinsinden sınır).
 * - dropCooldownMs: Ard arda blok bırakma arasındaki minimum milisaniye.
 */
const DESIGN = {
    gravity: 0.4,
    tiltSensitivity: 0.00015,
    maxTiltAngle: 0.45, 
    blockWidth: 60,
    blockHeight: 30,
    platformWidth: 320,
    platformHeight: 20,
    dropCooldownMs: 400,
    colors: {
        platform: "#e4e4e7",
        pivot: "#71717a",
        blockPrimary: "#6366f1",
        blockSecondary: "#818cf8",
        danger: "#ef4444",
        cursorLine: "rgba(255, 255, 255, 0.3)"
    }
};

/**
 * STATE: Oyun ve Sistem Durumu
 */
let state = {
    blocks: [],          // Sahnedeki yerleşik bloklar listesi
    fallingBlock: null,  // Şu an düşmekte olan blok
    cursorX: 400,        // Bırakma imlecinin X koordinatı
    platformAngle: 0,    // Platformun mevcut eğim açısı
    angularVelocity: 0,  // Eğim açısal hızı
    score: 0,            // Başarıyla üst üste konulan blok sayısı
    status: 'playing',   // 'playing', 'paused', 'gameover'
    lastDropTime: 0      // Son bırakma zamanı (Cooldown kontrolü için)
};

// Canvas element referansları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const statusDisplay = document.getElementById('statusDisplay');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

/**
 * INPUT: Girdi Yönetimi (Fare, Dokunmatik ve Klavye)
 */
function initInput() {
    canvas.addEventListener('mousemove', (e) => {
        if (state.status !== 'playing') return;
        const rect = canvas.getBoundingClientRect();
        state.cursorX = e.clientX - rect.left;
    });

    canvas.addEventListener('click', () => {
        if (state.status === 'playing') {
            tryDropBlock();
        }
    });

    // Erişilebilirlik için Klavye Desteği
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (state.status === 'playing') state.cursorX = Math.max(40, state.cursorX - 20);
        } else if (e.key === 'ArrowRight') {
            if (state.status === 'playing') state.cursorX = Math.min(canvas.width - 40, state.cursorX + 20);
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (state.status === 'playing') tryDropBlock();
        } else if (e.key === 'Escape') {
            // Girdi iptal etme kuralı
            state.fallingBlock = null;
        } else if (e.key === 'p' || e.key === 'P') {
            togglePause();
        } else if (e.key === 'r' || e.key === 'R') {
            resetGame();
        }
    });

    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);
}

/**
 * Kural / Fizik Mantığı (RULE)
 */
function tryDropBlock() {
    const now = performance.now();
    if (now - state.lastDropTime < DESIGN.dropCooldownMs) return; // Cooldown kontrolü
    if (state.fallingBlock !== null) return; // Zaten düşen bir blok varsa yeni bırakma

    state.lastDropTime = now;
    
    // Düşen bloğu başlat
    state.fallingBlock = {
        x: state.cursorX,
        y: 50,
        vx: 0,
        vy: 0,
        width: DESIGN.blockWidth,
        height: DESIGN.blockHeight,
        mass: 1
    };
}

function updateRules() {
    if (state.status !== 'playing') return;

    // 1. Düşen bloğun hareketi
    if (state.fallingBlock !== null) {
        state.fallingBlock.vy += DESIGN.gravity;
        state.fallingBlock.y += state.fallingBlock.vy;

        // Platform çarpışma kontrolü
        const pivotX = canvas.width / 2;
        const pivotY = 420;
        
        // Platform yüzey koordinatları hesaplama (açıya bağlı)
        const platformLeftX = pivotX - DESIGN.platformWidth / 2;
        const platformRightX = pivotX + DESIGN.platformWidth / 2;
        
        // Blok platform çizgisine ulaştı mı?
        if (state.fallingBlock.y + state.fallingBlock.height >= pivotY) {
            // Bloğu yığına (blocks dizisine) ekle
            state.blocks.push({
                x: state.fallingBlock.x - DESIGN.blockWidth / 2,
                y: pivotY - DESIGN.blockHeight,
                width: DESIGN.blockWidth,
                height: DESIGN.blockHeight,
                mass: 1,
                offsetX: state.fallingBlock.x - pivotX // Denge için merkezden uzaklık
            });

            state.fallingBlock = null;
            state.score++;
            updateHUD();
        }
    }

    // 2. Tork (Denge) Hesaplama ve Platform Fizikleri
    let totalTorque = 0;
    state.blocks.forEach(block => {
        totalTorque += block.offsetX * block.mass;
    });

    // Açısal hız ve ivme güncellemesi
    const targetAngle = totalTorque * DESIGN.tiltSensitivity;
    state.platformAngle += (targetAngle - state.platformAngle) * 0.1;

    // 3. Devrilme / Sınır Kontrolü
    if (Math.abs(state.platformAngle) > DESIGN.maxTiltAngle) {
        state.status = 'gameover';
        updateHUD();
    }
}

/**
 * Çıktı / Render (OUTPUT)
 */
function renderOutput() {
    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pivotX = canvas.width / 2;
    const pivotY = 420;

    // A. İmlek / Bırakma Hattı (Renk dışı sinyal: Kesikli çizgi)
    if (state.status === 'playing') {
        ctx.strokeStyle = DESIGN.colors.cursorLine;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(state.cursorX, 0);
        ctx.lineTo(state.cursorX, pivotY);
        ctx.stroke();
        ctx.setLineDash([]); // Sıfırla
    }

    // B. Platform Çizimi
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(state.platformAngle);

    ctx.fillStyle = DESIGN.colors.platform;
    ctx.fillRect(-DESIGN.platformWidth / 2, -DESIGN.platformHeight / 2, DESIGN.platformWidth, DESIGN.platformHeight);
    
    // C. Yığılmış Bloklar
    state.blocks.forEach((block, index) => {
        ctx.fillStyle = index % 2 === 0 ? DESIGN.colors.blockPrimary : DESIGN.colors.blockSecondary;
        // Platform yerel koordinatlarına göre çizim
        ctx.fillRect(block.x - (pivotX - DESIGN.platformWidth / 2), -DESIGN.platformHeight - DESIGN.blockHeight, block.width, block.height);
        
        // Şekil / Desen çizgisi (Sadece renge güvenmemek için)
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(block.x - (pivotX - DESIGN.platformWidth / 2), -DESIGN.platformHeight - DESIGN.blockHeight, block.width, block.height);
    });

    ctx.restore();

    // D. Pivot Desteği (Üçgen Ayak)
    ctx.fillStyle = DESIGN.colors.pivot;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY + 10);
    ctx.lineTo(pivotX - 20, pivotY + 60);
    ctx.lineTo(pivotX + 20, pivotY + 60);
    ctx.closePath();
    ctx.fill();

    // E. Düşmekte Olan Blok
    if (state.fallingBlock !== null) {
        ctx.fillStyle = DESIGN.colors.blockPrimary;
        ctx.fillRect(state.fallingBlock.x - state.fallingBlock.width / 2, state.fallingBlock.y, state.fallingBlock.width, state.fallingBlock.height);
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(state.fallingBlock.x - state.fallingBlock.width / 2, state.fallingBlock.y, state.fallingBlock.width, state.fallingBlock.height);
    }

    // F. Oyun Bitti / Duraklatıldı Mesajları
    if (state.status === 'gameover') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = DESIGN.colors.danger;
        ctx.font = "bold 32px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("SYSTEM COLLAPSED", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = "#f4f4f6";
        ctx.font = "16px system-ui";
        ctx.fillText("Press 'R' or click Reset to try again.", canvas.width / 2, canvas.height / 2 + 20);
    } else if (state.status === 'paused') {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#f4f4f6";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    }
}

function updateHUD() {
    scoreDisplay.textContent = `Blocks Stacked: ${state.score}`;
    if (state.status === 'gameover') {
        statusDisplay.textContent = "Status: Collapsed (Unbalanced)";
        statusDisplay.style.color = DESIGN.colors.danger;
    } else if (state.status === 'paused') {
        statusDisplay.textContent = "Status: Paused";
        statusDisplay.style.color = "#a0a0ab";
    } else {
        statusDisplay.textContent = "Status: Active";
        statusDisplay.style.color = "#22c55e";
    }
}

function togglePause() {
    if (state.status === 'playing') {
        state.status = 'paused';
    } else if (state.status === 'paused') {
        state.status = 'playing';
    }
    updateHUD();
}

function resetGame() {
    state.blocks = [];
    state.fallingBlock = null;
    state.platformAngle = 0;
    state.angularVelocity = 0;
    state.score = 0;
    state.status = 'playing';
    updateHUD();
}

// Oyun Döngüsü (Main Loop)
function gameLoop() {
    updateRules();
    renderOutput();
    requestAnimationFrame(gameLoop);
}

// Başlangıç Kurulumu
initInput();
updateHUD();
gameLoop();