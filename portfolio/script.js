/* ===== Rules and numbers: change them here ===== */
const GITHUB_USER = 'busraydoan';        // used for project addresses
const IDLE_MS = 14000;                   // reciprocity: site speaks up after this idle time
const SUN_SCALE = [1.15,1.05,.95,.8,.65]; // sun size for each roast level
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
  {id:'zamansalkarnaval',title:'Zamansal Karnaval',line:'A carnival where the passing of time changes the scene.'},
  {id:'feedback',title:'Feedback',line:'A study in how a screen answers what a visitor does.'},
  {id:'cicekk',title:'Çiçek',line:'A flower that grows and reacts to the visitor.'},
  {id:'agency',title:'Agency',line:'Premise 01: the visitor chooses and the work changes.'},
  {id:'spillthebeans',title:'Spill the Beans',line:'A playful coffee-themed piece, close to my roastery.'}
];
/* ================================================ */

const $ = s => document.querySelector(s);
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let idleTimer;

/* menu */
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.addEventListener('click',e=>{if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

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
function poke(){ clearTimeout(idleTimer); idleTimer = setTimeout(()=>say('Still there? Pick a word and watch the page change.'),IDLE_MS); }
poke();

/* agency + reciprocity: roast the bean, the page answers */
const roast = $('#roast');
function roastIt(silent){
  const n = roast.value-1, r = ROASTS[n];
  $('#roastName').textContent = r.name; $('#roastNote').textContent = r.note;
  $('#beanBody').setAttribute('fill', r.color);
  root.style.setProperty('--sunScale', SUN_SCALE[n]);
  if(!silent){
    look(0,10);
    if(!reduce) $('#bean').animate([{transform:'rotate(-14deg) scale(1.12)'},{transform:'none'}],{duration:350});
    say('You roasted it '+r.name.toLowerCase()+'. Watch the sun: it resizes with the roast.');
  }
}
roast.addEventListener('input',()=>{ roastIt(); poke(); });
roastIt(true);

/* reciprocity: eye follows pointer or focus */
const iris = $('#iris');
function look(dx,dy){ iris.setAttribute('transform','translate('+dx+' '+dy+')'); }
document.addEventListener('pointermove',e=>{
  if(reduce) return;
  const r = $('.eye').getBoundingClientRect();
  const a = Math.atan2(e.clientY-(r.top+r.height/2), e.clientX-(r.left+r.width/2));
  const d = Math.min(1, Math.hypot(e.clientX-(r.left+r.width/2), e.clientY-(r.top+r.height/2))/300);
  look(Math.cos(a)*PUPIL_RANGE*d*1.8, Math.sin(a)*PUPIL_RANGE*d);
});
document.addEventListener('focusin',e=>{ if(e.target.closest('.hero')&&!reduce){ const r=e.target.getBoundingClientRect(); look(0, r.top>innerHeight/2?PUPIL_RANGE:-PUPIL_RANGE/2);} });

/* fun facts: flash cards (Agency: the visitor flips them) */
function setFlip(b,on){
  b.classList.toggle('on',on); b.setAttribute('aria-pressed',on);
  b.querySelector('.front').setAttribute('aria-hidden',on); b.querySelector('.back').setAttribute('aria-hidden',!on);
}
$('#deck').innerHTML = FACTS.map((f,i)=>
  '<div class="cardwrap" style="--tilt:'+TILTS[i%TILTS.length]+'deg"><button class="fc" aria-pressed="false" data-c="'+(i%3)+'">'
  +'<span class="face front"><span class="fq">'+f.q+'</span><span class="hint">Tap to flip</span></span>'
  +'<span class="face back" aria-hidden="true"><span class="fa">'+f.a+'</span></span></button></div>').join('');
document.querySelectorAll('.fc').forEach(b=>b.addEventListener('click',()=>{ setFlip(b,!b.classList.contains('on')); poke(); }));
$('#flipAll').addEventListener('click',e=>{
  const on = e.currentTarget.getAttribute('aria-pressed')!=='true';
  e.currentTarget.setAttribute('aria-pressed',on);
  document.querySelectorAll('.fc').forEach(b=>setFlip(b,on)); poke();
});

/* calm background music, generated in the browser (starts only after a click) */
let ac, master, chordTimer, chordStep = 0, musicOn = false;
function playChord(){
  const t = ac.currentTime, chord = CHORDS[chordStep++%CHORDS.length], len = CHORD_SECONDS;
  chord.forEach((f,i)=>{
    const o = ac.createOscillator(), g = ac.createGain();
    o.type='sine'; o.frequency.value=f; o.detune.value=(i-1.5)*4;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.25,t+3); g.gain.linearRampToValueAtTime(0,t+len+2);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+len+2.1);
  });
  [1,3.5,6].forEach(d=>{
    const o = ac.createOscillator(), g = ac.createGain(), at = t+d;
    o.type='triangle'; o.frequency.value=BELLS[Math.floor(Math.random()*BELLS.length)];
    g.gain.setValueAtTime(0,at); g.gain.linearRampToValueAtTime(.07,at+.05); g.gain.exponentialRampToValueAtTime(.0005,at+3);
    o.connect(g); g.connect(master); o.start(at); o.stop(at+3.1);
  });
}
function toggleMusic(){
  const btn = $('#music');
  if(!musicOn){
    ac = ac || new (window.AudioContext||window.webkitAudioContext)();
    ac.resume();
    if(!master){
      master = ac.createGain(); master.gain.value = 0;
      const lp = ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900;
      const echo = ac.createDelay(); echo.delayTime.value=.45;
      const fb = ac.createGain(); fb.gain.value=.5; echo.connect(fb); fb.connect(echo);
      master.connect(lp); lp.connect(ac.destination); lp.connect(echo); echo.connect(ac.destination);
    }
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(MUSIC_VOLUME,ac.currentTime+2);
    playChord(); chordTimer = setInterval(playChord,CHORD_SECONDS*1000);
    musicOn = true; btn.textContent='♪ Calm music: on';
  } else {
    clearInterval(chordTimer);
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0,ac.currentTime+1.5);
    musicOn = false; btn.textContent='♪ Calm music: off';
  }
  btn.setAttribute('aria-pressed',musicOn); poke();
}
$('#music').addEventListener('click',toggleMusic);

/* projects with Splide (Agency: visitor orders the folders) */
function art(i){
  const c = ['#f6d737','#b9a6f2','#f3573a'], a=c[i%3], b=c[(i+1)%3], k='#141210';
  const shapes = [
    '<g stroke="'+k+'" stroke-width="10" fill="none">'+[0,1,2,3,4,5].map(n=>'<path d="M0 '+(30+n*28)+' Q50 '+(n*28)+' 100 '+(30+n*28)+' T200 '+(30+n*28)+' T300 '+(30+n*28)+'"/>').join('')+'</g>',
    [0,1,2,3].map(n=>'<circle cx="150" cy="100" r="'+(85-n*22)+'" fill="'+(n%2?a:b)+'" stroke="'+k+'" stroke-width="4"/>').join(''),
    '<g fill="'+k+'">'+Array.from({length:60},(_,n)=>'<circle cx="'+(20+(n%10)*28)+'" cy="'+(20+Math.floor(n/10)*32)+'" r="'+(3+(n%5))+'"/>').join('')+'</g>',
    Array.from({length:8},(_,n)=>'<rect x="'+(n*40)+'" y="0" width="20" height="200" fill="'+k+'"/>').join('')+'<circle cx="150" cy="100" r="50" fill="'+b+'" stroke="'+k+'" stroke-width="5"/>',
    '<g transform="translate(150 100)">'+Array.from({length:8},(_,n)=>'<ellipse rx="22" ry="62" cy="-48" fill="'+(n%2?b:a)+'" stroke="'+k+'" stroke-width="4" transform="rotate('+(n*45)+')"/>').join('')+'<circle r="22" fill="'+k+'"/></g>',
    '<g stroke="'+k+'" stroke-width="5">'+Array.from({length:30},(_,n)=>'<rect x="'+((n%6)*50)+'" y="'+(Math.floor(n/6)*40)+'" width="50" height="40" fill="'+((n+Math.floor(n/6))%2?b:a)+'"/>').join('')+'</g>',
    '<path d="M20 100 Q150 -10 280 100 Q150 210 20 100Z" fill="#efe9dc" stroke="'+k+'" stroke-width="6"/><circle cx="150" cy="100" r="40" fill="'+b+'" stroke="'+k+'" stroke-width="5"/><circle cx="150" cy="100" r="18" fill="'+k+'"/>'
  ];
  return '<svg viewBox="0 0 300 200" role="img" aria-label="Cover art for project" style="background:'+a+'">'+shapes[i%shapes.length]+'</svg>';
}
let order = PROJECTS.map((p,i)=>({...p,i}));
let splide;
function mountSlider(){
  $('#slides').innerHTML = order.map(p=>
    '<li class="splide__slide"><a class="proj" href="https://'+GITHUB_USER+'.github.io/'+p.id+'/" target="_blank" rel="noopener">'
    +art(p.i)+'<div class="t"><strong>'+p.title+'</strong><small>'+p.line+'</small><em>Open folder</em></div></a></li>').join('');
  splide = new Splide( '.splide' );
  splide.mount();
}
mountSlider();
document.querySelectorAll('.chip[data-sort]').forEach(b=>b.addEventListener('click',()=>{
  const m = b.dataset.sort, base = PROJECTS.map((p,i)=>({...p,i}));
  order = m==='az' ? base.sort((x,y)=>x.title.localeCompare(y.title,'tr'))
        : m==='shuffle' ? base.sort(()=>Math.random()-.5) : base;
  document.querySelectorAll('.chip[data-sort]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  splide.destroy(true); mountSlider();
  say('Folders reordered: '+b.textContent+'.'); poke();
}));

/* contact: live mailto (Reciprocity) */
function mailSync(){
  const t = $('#msg').value.trim();
  $('#mailBtn').href = 'mailto:busraaydogan875@gmail.com?subject='+encodeURIComponent('Hello from your portfolio')+'&body='+encodeURIComponent(t);
  $('#mailStatus').textContent = t ? 'Ready: '+t.length+' characters will open in your email app.' : 'Start typing: the button below fills itself in.';
}
$('#msg').addEventListener('input',mailSync);
