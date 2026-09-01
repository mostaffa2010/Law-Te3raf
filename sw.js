// sw.js - محرك العمل أوفلاين والتخزين المؤقت للعبة لَو تِعرَف
const CACHE_NAME = 'law-te3raf-v27';

const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './questions.js',
    './audio.js',
    './sounds.js',
    './script.js',
    './js/config.js',
    './js/audio.js',
    './js/questions.js',
    './js/questions-engine.js',
    './js/auth-nav.js',
    './js/game.js',
    './js/pvp.js',
    './js/features.js',
    './js/app.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js',
    'https://cdn-icons-png.flaticon.com/512/847/847969.png'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                STATIC_ASSETS.map((url) => {
                    return cache.add(url).catch((err) => {
                        console.warn('Failed to cache resource during install:', url, err);
                    });
                })
            );
        })
    );
});

// تفعيل وتنظيف الكاشات القديمة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// التعامل مع طلبات الشبكة (Cache First with Network Fallback & Dynamic Cache)
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // تجاهل طلبات الفايربيس والمستندات السحابية المباشرة من الكاش الصارم
    if (
        request.method !== 'GET' ||
        url.hostname.includes('firestore.googleapis.com') ||
        url.hostname.includes('identitytoolkit.googleapis.com') ||
        url.pathname.includes('/_vercel/insights')
    ) {
        return;
    }

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            // محاولة جلب النسخة الأحدث من الشبكة في الخلفية وتحديث الكاش
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone).catch(() => {});
                    });
                }
                return networkResponse;
            }).catch(() => {
                // في حالة انقطاع الإنترنت، إرجاع الكاش إذا كان موجوداً
                return cachedResponse;
            });

            // إرجاع الملف المخزن فوراً لتجربة سريعة جداً وأوفلاين، أو انتظار الشبكة
            return cachedResponse || fetchPromise;
        })
    );
});
