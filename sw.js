// Service Worker tile proxy for Cloudflare Pages deployment.
// Intercepts /tiles/{source}/{z}/{x}/{y}.png and proxies to upstream.
const SOURCES = {
  terrarium: (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`,
  osm: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  satellite: (z, x, y) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
};

const TILE_RE = /^\/tiles\/(\w+)\/(\d+)\/(\d+)\/(\d+)\.png$/;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const m = url.pathname.match(TILE_RE);
  if (!m) return; // not a tile, let it through
  
  const [, source, z, x, y] = m;
  const upstream = SOURCES[source];
  if (!upstream) return;
  
  event.respondWith(
    caches.open('tiles-v1').then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(upstream(z, x, y)).then((resp) => {
          if (resp.ok) {
            const clone = resp.clone();
            cache.put(event.request, clone);
          }
          return resp;
        });
      })
    )
  );
});

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
