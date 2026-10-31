/* Old Boots · Bastidores (app instalável)
   - a página do app (vinda do GitHub) e os ficheiros fixos ficam guardados no aparelho: o app abre logo;
   - por trás, vai buscar a versão mais recente; se mudou, guarda-a e avisa a página («Há uma versão nova · Atualizar»);
   - os dados (servidor do Google) nunca passam por aqui: vêm sempre frescos. */
const V = 'ob-app-v2', CASCA = ['/', '/index.html', '/manifest.webmanifest', '/icone-180.png', '/icone-192.png', '/icone-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CASCA)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const PAGINAS = /^https:\/\/oldbootsphotoandfilm-hub\.github\.io\/oldboots-site\/(paginas\/[\w-]+\.html|carregar\.js)/;
const FIXOS = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|oldbootsphotoandfilm-hub\.github\.io\/oldboots-site\/imagens\/)/;
const avisa = () => self.clients.matchAll({ type: 'window' }).then(l => l.forEach(c => c.postMessage({ tipo: 'nova' })));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = r.url.split('?')[0];
  // página do app e carregador: mostra a guardada e atualiza por trás
  if (PAGINAS.test(u)) {
    e.respondWith(caches.open(V).then(c => c.match(u).then(velha => {
      const antes = velha ? velha.clone().text() : Promise.resolve(null); // cópia lida antes de entregar a guardada à página
      const nova = fetch(r.url, { cache: 'no-store', credentials: 'omit' }).then(res => {
        if (!res.ok) return res;
        return res.clone().text().then(t => { const p = antes;
          return p.then(tv => { if (tv !== t) { c.put(u, new Response(t, { headers: { 'Content-Type': res.headers.get('Content-Type') || 'text/html' } })); if (tv !== null) avisa(); } return res; }); });
      });
      if (velha) { e.waitUntil(nova.catch(() => { })); return velha; }
      return nova;
    })));
    return;
  }
  // letras e imagens: guardadas depois da 1.ª vez
  if (FIXOS.test(u)) { e.respondWith(caches.open(V).then(c => c.match(r).then(x => x || fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; })))); return; }
  // o próprio app (index, ícones): guardado, com recurso à rede
  if (new URL(r.url).origin === self.location.origin) e.respondWith(caches.match(r, { ignoreSearch: true }).then(x => x || fetch(r)).catch(() => caches.match('/index.html')));
});
