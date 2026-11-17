/* THE LAST 30 SECONDS
   Interactive Media Applications lab. assets are adapted from the supplied C2 island plan
   and character recipes. Canvas rendering keeps this version dependency-free.
*/

/* ========================= DESIGN ========================= */
const DESIGN = {
  // Live-change settings: keep the rules here, not scattered through the code.
  loopSeconds: 30,
  maxEchoes: 3,
  rules: {
    mechanism: "hold",          // active only while the player or an Echo remains on it
    echoOverflow: "oldest",     // remove the oldest Echo when a fourth is recorded
    incompleteLoop: "continue", // an unfinished 30-second attempt still becomes an Echo
    islandEffect: "static",     // the island layout never changes
    ending: "lighthouse"        // all three mechanisms held at once awaken the lighthouse
  },
  sampleInterval: 0.05,
  moveSpeed: 4.15,
  playerRadius: 0.34,
  plateRadius: 0.92,
  stagePadding: 34,
  mapBounds: { minX: -16.5, maxX: 16.5, minZ: -13.2, maxZ: 13.2 },
  colors: {
    ocean: "#9abfc0",
    oceanDeep: "#729fa5",
    islandEdge: "#243b39",
    grass: "#d5d5a8",
    grassLight: "#e7e0b7",
    ink: "#263735",
    paper: "#f8f1dd",
    road: "#bcae8b",
    path: "#c7bd9f",
    coral: "#d97865",
    gold: "#e5b95d",
    blue: "#6f9ca5",
    green: "#718b68",
    echo1: "#d97865",
    echo2: "#547f8a",
    echo3: "#9b7eaa",
    player: "#283a3a",
    lighthouse: "#e8c46c"
  },
  world: {"name":"C2 · Open Cove","coast":[[-14,5],[-15.2,-1.6],[-12.4,-8],[-5,-11.2],[3,-11.4],[10,-8.4],[14.4,-3],[14.8,3.4],[13,9.6],[9.6,11],[7.4,8.2],[5.6,4.2],[2.6,2.2],[-1.4,2.2],[-4.6,3.4],[-6.4,7.2],[-8.4,11],[-12,9.6]],"zones":[{"kind":"forest","name":"Northeast Forest","poly":[[3,-10.4],[9.6,-8],[12.4,-3.4],[9,-1.6],[4.4,-4.6]],"trees":58},{"kind":"village","name":"West Arm Village","poly":[[-13.4,0.6],[-9,-0.8],[-5.6,2.6],[-6.6,6.6],[-8.4,9.6],[-12.4,8]]},{"kind":"garden","name":"East Gardens","poly":[[5,-2.4],[11,-0.6],[12.4,3.6],[8.4,5],[5.6,2.4]]},{"kind":"sand","name":"Cove Beach","poly":[[-5.2,3],[-2,2.6],[-1.8,4.6],[-4.6,5.8]]}],"paths":[{"kind":"road","pts":[[-9.4,2.4],[-6.6,1.2],[-3.4,0.4],[0,-0.2],[3.6,0.6],[7,2.8],[9.8,5.4],[11.6,7.8]]},{"kind":"path","pts":[[-9.4,2.4],[-8.4,5.6]]},{"kind":"path","pts":[[-9.4,2.4],[-11.6,0.2]]},{"kind":"path","pts":[[-3.4,0.4],[-4,3]]},{"kind":"path","pts":[[3.6,0.6],[3.2,2.6]]},{"kind":"path","pts":[[0,-0.2],[0,-4],[0,-7]]},{"kind":"path","pts":[[3.6,0.6],[6.4,-2.6],[7.4,-5.6]]},{"kind":"path","pts":[[7,2.8],[8.6,1.2]]}],"places":{"hub":{"at":[11.6,7.8]},"01":{"at":[-8.2,7.6],"rot":-0.8},"02":{"at":[7.4,-6],"rot":0.5},"03":{"at":[-12.6,-1.6],"rot":1.3},"04":{"at":[3,4.8],"rot":-0.25,"water":true},"05":{"at":[-4.2,4.6],"rot":0.5},"06":{"at":[0,-7.4],"rot":0},"07":{"at":[-9.4,2.4],"rot":0.7},"08":{"at":[8.8,0.6],"rot":-1.2}},"items":[{"kind":"house","at":[-13.2,3],"rot":0.4,"v":0},{"kind":"house","at":[-12.4,6.2],"rot":1.2,"v":1},{"kind":"house","at":[-6.2,-0.8],"rot":0.2,"v":2},{"kind":"house","at":[-6.4,4.6],"rot":-0.6,"v":3},{"kind":"house","at":[-11,8.6],"rot":0.9,"v":4},{"kind":"house","at":[-4.8,1.2],"rot":0.1,"v":5},{"kind":"house","at":[-14,-4],"rot":1.4,"v":6},{"kind":"house","at":[3.8,-1.8],"rot":0.3,"v":7},{"kind":"house","at":[11,3.4],"rot":-1.1,"v":8},{"kind":"house","at":[-8.8,-3.4],"rot":0.6,"v":9},{"kind":"house","at":[-10.6,-1.8],"rot":0.2,"v":10},{"kind":"tree","at":[10.901,-3.389],"rot":3.244,"h":1.251,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[8.022,-2.561],"rot":3.526,"h":1.668,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[6.68,-9.339],"rot":4.051,"h":1.666,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.025,-2.836],"rot":4.22,"h":1.963,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[3.447,-8.403],"rot":2.514,"h":1.864,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.007,-9.423],"rot":4.984,"h":1.238,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[5.336,-8.184],"rot":3.461,"h":1.611,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.239,-6.725],"rot":3.255,"h":1.896,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.797,-8.241],"rot":3.209,"h":1.661,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.419,-9.336],"rot":4.213,"h":1.443,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[12.083,-4.026],"rot":1.834,"h":1.244,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[5.048,-4.068],"rot":1.888,"h":1.585,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.166,-8.567],"rot":0.258,"h":1.692,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[3.441,-6.951],"rot":3.497,"h":1.271,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.021,-8.347],"rot":5.694,"h":1.609,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.093,-6.972],"rot":0.428,"h":1.585,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[4.779,-9.62],"rot":1.971,"h":1.757,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[4.943,-10.007],"rot":1.265,"h":1.71,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[11.837,-4.353],"rot":3.955,"h":1.877,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.94,-2.843],"rot":0.119,"h":1.356,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[9.617,-2.134],"rot":5.51,"h":1.903,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.503,-2.455],"rot":0.996,"h":1.633,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.954,-7.721],"rot":3.497,"h":1.515,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[9.067,-3.191],"rot":4.495,"h":1.798,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[11.897,-4.139],"rot":3.668,"h":1.387,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.136,-7.25],"rot":3.417,"h":1.583,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.213,-9.721],"rot":4.216,"h":1.747,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.521,-9.54],"rot":4.972,"h":1.765,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.715,-7.598],"rot":1.154,"h":1.364,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.413,-7.186],"rot":4.741,"h":2.074,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.774,-5.943],"rot":4.61,"h":1.953,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.71,-6.344],"rot":5.912,"h":1.707,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[9.959,-7.556],"rot":2.976,"h":1.457,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[5.164,-9.964],"rot":4.964,"h":1.949,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[6.507,-2.961],"rot":1.525,"h":1.388,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[9.121,-2.196],"rot":2.949,"h":1.456,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.596,-7.403],"rot":2.253,"h":1.919,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[11.442,-3.549],"rot":4.894,"h":1.97,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.195,-7.327],"rot":0.647,"h":1.48,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[11.832,-3.236],"rot":4.014,"h":1.323,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.688,-9.986],"rot":1.935,"h":1.342,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[9.994,-2.114],"rot":0.296,"h":1.381,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.189,-3.007],"rot":1.036,"h":1.731,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.713,-3.164],"rot":4.662,"h":1.722,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.413,-5.485],"rot":0.496,"h":1.694,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[5.904,-9.249],"rot":1.486,"h":1.559,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[5.386,-8.599],"rot":5.583,"h":1.94,"cone":false,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[10.584,-4.421],"rot":3.375,"h":1.633,"cone":false,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[4.544,-7.449],"rot":1.293,"h":1.562,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[3.819,-9.838],"rot":3.53,"h":1.649,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[11.093,-4.986],"rot":0.567,"h":2.028,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.672,-1.819],"rot":4.295,"h":1.291,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.914,-9.296],"rot":1.83,"h":1.408,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.587,-8.08],"rot":4.956,"h":1.598,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[3.905,-9.516],"rot":3.564,"h":1.675,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[7.467,-2.349],"rot":2.006,"h":1.5,"cone":true,"pat":["fur",["ink","paper"]]},{"kind":"tree","at":[4.608,-9.566],"rot":4.729,"h":2.053,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[10.676,-2.557],"rot":5.395,"h":1.4,"cone":true,"pat":["diag",["green","ink"]]},{"kind":"tree","at":[-3.299,-9.891],"rot":0,"h":0.921,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-14.745,-0.808],"rot":0,"h":1.256,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-4.508,-6.671],"rot":0,"h":1.271,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-11.587,-4.63],"rot":0,"h":1.32,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[9.686,5.582],"rot":0,"h":1.324,"cone":false,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-2.583,-2.861],"rot":0,"h":1.568,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[10.184,-2.098],"rot":0,"h":1.221,"cone":true,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[8.488,5.655],"rot":0,"h":0.948,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[13.293,3.768],"rot":0,"h":1.473,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-1.325,0.624],"rot":0,"h":1.512,"cone":false,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[12.351,-1.801],"rot":0,"h":1.424,"cone":true,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-9.989,-5.906],"rot":0,"h":1.48,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-4.383,-4.461],"rot":0,"h":1.192,"cone":true,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[1.275,-2.221],"rot":0,"h":1.277,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[0.253,-3.721],"rot":0,"h":1.006,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-12.553,-5.739],"rot":0,"h":1.351,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[6.433,2.555],"rot":0,"h":1.419,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-5.153,-7.62],"rot":0,"h":1.378,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[4.698,-8.313],"rot":0,"h":1.562,"cone":false,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-3.126,-0.166],"rot":0,"h":1.382,"cone":false,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-2.02,-10.065],"rot":0,"h":1.325,"cone":true,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-9.197,-0.967],"rot":0,"h":1.058,"cone":true,"pat":["dots",["green","paper"]]},{"kind":"tree","at":[-12.119,-4.117],"rot":0,"h":1.041,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-10.916,-6.027],"rot":0,"h":1.271,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[-0.58,-4.264],"rot":0,"h":1.014,"cone":false,"pat":["stripe",["green","ink"]]},{"kind":"tree","at":[2.903,-2.739],"rot":0,"h":0.956,"cone":true,"pat":["stripe",["green","ink"]]},{"kind":"boat","at":[2.6,6.4],"rot":0.2},{"kind":"boat","at":[-1.8,7.4],"rot":-0.5},{"kind":"boat","at":[4.6,8.6],"rot":0.7},{"kind":"rock","at":[9.8,10.8],"s":0.5},{"kind":"rock","at":[-8.2,11],"s":0.65},{"kind":"rock","at":[-15,-4],"s":0.8},{"kind":"rock","at":[14.4,-4],"s":0.5},{"kind":"rock","at":[-2.6,-10.8],"s":0.65},{"kind":"lamp","at":[-2.1,-0.633]},{"kind":"lamp","at":[1.022,0.593]},{"kind":"lamp","at":[4.345,0.176]},{"kind":"lamp","at":[6.182,3.054]},{"kind":"lamp","at":[9.51,4.09]},{"kind":"lamp","at":[-0.45,-2.188]}]},
  characters: {"char.bee":{"name":"Bee","role":"islander · counts the greenhouse flowers","motion":"floaty","body":{"shape":"barrel","paint":{"pattern":"stripe","colors":["warm","ink"]}},"head":{"shape":"ball","paint":{"color":"ink"}},"face":{"eyes":"ring","brows":false,"mouth":false}},"char.mushroom":{"name":"Mushroom","role":"islander · comes out after the rain","motion":"sleepy","body":{"shape":"barrel","paint":{"color":"paper"}},"head":{"shape":"acorn","paint":{"color":"paper"}},"face":{"eyes":"sleepy","cheeks":true,"mouth":"o"}},"char.towner.a":{"name":"Towner · Pink","role":"07 · the crowd of the square","motion":"bouncy","body":{"shape":"hourglass","paint":{"color":"pink"}},"head":{"shape":"cat","paint":{"color":"paper"}},"face":{"eyes":"ring","mask":true,"brows":false,"mouth":false}},"char.towner.c":{"name":"Towner · Rabbit","role":"07 · the crowd of the square","motion":"jittery","body":{"shape":"bell","paint":{"pattern":"checker","colors":["paper","green"]}},"head":{"shape":"ball","paint":{"color":"paper"}},"face":{"eyes":"dot","cheeks":true,"mouth":"smile"}}},
  plates: [
    { id: 1, name: "Village Plate", place: "03", x: -12.6, z: -1.6, hint: "West Arm Village" },
    { id: 2, name: "North Plate", place: "06", x: 0, z: -7.4, hint: "North Ridge" },
    { id: 3, name: "Garden Plate", place: "08", x: 8.8, z: 0.6, hint: "East Gardens" }
  ],
  lighthouse: { x: 11.6, z: 7.8 },
  start: { x: -9.4, z: 2.4 },
  reducedMotionTrail: true
};

/* ========================= STATE ========================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const state = {
  running: false,
  won: false,
  elapsed: 0,
  totalElapsed: 0,
  lastFrame: null,
  sampleAccumulator: 0,
  player: { x: DESIGN.start.x, z: DESIGN.start.z },
  moveTarget: null,
  keys: new Set(),
  padKeys: new Set(),
  pointerId: null,
  recording: [],
  echoes: [],
  platesActive: [false, false, false],
  cycle: 1,
  pausedByVisibility: false,
  notice: "Reach a numbered plate and stay there. Your path becomes an Echo."
};

const ui = {
  cycle: document.getElementById("cycle-number"),
  time: document.getElementById("time-left"),
  timerFill: document.getElementById("timer-fill"),
  echoCount: document.getElementById("echo-count"),
  echoList: document.getElementById("echo-list"),
  plateList: document.getElementById("plate-list"),
  notice: document.getElementById("notice"),
  start: document.getElementById("start-button"),
  reset: document.getElementById("reset-button"),
  win: document.getElementById("win-panel"),
  mode: document.getElementById("mode-label")
};

/* ========================= INPUT ========================= */
function setKey(key, pressed) {
  const normalized = key.toLowerCase();
  const allowed = ["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"];
  if (!allowed.includes(normalized)) return;
  if (pressed) {
    state.keys.add(normalized);
    state.moveTarget = null;
  } else {
    state.keys.delete(normalized);
  }
}
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"," "].includes(key)) event.preventDefault();
  if (event.repeat) return;
  if (key === " " && !state.running && !state.won) startGame();
  setKey(key, true);
});
window.addEventListener("keyup", (event) => setKey(event.key, false));

function clearHeldInputs() {
  state.keys.clear();
  state.padKeys.clear();
  state.moveTarget = null;
  state.pointerId = null;
}
window.addEventListener("blur", clearHeldInputs);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    state.pausedByVisibility = true;
    state.lastFrame = null;
    clearHeldInputs();
  } else {
    state.pausedByVisibility = false;
    state.lastFrame = null;
  }
});

function bindPadButton(button, key) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    state.padKeys.add(key);
  });
  const release = (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    state.padKeys.delete(key);
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", () => state.padKeys.delete(key));
}
document.querySelectorAll("[data-pad]").forEach((button) => bindPadButton(button, button.dataset.pad));

function screenToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const px = (clientX - rect.left) * canvas.width / rect.width;
  const py = (clientY - rect.top) * canvas.height / rect.height;
  const transform = getMapTransform();
  return {
    x: (px - transform.ox) / transform.scale + DESIGN.mapBounds.minX,
    z: (transform.oy - py) / transform.scale + DESIGN.mapBounds.minZ
  };
}
canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 && event.pointerType === "mouse") return;
  canvas.focus();
  const point = screenToWorld(event.clientX, event.clientY);
  if (insideIsland(point.x, point.z)) {
    state.moveTarget = point;
    state.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
  }
});
canvas.addEventListener("pointermove", (event) => {
  if (state.pointerId !== event.pointerId || event.buttons === 0) return;
  const point = screenToWorld(event.clientX, event.clientY);
  if (insideIsland(point.x, point.z)) state.moveTarget = point;
});
function releaseCanvasPointer(event) {
  if (state.pointerId === event.pointerId) {
    state.pointerId = null;
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
}
canvas.addEventListener("pointerup", releaseCanvasPointer);
canvas.addEventListener("pointercancel", releaseCanvasPointer);
canvas.addEventListener("lostpointercapture", () => { state.pointerId = null; });

/* ========================= RULE ========================= */
function insideIsland(x, z) {
  const poly = DESIGN.world.coast;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
    const intersect = ((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / ((zj - zi) || 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
function movePlayer(dt) {
  let dx = 0, dz = 0;
  const keys = new Set([...state.keys, ...state.padKeys]);
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dz += 1;
  if (keys.has("arrowdown") || keys.has("s")) dz -= 1;

  if (dx || dz) {
    const len = Math.hypot(dx, dz);
    dx /= len; dz /= len;
    state.moveTarget = null;
    tryMove(dx * DESIGN.moveSpeed * dt, dz * DESIGN.moveSpeed * dt);
  } else if (state.moveTarget) {
    const vx = state.moveTarget.x - state.player.x;
    const vz = state.moveTarget.z - state.player.z;
    const distance = Math.hypot(vx, vz);
    if (distance < 0.12) state.moveTarget = null;
    else {
      const step = Math.min(distance, DESIGN.moveSpeed * dt);
      tryMove(vx / distance * step, vz / distance * step);
    }
  }
}
function tryMove(dx, dz) {
  const nx = state.player.x + dx, nz = state.player.z + dz;
  if (insideIsland(nx, nz)) {
    state.player.x = nx; state.player.z = nz;
  } else {
    // Kıyı çizgisinde takılmamak için eksenleri ayrı ayrı dene.
    if (insideIsland(nx, state.player.z)) state.player.x = nx;
    if (insideIsland(state.player.x, nz)) state.player.z = nz;
  }
}
function samplePlayer(time) {
  const last = state.recording[state.recording.length - 1];
  if (last && time - last.t < DESIGN.sampleInterval - 0.001) return;
  state.recording.push({ t: time, x: state.player.x, z: state.player.z });
}
function interpolatePath(path, time) {
  if (!path || path.length === 0) return { x: DESIGN.start.x, z: DESIGN.start.z };
  if (time <= path[0].t) return { x: path[0].x, z: path[0].z };
  const last = path[path.length - 1];
  if (time >= last.t) return { x: last.x, z: last.z };
  let low = 0, high = path.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (path[mid].t <= time) low = mid; else high = mid;
  }
  const a = path[low], b = path[high];
  const f = (time - a.t) / Math.max(0.0001, b.t - a.t);
  return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f };
}
function echoPosition(echo) {
  return interpolatePath(echo.path, state.elapsed);
}
function updatePlates() {
  // HOLD rule: presence keeps a mechanism active; leaving it releases it.
  // Both the present player and replaying Echoes count as occupants.
  state.platesActive = DESIGN.plates.map((plate) => {
    const presentOnPlate = Math.hypot(state.player.x - plate.x, state.player.z - plate.z) <= DESIGN.plateRadius;
    const echoOnPlate = state.echoes.some((echo) => {
      const p = echoPosition(echo);
      return Math.hypot(p.x - plate.x, p.z - plate.z) <= DESIGN.plateRadius;
    });
    return presentOnPlate || echoOnPlate;
  });
}
function finishCycle() {
  const path = state.recording.slice();
  const final = path[path.length - 1];
  if (!final || final.t < DESIGN.loopSeconds) {
    path.push({ t: DESIGN.loopSeconds, x: state.player.x, z: state.player.z });
  }
  // CONTINUE rule: even if this loop did not solve the puzzle, keep its path.
  // OLDEST rule: when at capacity, discard the first (oldest) Echo only.
  if (state.echoes.length >= DESIGN.maxEchoes && DESIGN.rules.echoOverflow === "oldest") {
    state.echoes.shift();
  }
  state.echoes.push({
    id: state.cycle,
    path,
    color: [DESIGN.colors.echo1, DESIGN.colors.echo2, DESIGN.colors.echo3][(state.cycle - 1) % 3]
  });
  state.cycle += 1;
  state.elapsed = 0;
  state.sampleAccumulator = 0;
  state.recording = [{ t: 0, x: state.player.x, z: state.player.z }];
  state.notice = `Cycle ${state.cycle} begins. This island stays unchanged; your Echoes keep the paths you made.`;
}
function update(dt) {
  if (!state.running || state.won) return;
  movePlayer(dt);
  state.elapsed += dt;
  state.totalElapsed += dt;
  state.sampleAccumulator += dt;
  while (state.sampleAccumulator >= DESIGN.sampleInterval) {
    samplePlayer(state.elapsed - state.sampleAccumulator + DESIGN.sampleInterval);
    state.sampleAccumulator -= DESIGN.sampleInterval;
  }
  if (state.elapsed >= DESIGN.loopSeconds) {
    state.elapsed = DESIGN.loopSeconds;
    samplePlayer(DESIGN.loopSeconds);
    finishCycle();
  }
  updatePlates();
  if (DESIGN.rules.ending === "lighthouse" && state.platesActive.every(Boolean)) {
    state.won = true;
    state.running = false;
    state.notice = "All three mechanisms are held. The lighthouse is awake.";
    ui.win.hidden = false;
  }
}

/* ========================= OUTPUT ========================= */
function getMapTransform() {
  const w = canvas.width, h = canvas.height;
  const rangeX = DESIGN.mapBounds.maxX - DESIGN.mapBounds.minX;
  const rangeZ = DESIGN.mapBounds.maxZ - DESIGN.mapBounds.minZ;
  const scale = Math.min((w - DESIGN.stagePadding * 2) / rangeX, (h - DESIGN.stagePadding * 2) / rangeZ);
  const mapW = rangeX * scale, mapH = rangeZ * scale;
  return { scale, ox: (w - mapW) / 2, oy: (h + mapH) / 2 };
}
function worldToScreen(x, z) {
  const t = getMapTransform();
  return { x: t.ox + (x - DESIGN.mapBounds.minX) * t.scale, y: t.oy - (z - DESIGN.mapBounds.minZ) * t.scale };
}
function drawPolygon(points, fill, stroke, lineWidth=1) {
  if (!points || !points.length) return;
  ctx.beginPath();
  points.forEach((p, i) => {
    const s = worldToScreen(p[0], p[1]);
    if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
  });
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}
function drawLine(points, color, width, dash=[]) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  points.forEach((p, i) => {
    const s = worldToScreen(p[0], p[1]);
    if (!i) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]);
}
function drawMap() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  const oceanGrad = ctx.createLinearGradient(0,0,w,h);
  oceanGrad.addColorStop(0, DESIGN.colors.ocean);
  oceanGrad.addColorStop(1, DESIGN.colors.oceanDeep);
  ctx.fillStyle = oceanGrad; ctx.fillRect(0,0,w,h);

  // Deniz dokusu
  ctx.save(); ctx.globalAlpha = 0.16; ctx.strokeStyle = "#eff4e8"; ctx.lineWidth = 1;
  for (let y=28; y<h; y+=42) {
    ctx.beginPath();
    for (let x=0; x<=w; x+=14) ctx.lineTo(x, y + Math.sin(x*0.018+y*0.03)*4);
    ctx.stroke();
  }
  ctx.restore();

  drawPolygon(DESIGN.world.coast, DESIGN.colors.grass, DESIGN.colors.islandEdge, 5);

  // Bölgeler
  DESIGN.world.zones.forEach((zone) => {
    const color = zone.kind === "forest" ? "rgba(99,130,91,.25)" :
      zone.kind === "village" ? "rgba(218,177,135,.25)" :
      zone.kind === "garden" ? "rgba(145,164,111,.27)" : "rgba(233,205,151,.55)";
    drawPolygon(zone.poly, color, "rgba(60,76,60,.12)", 1);
    const center = zone.poly.reduce((a,p)=>[a[0]+p[0]/zone.poly.length,a[1]+p[1]/zone.poly.length],[0,0]);
    const s = worldToScreen(center[0],center[1]);
    ctx.fillStyle = "rgba(45,61,52,.52)"; ctx.font = "italic 15px 'IM Fell English', Georgia";
    ctx.textAlign = "center"; ctx.fillText(zone.name, s.x, s.y);
  });

  // Yollar
  DESIGN.world.paths.forEach((path) => {
    const road = path.kind === "road";
    drawLine(path.pts, road ? DESIGN.colors.road : DESIGN.colors.path, road ? 13 : 7);
    drawLine(path.pts, "rgba(255,255,255,.28)", road ? 2 : 1, [4,5]);
  });

  // Evler, ağaçlar, kayalar ve iskele tekneleri: C2 ada planından.
  DESIGN.world.items.forEach((item) => {
    const s = worldToScreen(item.at[0], item.at[1]);
    if (item.kind === "tree") drawTree(s.x,s.y, item.h || 1.4, item.pat?.[0] || "fur");
    if (item.kind === "house") drawHouse(s.x,s.y,item.v || 0);
    if (item.kind === "rock") {
      ctx.fillStyle="#8f927e"; ctx.beginPath(); ctx.ellipse(s.x,s.y,6+(item.s||.5)*3,4+(item.s||.5)*2,-.3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#52645a"; ctx.lineWidth=1.2; ctx.stroke();
    }
    if (item.kind === "lamp") {
      ctx.fillStyle="#35453f"; ctx.fillRect(s.x-1.5,s.y-9,3,10);
      ctx.fillStyle="#f4d88c"; ctx.beginPath(); ctx.arc(s.x,s.y-10,3,0,Math.PI*2); ctx.fill();
    }
    if (item.kind === "boat") {
      ctx.fillStyle="#9a6654"; ctx.beginPath(); ctx.moveTo(s.x-10,s.y); ctx.lineTo(s.x+10,s.y); ctx.lineTo(s.x+6,s.y+5); ctx.lineTo(s.x-7,s.y+5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="#f4e9d2"; ctx.beginPath(); ctx.moveTo(s.x,s.y-12); ctx.lineTo(s.x,s.y-1); ctx.stroke();
    }
  });

  // Deniz feneri ve iskele noktası
  const hub = worldToScreen(DESIGN.lighthouse.x, DESIGN.lighthouse.z);
  drawLighthouse(hub.x,hub.y);
  drawMechanisms();
  drawCharacters();
}
function drawTree(x,y,h,pattern) {
  const scale = Math.max(.7,Math.min(1.25,h/1.5));
  ctx.fillStyle="#665b45"; ctx.fillRect(x-2*scale,y-2*scale,4*scale,9*scale);
  ctx.fillStyle = pattern === "diag" ? "#6e8b65" : "#58785e";
  ctx.beginPath(); ctx.arc(x,y-8*scale,7*scale,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x-4*scale,y-5*scale,5*scale,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#334c3e"; ctx.lineWidth=1; ctx.stroke();
}
function drawHouse(x,y,v) {
  const palettes = [["#e6c6a0","#b66d58"],["#d8d5b2","#7d8d72"],["#e8d8b8","#6d8f9a"],["#e4b8a8","#9d6f86"]];
  const p = palettes[v % palettes.length];
  ctx.fillStyle="#6d5b4c"; ctx.fillRect(x-7,y-8,14,12);
  ctx.fillStyle=p[0]; ctx.fillRect(x-8,y-9,16,11);
  ctx.fillStyle=p[1]; ctx.beginPath(); ctx.moveTo(x-10,y-8); ctx.lineTo(x,y-16); ctx.lineTo(x+10,y-8); ctx.closePath(); ctx.fill();
  ctx.fillStyle="#5a5145"; ctx.fillRect(x-2,y-4,4,6);
}
function drawLighthouse(x,y) {
  const active = state.won;
  ctx.save(); ctx.translate(x,y);
  if (active) {
    ctx.globalAlpha=.22; ctx.fillStyle=DESIGN.colors.lighthouse; ctx.beginPath(); ctx.arc(0,-18,66,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.strokeStyle=DESIGN.colors.lighthouse; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(0,-29); ctx.lineTo(-75,-62); ctx.moveTo(0,-29); ctx.lineTo(78,-57); ctx.stroke();
  }
  ctx.fillStyle="#f1e7ce"; ctx.strokeStyle="#35433d"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-9,0); ctx.lineTo(-6,-28); ctx.lineTo(6,-28); ctx.lineTo(9,0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle="#c66d58"; ctx.fillRect(-7,-24,14,5); ctx.fillRect(-8,-13,16,5);
  ctx.fillStyle="#293d3a"; ctx.fillRect(-8,-31,16,4);
  ctx.fillStyle=active?"#ffe7a1":"#8d9c8b"; ctx.beginPath(); ctx.arc(0,-28,3.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#6d6656"; ctx.fillRect(-12,0,24,4);
  ctx.restore();
}
function drawMechanisms() {
  DESIGN.plates.forEach((plate,i) => {
    const s = worldToScreen(plate.x,plate.z), active = state.platesActive[i];
    const color = [DESIGN.colors.coral,DESIGN.colors.gold,DESIGN.colors.blue][i];
    ctx.save(); ctx.translate(s.x,s.y);
    ctx.fillStyle="rgba(30,48,42,.18)"; ctx.beginPath(); ctx.ellipse(0,5,17,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=active?color:"#ded6bd"; ctx.strokeStyle="#34443d"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(-13,-13,26,26,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#263735"; ctx.font="bold 13px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(String(plate.id),0,0);
    ctx.restore();
    ctx.fillStyle="#293c36"; ctx.font="12px 'IM Fell English', Georgia"; ctx.textAlign="center";
    ctx.fillText(plate.name, s.x, s.y+27);
    ctx.fillStyle=active?"#f7f0d9":"rgba(38,55,53,.58)"; ctx.font="10px Arial";
    ctx.fillText(active?"HELD":"STAND HERE",s.x,s.y+39);
  });
}
function drawCharacter(x,y,kind,color,alpha=1,label="") {
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y);
  if (kind === "bee") {
    // Arı tarifi: çizgili gövde, koyu kafa, kanat ve anten.
    ctx.fillStyle="rgba(255,255,255,.75)";
    ctx.beginPath(); ctx.ellipse(-7,-8,6,4,-.4,0,Math.PI*2); ctx.ellipse(7,-8,6,4,.4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#263735"; ctx.beginPath(); ctx.arc(0,-10,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#d9a84e"; ctx.beginPath(); ctx.ellipse(0,1,7,9,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="#263735"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-6,-2); ctx.lineTo(6,-2); ctx.moveTo(-6,4); ctx.lineTo(6,4); ctx.stroke();
    ctx.strokeStyle="#d9a84e"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-2,-15); ctx.lineTo(-5,-21); ctx.moveTo(2,-15); ctx.lineTo(5,-21); ctx.stroke();
    ctx.fillStyle="#263735"; ctx.beginPath(); ctx.arc(-2,-10,1,0,Math.PI*2); ctx.arc(2,-10,1,0,Math.PI*2); ctx.fill();
  } else if (kind === "mushroom") {
    ctx.fillStyle="#f5edda"; ctx.beginPath(); ctx.ellipse(0,3,7,9,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#c56d5e"; ctx.beginPath(); ctx.ellipse(0,-6,12,7,0,Math.PI,Math.PI*2); ctx.fill();
    ctx.fillStyle="#f5edda"; ctx.beginPath(); ctx.arc(-4,-6,1.3,0,Math.PI*2); ctx.arc(4,-6,1.3,0,Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle=color; ctx.beginPath(); ctx.ellipse(0,2,7,10,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#f8f1dd"; ctx.beginPath(); ctx.arc(0,-8,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#263735"; ctx.beginPath(); ctx.arc(-2,-8,1.1,0,Math.PI*2); ctx.arc(2,-8,1.1,0,Math.PI*2); ctx.fill();
    if (kind === "rabbit") { ctx.fillStyle="#f8f1dd"; ctx.beginPath(); ctx.ellipse(-3,-18,2.5,7,-.2,0,Math.PI*2); ctx.ellipse(3,-18,2.5,7,.2,0,Math.PI*2); ctx.fill(); }
  }
  if (label) {
    ctx.font="bold 10px Arial"; ctx.textAlign="center"; ctx.fillStyle="#263735";
    ctx.fillText(label,0,22);
  }
  ctx.restore();
}
function drawCharacters() {
  const start = worldToScreen(DESIGN.start.x,DESIGN.start.z);
  // Sakinler, verilen karakter tariflerinden esinlenen dekoratif işaretler.
  const mushroom = worldToScreen(-8.4,5.6);
  const rabbit = worldToScreen(-10.8,1.0);
  const pink = worldToScreen(-7.3,3.0);
  drawCharacter(mushroom.x,mushroom.y,"mushroom","#d97865",.95);
  drawCharacter(rabbit.x,rabbit.y,"rabbit","#718b68",.95);
  drawCharacter(pink.x,pink.y,"towner","#d98aa0",.95);

  state.echoes.forEach((echo,index) => {
    const p = echoPosition(echo), s = worldToScreen(p.x,p.z);
    ctx.save(); ctx.strokeStyle=echo.color; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.globalAlpha=.65;
    ctx.beginPath(); ctx.arc(s.x,s.y,17,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    drawCharacter(s.x,s.y,"bee",echo.color,.48,`E${index+1}`);
  });
  const live = worldToScreen(state.player.x,state.player.z);
  ctx.save(); ctx.strokeStyle="#263735"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(live.x,live.y,18,0,Math.PI*2); ctx.stroke(); ctx.restore();
  drawCharacter(live.x,live.y,"bee",DESIGN.colors.player,1,"YOU");
}
function drawTrail() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || state.recording.length < 2) return;
  const recent = state.recording.filter(p => state.elapsed - p.t <= 2.5);
  if (recent.length < 2) return;
  ctx.save(); ctx.strokeStyle="rgba(38,55,53,.28)"; ctx.lineWidth=2; ctx.setLineDash([3,5]); ctx.beginPath();
  recent.forEach((p,i)=>{ const s=worldToScreen(p.x,p.z); if(!i)ctx.moveTo(s.x,s.y);else ctx.lineTo(s.x,s.y); });
  ctx.stroke(); ctx.restore();
}
function drawFrame() {
  drawMap();
  drawTrail();
  drawCharacters();
  const remain = Math.max(0, DESIGN.loopSeconds - state.elapsed);
  ui.cycle.textContent = String(state.cycle).padStart(2,"0");
  ui.time.textContent = `${Math.ceil(remain)}s`;
  ui.timerFill.style.width = `${(remain / DESIGN.loopSeconds) * 100}%`;
  ui.echoCount.textContent = `${state.echoes.length} / ${DESIGN.maxEchoes}`;
  ui.notice.textContent = state.notice;
  ui.echoList.innerHTML = state.echoes.length ? state.echoes.map((e,i)=>`<div class="echo-row"><span class="echo-dot" style="--echo:${e.color}"></span><span>Echo ${i+1}</span><small>Cycle ${e.id}</small></div>`).join("") : `<div class="empty-state">No memories yet</div>`;
  ui.plateList.innerHTML = DESIGN.plates.map((p,i)=>`<div class="plate-row"><span class="plate-number">${p.id}</span><span>${p.name}</span><b class="${state.platesActive[i]?"is-active":""}">${state.platesActive[i]?"HELD":"WAITING"}</b></div>`).join("");
  ui.mode.textContent = state.won ? "LIGHTHOUSE RESTORED" : state.running ? "TIME LOOP ACTIVE" : "READY";
}

/* ========================= LIFECYCLE ========================= */
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0);
  // Drawing coordinates use CSS pixels.
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));
  ctx.setTransform(1,0,0,1,0,0);
  drawFrame();
}
function startGame() {
  if (state.won) return;
  state.running = true;
  state.notice = "Move to a numbered plate and stay there. Your movement becomes a future Echo.";
  ui.start.disabled = true;
  ui.start.textContent = "IN PROGRESS";
  canvas.focus();
}
function resetGame() {
  state.running = false; state.won = false; state.elapsed = 0; state.totalElapsed = 0;
  state.lastFrame = null; state.sampleAccumulator = 0;
  state.player = { ...DESIGN.start }; state.moveTarget = null;
  state.recording = [{ t: 0, x: DESIGN.start.x, z: DESIGN.start.z }];
  state.echoes = []; state.platesActive = [false,false,false]; state.cycle = 1;
  clearHeldInputs();
  ui.win.hidden = true; ui.start.disabled = false; ui.start.textContent = "START LOOP";
  state.notice = "Reach a numbered plate and stay there. Your path becomes an Echo.";
  updatePlates(); drawFrame();
}
function frame(now) {
  if (document.hidden) { state.lastFrame = null; requestAnimationFrame(frame); return; }
  if (state.lastFrame === null) state.lastFrame = now;
  const dt = Math.min(0.05, Math.max(0, (now - state.lastFrame) / 1000));
  state.lastFrame = now;
  update(dt);
  drawFrame();
  requestAnimationFrame(frame);
}
ui.start.addEventListener("click", startGame);
ui.reset.addEventListener("click", resetGame);
document.getElementById("play-again").addEventListener("click", resetGame);
window.addEventListener("resize", resizeCanvas);

resetGame();
resizeCanvas();
requestAnimationFrame(frame);
