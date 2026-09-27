const CACHE_NAME = 'sppg-pwa-v1';
const ASSETS_TO_CACHE = [
  '/pm-sppgbuaran/',
  '/pm-sppgbuaran/index.html',
  '/pm-sppgbuaran/manifest.json',
  '/pm-sppgbuaran/icon-512-v2.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Simpan seluruh aset dasar ke memori browser saat instalasi
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Bersihkan cache lama jika ada revisi versi cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Tangani permintaan jaringan (Network-First untuk Google Apps Script, Cache-First untuk aset tampilan)
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Jangan cache request API Google Apps Script agar data database selalu akurat
  if (requestUrl.includes('script.google.com') || requestUrl.includes('googleusercontent.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
