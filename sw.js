// sw.js - Service Worker للعبة لَو تِعرَف
const CACHE_NAME = 'law-te3raf-online-v28';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => caches.delete(k)));
        }).then(() => self.clients.claim())
    );
});

// الاعتماد المباشر على الشبكة لضمان جلب أحدث الأسئلة والصور دائماً
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
