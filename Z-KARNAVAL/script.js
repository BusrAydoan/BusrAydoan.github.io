// Kanvas koordinat dönüştürücü fonksiyonu
function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// Fare Hareketi
canvas.addEventListener('mousemove', (e) => {
  const coords = getCanvasCoordinates(e);
  state.mouseX = coords.x;
  state.mouseY = coords.y;
});

// Fare Tıklaması
canvas.addEventListener('click', (e) => {
  const coords = getCanvasCoordinates(e);
  handleShoot(coords.x, coords.y);
});

// Dokunmatik Ekran Desteği (Mobil / Tablet)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Sayfanın aşağı/yukarı kaymasını engeller
  const coords = getCanvasCoordinates(e);
  state.mouseX = coords.x;
  state.mouseY = coords.y;
  handleShoot(coords.x, coords.y);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const coords = getCanvasCoordinates(e);
  state.mouseX = coords.x;
  state.mouseY = coords.y;
}, { passive: false });