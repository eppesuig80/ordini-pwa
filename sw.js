
const CACHE = 'ordini-pwa-v1';
const CORE = ['/', './', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then(res => res || fetch(request).then(resp => {
      try {
        if (request.method === 'GET' && new URL(request.url).origin === location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
        }
      } catch {}
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
