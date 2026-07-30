/* OKKOKI OS service worker — makes the phone installable and offline.
   Strategy: precache the shell on install, then stale-while-revalidate
   for same-origin GETs so updates land on the next visit without the
   user ever staring at a blank screen. Bump CACHE on each release. */
const CACHE = "okkoki-v9";

/* Relative paths — the site lives under /okkoki.github.io/ on Pages */
const SHELL = [
    "./",
    "index.html",
    "style.css",
    "script.js",
    "manifest.webmanifest",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-192.png",
    "icons/icon-maskable-512.png",
    "icons/apple-touch-icon.png",
    "wallpapers/aurora.jpg",
    "wallpapers/nebula.jpg",
    "wallpapers/sunset.jpg",
    "wallpapers/milkyway.jpg",
    "windows10-background.jpg",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE)
            // One miss (a renamed wallpaper, say) must not fail the whole
            // install, so each entry is added on its own.
            .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (e) => {
    const req = e.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return; // fonts, weather API -> network

    e.respondWith(
        caches.open(CACHE).then((cache) =>
            cache.match(req).then((cached) => {
                const fresh = fetch(req).then((res) => {
                    if (res && res.ok) cache.put(req, res.clone());
                    return res;
                }).catch(() => cached);
                // Serve cache instantly when we have it; refresh behind the scenes.
                return cached || fresh;
            })
        )
    );
});
