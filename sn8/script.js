/**
 * DESIGN - Ayarlanabilir Yapılandırma Objesi
 * (Turkish: Tüm grafik, zamanlama ve oyun mekaniği kural parametreleri)
 */
const DESIGN = {
    echoDelayMs: 2000,            // Geçmiş yankının gecikme süresi (ms)
    baseMemoryMs: 2000,           // Başlangıç zamansal gövde hafızası
    memoryPerSeedMs: 500,         // Her yem toplandığında uzayan hafıza süresi
    headRadius: 10,               // Canlı baş noktanın yarıçapı
    bodyRadius: 7,                // Geçmiş kuyruğunun halka yarıçapı
    keyboardSpeed: 14,            // Ok tuşları hareket hızı
    collisionThreshold: 12,       // Kendi geçmiş gövdenle çarpışma eşik mesafesi
    colors: {
        present: "#00f0ff",
        echoStart: "#ff0055",
        echoEnd: "#9900ff",
        food: "#ffaa00"
    }
};

/**
 * STATE - Durum Yönetimi
 */
const state = {
    history: [],                  // [{time, x, y}] Zaman damgalı rota
    livePos: { x: 300, y: 200 },  // Şimdiki zaman konumu (Present)
    simTime: 0,                   // Toplam simülasyon zamanı (ms)
    currentMemoryMs: DESIGN.baseMemoryMs,
    score: 0,
    isPaused: false,
    isGameOver: false,
    food: { x: 150, y: 150, pulse: 0 }
};

// DOM Elemanları
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const stageWrapper = document.getElementById("stageWrapper");
const modeBtn = document.getElementById("modeBtn");
const resetBtn = document.getElementById("resetBtn");
const restartBtn = document.getElementById("restartBtn");
const notice = document.getElementById("notice");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const scoreVal = document.getElementById("scoreVal");
const memoryVal = document.getElementById("memoryVal");

function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    if (state.livePos.x === 300 && state.livePos.y === 200) {
        state.livePos.x = canvas.width / 2;
        state.livePos.y = canvas.height / 2;
        spawnFood();
    }
}
window.addEventListener("resize", resize);

function spawnFood() {
    const margin = 40;
    state.food.x = margin + Math.random() * (canvas.width - margin * 2);
    state.food.y = margin + Math.random() * (canvas.height - margin * 2);
}

/**
 * INPUT - Girdi Dinleyicileri
 */
function setupInputs() {
    stageWrapper.addEventListener("pointermove", (e) => {
        if (state.isGameOver) return;
        const rect = canvas.getBoundingClientRect();
        state.livePos.x = Math.max(10, Math.min(canvas.width - 10, e.clientX - rect.left));
        state.livePos.y = Math.max(10, Math.min(canvas.height - 10, e.clientY - rect.top));
    });

    stageWrapper.addEventListener("keydown", (e) => {
        if (state.isGameOver) return;
        const step = DESIGN.keyboardSpeed;
        if (e.key === "ArrowUp" || e.key === "w") state.livePos.y -= step;
        else if (e.key === "ArrowDown" || e.key === "s") state.livePos.y += step;
        else if (e.key === "ArrowLeft" || e.key === "a") state.livePos.x -= step;
        else if (e.key === "ArrowRight" || e.key === "d") state.livePos.x += step;
        else return;

        state.livePos.x = Math.max(10, Math.min(canvas.width - 10, state.livePos.x));
        state.livePos.y = Math.max(10, Math.min(canvas.height - 10, state.livePos.y));
    });

    modeBtn.addEventListener("click", () => {
        if (DESIGN.echoDelayMs === 2000) {
            DESIGN.echoDelayMs = 0;
            modeBtn.textContent = "Mode: 0ms Immediate";
        } else {
            DESIGN.echoDelayMs = 2000;
            modeBtn.textContent = "Mode: 2000ms Echo";
        }
        resetGame();
    });

    resetBtn.addEventListener("click", resetGame);
    restartBtn.addEventListener("click", resetGame);

    document.addEventListener("visibilitychange", () => {
        state.isPaused = document.hidden;
        if (!document.hidden) lastTime = performance.now();
    });
}

function resetGame() {
    state.history = [];
    state.simTime = 0;
    state.score = 0;
    state.currentMemoryMs = DESIGN.baseMemoryMs;
    state.isGameOver = false;
    gameOverOverlay.classList.add("hidden");
    scoreVal.textContent = "0";
    memoryVal.textContent = (state.currentMemoryMs / 1000).toFixed(1) + "s";
    state.livePos.x = canvas.width / 2;
    state.livePos.y = canvas.height / 2;
    spawnFood();
}

/**
 * RULE - Zaman, Geçmiş ve Çarpışma Kuralları
 */
let lastTime = performance.now();

function update(dt) {
    if (state.isPaused || state.isGameOver) return;

    state.simTime += dt;
    state.food.pulse += dt * 0.005;

    // Rota kaydı
    state.history.push({ time: state.simTime, x: state.livePos.x, y: state.livePos.y });

    // Hafıza sınırı temizliği
    const maxRetention = state.currentMemoryMs + DESIGN.echoDelayMs + 500;
    const cutoff = state.simTime - maxRetention;
    while (state.history.length > 0 && state.history[0].time < cutoff) {
        state.history.shift();
    }

    // Yem Çakışması Kontrolü
    const distToFood = Math.hypot(state.livePos.x - state.food.x, state.livePos.y - state.food.y);
    if (distToFood < DESIGN.headRadius + 12) {
        state.score += 1;
        state.currentMemoryMs += DESIGN.memoryPerSeedMs;
        scoreVal.textContent = state.score.toString();
        memoryVal.textContent = (state.currentMemoryMs / 1000).toFixed(1) + "s";
        spawnFood();
    }

    // Kendi Geçmiş Yankı Gövdenle Çarpışma Kontrolü (Temporal Collision)
    if (state.simTime >= DESIGN.echoDelayMs && DESIGN.echoDelayMs > 0) {
        const startTime = state.simTime - DESIGN.echoDelayMs;
        const endTime = startTime - state.currentMemoryMs;
        const bodySamples = state.history.filter(p => p.time <= startTime && p.time >= endTime);

        // Canlı başın çok yakınındaki gövde parçalarını eliyoruz (kendi kuyruk dibine hemen çarpmasın diye)
        for (let i = 0; i < bodySamples.length - 25; i += 4) {
            const pt = bodySamples[i];
            const dist = Math.hypot(state.livePos.x - pt.x, state.livePos.y - pt.y);
            if (dist < DESIGN.collisionThreshold) {
                state.isGameOver = true;
                gameOverOverlay.classList.remove("hidden");
                break;
            }
        }
    }
}

/**
 * OUTPUT - Render İşlemleri
 */
function draw() {
    ctx.fillStyle = "#03040a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Çizimi (Görsel Zenginlik)
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Yem Çizimi (Glowing Energy Seed)
    const foodGlow = 10 + Math.sin(state.food.pulse) * 4;
    ctx.shadowBlur = foodGlow;
    ctx.shadowColor = DESIGN.colors.food;
    ctx.fillStyle = DESIGN.colors.food;
    ctx.beginPath();
    ctx.arc(state.food.x, state.food.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Zaman Geçmişi / Yılan Gövdesi (ECHO)
    if (state.simTime < DESIGN.echoDelayMs && DESIGN.echoDelayMs > 0) {
        notice.classList.remove("hidden");
    } else {
        notice.classList.add("hidden");

        const startTime = state.simTime - DESIGN.echoDelayMs;
        const endTime = startTime - state.currentMemoryMs;
        const bodySamples = state.history.filter(p => p.time <= startTime && p.time >= endTime);

        if (bodySamples.length > 1) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = DESIGN.colors.echoStart;
            
            for (let i = 0; i < bodySamples.length; i += 3) {
                const pt = bodySamples[i];
                const progress = (i / bodySamples.length);
                
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, DESIGN.bodyRadius * (0.4 + progress * 0.6), 0, Math.PI * 2);
                ctx.fillStyle = progress > 0.5 ? DESIGN.colors.echoStart : DESIGN.colors.echoEnd;
                ctx.globalAlpha = progress * 0.8;
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
        }
    }

    // Canlı Baş Nokta (PRESENT)
    ctx.shadowBlur = 15;
    ctx.shadowColor = DESIGN.colors.present;
    ctx.fillStyle = DESIGN.colors.present;
    ctx.beginPath();
    ctx.arc(state.livePos.x, state.livePos.y, DESIGN.headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function loop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", () => {
    resize();
    setupInputs();
    requestAnimationFrame(loop);
});