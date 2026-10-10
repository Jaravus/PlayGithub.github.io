const experiences = [
  { id:'neon-drift', name:'Neon Drift', kind:'HTML5 game', tag:'LEGACY', art:'art-neon', icon:'✦', author:'pixelgale', multiplayer:false, save:false, html:`<style>body{margin:0;background:radial-gradient(circle at 50% 45%,#293475,#080b18 60%);color:#b6fff4;font:16px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{font-size:52px;letter-spacing:-.06em;margin:0 0 8px;color:#fff}button{padding:11px 20px;border:1px solid #69e7db;background:#102c37;color:#b6fff4;border-radius:5px;cursor:pointer}small{display:block;color:#8894ae;margin:0 0 22px}</style><main><div style="font-size:62px">✦</div><h1>NEON DRIFT</h1><small>Legacy HTML5 compatibility demo</small><button onclick="this.textContent='RUNNING · '+Math.floor(Math.random()*99)+' FPS'">Start game →</button></main>` },
  { id:'paper-kingdom', name:'Paper Kingdom', kind:'HTML5 game', tag:'LEGACY', art:'art-pixel', icon:'▦', author:'tinyarcade', multiplayer:false, save:false, html:`<style>body{margin:0;background:#1b2538;color:#ffcf80;font:18px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{font-size:46px;color:#ffe5ad}button{padding:12px 20px;background:#854d35;color:#fff0c8;border:0;border-radius:5px}</style><main><div style="font-size:64px">▦</div><h1>PAPER KINGDOM</h1><p>Build a tiny kingdom in your browser.</p><button onclick="this.textContent='Kingdom loaded ✓'">Play now</button></main>` },
  { id:'orbital-garden', name:'Orbital Garden', kind:'3D world', tag:'CONNECTED', art:'art-forest', icon:'✺', author:'openworld', multiplayer:true, save:true, html:`<style>body{margin:0;background:linear-gradient(#101b35,#101b20);color:#b5fff1;font:16px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{color:#d6fff5;font-size:45px}button{padding:12px 20px;background:#69e7db;color:#092027;border:0;border-radius:5px}</style><main><div style="font-size:66px">✺</div><h1>ORBITAL GARDEN</h1><p>Host API-ready world preview.</p><button onclick="this.textContent='Connected to room · guest'">Enter world</button></main>` },
  { id:'quiet-void', name:'Quiet Void', kind:'HTML5 game', tag:'LEGACY', art:'art-void', icon:'◌', author:'nullgarden', multiplayer:false, save:false, html:`<style>body{margin:0;background:#12111e;color:#c6baff;font:16px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{font-weight:400;font-size:44px}button{padding:12px 20px;background:#3a315e;color:#eee4ff;border:1px solid #8f7fca;border-radius:5px}</style><main><div style="font-size:66px">◌</div><h1>QUIET VOID</h1><p>A small place to get lost.</p><button onclick="this.textContent='The void is listening…'">Enter</button></main>` },
  { id:'skyline', name:'Skyline FM', kind:'Instant site', tag:'SITE', art:'art-sky', icon:'⌁', author:'commonroom', multiplayer:false, save:false, html:`<style>body{margin:0;background:#e3f4fa;color:#15384a;font:18px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{font-size:50px;letter-spacing:-.06em}button{padding:12px 20px;background:#15384a;color:#fff;border:0;border-radius:5px}</style><main><div style="font-size:66px">⌁</div><h1>SKYLINE FM</h1><p>An instant site loaded through the OpenWorld shell.</p><button onclick="this.textContent='Now playing · Skyline FM'">Play radio</button></main>` },
  { id:'lumen', name:'Lumen House', kind:'3D world', tag:'CONNECTED', art:'art-site', icon:'✧', author:'lumenlabs', multiplayer:true, save:true, html:`<style>body{margin:0;background:linear-gradient(120deg,#17294f,#1c6170);color:#e8ffff;font:16px system-ui;text-align:center;height:100vh;display:grid;place-items:center}main{padding:30px}h1{font-size:48px}button{padding:12px 20px;background:#8af9ed;color:#092027;border:0;border-radius:5px}</style><main><div style="font-size:66px">✧</div><h1>LUMEN HOUSE</h1><p>A social room with host capabilities enabled.</p><button onclick="this.textContent='Room joined ✓'">Join room</button></main>` }
  ,{ id:'cyberleek', name:'CYBERLEEK Mirror', kind:'External static site', tag:'LEGACY', art:'art-neon', icon:'☼', author:'cyberleek-mirror', multiplayer:false, save:false, url:'https://cyberleek-mirror.github.io/cyberleek/' }
];

const grid = document.querySelector('#experience-grid');
const overlay = document.querySelector('#player-overlay');
const frame = document.querySelector('#experience-frame');
const dialog = document.querySelector('#url-dialog');
const urlInput = document.querySelector('#experience-url');
const nameInput = document.querySelector('#experience-name');

function card(exp) {
  return `<article class="experience-card" data-id="${exp.id}" tabindex="0" role="button" aria-label="Play ${exp.name}">
    <div class="card-art ${exp.art}"><span>${exp.icon}</span></div>
    <div class="card-body"><div class="card-meta"><span class="${exp.tag === 'LEGACY' ? 'legacy-tag' : 'tag'}">${exp.tag}</span><span>by ${exp.author}</span></div><h3>${exp.name}</h3><div class="card-meta"><span>${exp.kind}</span><span>↗</span></div><div class="capability-row"><span class="capability ${exp.multiplayer ? 'on' : ''}">${exp.multiplayer ? '● multiplayer' : '● no multiplayer'}</span><span class="capability ${exp.save ? 'on' : ''}">${exp.save ? '● save' : '● no save'}</span></div></div>
  </article>`;
}

function render() {
  grid.innerHTML = experiences.map(card).join('');
  grid.querySelectorAll('.experience-card').forEach(el => {
    el.addEventListener('click', () => play(experiences.find(x => x.id === el.dataset.id)));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') play(experiences.find(x => x.id === el.dataset.id)); });
  });
}

function play(exp) {
  document.querySelector('#player-name').textContent = exp.name;
  document.querySelector('#player-mode').textContent = exp.tag === 'LEGACY' ? 'LEGACY MODE' : 'HOST API MODE';
  document.querySelectorAll('.player-capability').forEach((el, i) => { const enabled = i === 0 ? exp.multiplayer : exp.save; el.textContent = enabled ? `● ${i === 0 ? 'multiplayer' : 'save'} enabled` : `● no ${i === 0 ? 'multiplayer' : 'save'}`; el.classList.toggle('muted', !enabled); });
  frame.src = exp.url || `data:text/html;charset=utf-8,${encodeURIComponent(exp.html)}`;
  overlay.hidden = false; document.body.style.overflow = 'hidden'; history.replaceState({}, '', `#play/${encodeURIComponent(exp.id)}`);
}

function closePlayer() { overlay.hidden = true; frame.src = 'about:blank'; document.body.style.overflow = ''; history.replaceState({}, '', '#home'); }
function openDialog() { dialog.showModal(); setTimeout(() => urlInput.focus(), 0); }

document.querySelector('#close-player').addEventListener('click', closePlayer);
document.querySelector('#open-url').addEventListener('click', openDialog);
document.querySelector('#paste-url').addEventListener('click', openDialog);
document.querySelector('#copy-share').addEventListener('click', async () => { await navigator.clipboard?.writeText(location.href); document.querySelector('#copy-share').textContent = 'Copied ✓'; setTimeout(() => document.querySelector('#copy-share').textContent = 'Share ↗', 1400); });
document.querySelector('#url-form').addEventListener('submit', e => {
  e.preventDefault(); const url = urlInput.value.trim(); const error = document.querySelector('#form-error');
  try { const parsed = new URL(url); if (!/^https?:$/.test(parsed.protocol)) throw new Error(); } catch { error.textContent = 'Enter a valid http or https URL.'; return; }
  const exp = { id: `external-${Date.now()}`, name: nameInput.value.trim() || 'External web experience', kind:'External HTML5 site', tag:'LEGACY', author:'external URL', multiplayer:false, save:false, art:'art-site', icon:'↗', url };
  dialog.close(); urlInput.value = ''; nameInput.value = ''; error.textContent = ''; play(exp);
});
window.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) closePlayer(); });
render();
