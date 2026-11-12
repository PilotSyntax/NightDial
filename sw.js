const CACHE = 'nightdial-premium-v26';
const THETA_CACHE = 'nightdial-theta-v1';
const scope = new URL(self.registration.scope);
const index = new URL('index.html', scope);
const track = new URL('derive-theta-428hz.mp3', scope);
const shell = new Set([
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'apple-touch-icon.png',
  'icon-512.png',
].map(path => new URL(path, scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([...shell].map(url => new Request(url, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => /^nightdial-(?:premium-)?v\d+$/.test(key) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

let trackDownload;
self.addEventListener('message', event => {
  if (event.data !== 'theta-cache-status' && event.data !== 'cache-theta-track') return;
  event.waitUntil((async () => {
    if (event.data === 'cache-theta-track') await cacheTrack();
    const ready = Boolean(await caches.match(track.href, {cacheName: THETA_CACHE}).catch(() => null));
    event.source?.postMessage({type: 'theta-cache-status', ready});
  })());
});

function cacheTrack() {
  if (!trackDownload) {
    trackDownload = (async () => {
      const cache = await caches.open(THETA_CACHE);
      if (await cache.match(track.href)) return;
      const response = await fetch(track.href);
      if (response.status === 200) await cache.put(track.href, response);
    })().catch(() => {
      // A later playback can retry if the network or storage was unavailable.
    }).finally(() => { trackDownload = null; });
  }
  return trackDownload;
}

async function serveTrack(request) {
  const cached = await caches.match(track.href, {cacheName: THETA_CACHE}).catch(() => null);
  if (!cached) return fetch(request);

  const range = request.headers.get('Range');
  if (!range) return cached;

  // Media clients including Safari can probe or seek with single byte ranges.
  const blob = await cached.blob();
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(request);
  const start = match[1] ? Number(match[1]) : Math.max(0, blob.size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), blob.size - 1) : blob.size - 1;
  if (start >= blob.size || start > end) {
    return new Response(null, {status: 416, headers: {'Content-Range': 'bytes */' + blob.size}});
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Range': 'bytes ' + start + '-' + end + '/' + blob.size,
      'Content-Length': String(end - start + 1),
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
    },
  });
}

async function serveNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.status < 500) return response;
  } catch {
    // Fall back to the app shell for offline launches and reloads.
  }
  return await caches.match(index.href, {cacheName: CACHE}) || Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  url.search = '';
  if (url.href === track.href) {
    event.respondWith(serveTrack(request));
  } else if (request.mode === 'navigate' && (url.href === scope.href || url.href === index.href)) {
    event.respondWith(serveNavigation(request));
  } else if (shell.has(url.href)) {
    event.respondWith(caches.match(url.href, {cacheName: CACHE}).then(response => response || fetch(request)));
  }
});
