/* ===== Rules and numbers: change them here ===== */
const GITHUB_USER = 'busraydoan';        // used for project addresses
const BUBBLE_MS = 2000;                 // how long the "Ouch!!" bubble stays
const IDLE_MS = 14000;                   // reciprocity: site speaks up after this idle time
const SUN_TONES = ['#ffe866','#ffd93b','#f6d737','#e5a92b','#b86b19']; // sun color tone per roast level
const ROASTS = [
  {name:'Light',color:'#c9a26b',note:'Bright and fruity, like a morning by the sea.'},
  {name:'Medium-light',color:'#a97c46',note:'Sweet and balanced.'},
  {name:'Medium',color:'#85582c',note:'Round, nutty, easy to love.'},
  {name:'Medium-dark',color:'#5e3a1d',note:'Chocolate and caramel.'},
  {name:'Dark',color:'#2f1c10',note:'Bold and smoky, no turning back.'}
];
const PUPIL_RANGE = 22;                  // how far the pupil can move (px in SVG)
const THEMES = {
  sun:   {pop:'#f6d737',pop2:'#b9a6f2'},
  lilac: {pop:'#b9a6f2',pop2:'#f6d737'},
  tomato:{pop:'#f3573a',pop2:'#f6d737'},
  coffee:{pop:'#c58a5a',pop2:'#f1ddc0'}
};
const FACTS = [
  {q:'How long have I been roasting coffee?',a:'Since 2021. I own a coffee roasting business.'},
  {q:'Is a coffee bean really a bean?',a:'Not quite. It is the seed of a cherry-like fruit.'},
  {q:'What do beans do while they roast?',a:'They crack twice: a first crack, then a quieter second crack. Roasters listen for both.'},
  {q:'Who drinks the most coffee?',a:'Finland is famous for it: Finns drink more coffee per person than almost anyone.'},
  {q:'Ciao! What am I learning right now?',a:'Italian. Fun fact: espresso means “pressed out” in Italian.'},
  {q:'What am I designing right now?',a:'A website for a law firm. I am working on it at the moment.'}
];
const TILTS = [-1.5,1,-.5,1.5,-1,.8];     // card rotation in degrees
const MUSIC_VOLUME = .12;                 // 0 to 1
const CHORD_SECONDS = 8;                  // length of each chord
const CHORDS = [[196,246.94,293.66,392],[174.61,220,261.63,349.23],[164.81,207.65,246.94,329.63],[196,246.94,293.66,370]];
const BELLS = [523.25,587.33,659.25,783.99];
const PROJECTS = [
  {id:'sn8',title:'SN8',line:'An interactive piece from the first weeks of the course.'},
  {id:'ZamansalKARNAVAL',title:'Zamansal Karnaval',line:'A carnival where the passing of time changes the scene.'},
  {id:'feedback',title:'Feedback',line:'A study in how a screen answers what a visitor does.'},
  {id:'cicekk',title:'Çiçek',line:'A flower that grows and reacts to the visitor.'},
  {id:'agency',title:'Agency',line:'Premise 01: the visitor chooses and the work changes.'},
  {id:'spillthebeans',title:'Spill the Beans',line:'A playful coffee-themed piece, close to my roastery.'},
  {id:'30seconds',title:'30 Seconds',line:'A short piece about what can happen in thirty seconds.'}
];
/* ================================================ */

const $ = s => document.querySelector(s);
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let idleTimer;

/* menu (keyboard + mobile outside-click) */
const burger = $('#burger'), menu = $('#menu');
function closeMenu(returnFocus){
  if(!menu.classList.contains('open')) return;
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded','false');
  if(returnFocus) burger.focus();
}
burger.addEventListener('click',()=>{
  const o = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded',o);
  if(o) menu.querySelector('a').focus();
});
menu.addEventListener('click',e=>{if(e.target.tagName==='A') closeMenu(false);});
document.addEventListener('click',e=>{
  if(!e.target.closest('header')) closeMenu(false);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeMenu(true);
});

/* theme (Agency) */
function setTheme(name){
  const t = THEMES[name]; if(!t) return;
  root.style.setProperty('--pop',t.pop); root.style.setProperty('--pop2',t.pop2);
  document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.theme===name));
}
document.querySelectorAll('.chip[data-theme]').forEach(b=>b.addEventListener('click',()=>{
  setTheme(b.dataset.theme); say('You picked '+b.textContent+'. The whole site follows.'); poke();
}));

/* reciprocity: reply */
function say(t){ $('#reply').textContent = t; }
function poke(){ clearTimeout(idleTimer); idleTimer = setTimeout(()=>say('Still there? Pick a look or roast the bean.'),IDLE_MS); }
poke();

/* agency + reciprocity: roast the bean, the sun's color tone shifts */
const roast = $('#roast');
function roastIt(silent){
  const n = roast.value-1, r = ROASTS[n];
  $('#roastName').textContent = r.name; $('#roastNote').textContent = r.note;
  $('#beanBody').setAttribute('fill', r.color);
  root.style.setProperty('--sunTone', SUN_TONES[n]);
  if(!silent){
    look(0,10);
    if(!reduce) $('#bean').animate([{transform:'rotate(-14deg) scale(1.12)'},{transform:'none'}],{duration:350});