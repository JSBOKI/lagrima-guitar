// Offline support: precache the app shell + notation font + soundfont; cache-first for same-origin GETs.
const CACHE = "guitarcoach-20261023a";
const ASSETS = ["./", "index.html", "css/app.css", "js/app.js", "js/data.js", "js/texgen.js", "js/events.js", "js/fretboard.js", "js/tabstrip.js", "js/hand.js", "js/learn.js", "js/plan.js", "js/pluck.js",
  "js/notes.js", "js/course-data.js", "js/coursetex.js", "js/course.js", "js/trainer.js", "js/tools.js", "js/pitch.js",
  "vendor/alphatab/alphaTab.min.js", "vendor/alphatab/font/Bravura.woff2", "vendor/alphatab/font/Bravura.woff", "vendor/alphatab/font/Bravura.otf", "vendor/alphatab/soundfont/sonivox.sf2", "icon.svg", "icon-180.png", "manifest.webmanifest"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.endsWith("/sw.js")) return;
  // Pages and code: network first (fresh when online, cache when offline). Big assets: cache first.
  if (e.request.mode === "navigate" || /\.(js|css|html|webmanifest)$/.test(u.pathname) || u.pathname.endsWith("/")) {
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; }).catch(() => caches.match("index.html"))));
});
