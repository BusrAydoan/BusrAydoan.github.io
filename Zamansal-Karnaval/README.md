# Zamansal Karnaval Poligonu

### Premises
- **01 Agency:** The user directly controls the cannon angle via mouse movement and fires paintball shots upon click, dynamically changing the system state and triggering a prize celebration upon 3 hits.
- **04 Temporality:** Interaction happens over time. Paintball projectiles have a fixed 2.0-second delay trajectory, requiring the participant to predict future target positions rather than relying on instant reflexes.

### Description
A nostalgic 3D Disney/Pixar-style carnival shooting gallery that combines instant aiming agency with a 2.0-second flight delay to test temporal anticipation.

---

### How to Use
1. **Aim:** Move your mouse across the screen to direct the brass cannon.
2. **Shoot:** Click anywhere to launch a red paintball projectile toward your target.
3. **Anticipate:** Account for the 2.0-second temporal delay as targets move along the upper and lower tracks.
4. **Win & Reset:** Hit 3 targets to unlock the grand teddy bear prize celebration. Use the "Stantı Sıfırla" button to restart the game.

---

### AI Note
AI tools (Gemini) were used to generate the base HTML5 Canvas rendering loop, CSS layouts, and Web Audio API synthesizer functions. I manually refactored all timing constants and speeds into a centralized `DESIGN` configuration object to ensure full control over mechanics and live-coding readiness.

---

### Credits
- Developed for **NMED 3203 / Interactive Media Applications** (Lab Assignment).
- Concept and theory based on **Agency (01)** and **Temporality (04)** premises from the course framework.
- Built with HTML5 Canvas, CSS, and Web Audio API.