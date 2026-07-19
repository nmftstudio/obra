const CACHE = "obra-del-dia-v1";
const SHELL = ["/", "/assets/style.css", "/assets/app.js", "/assets/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // nunca cachear la API: siempre queremos la obra del día fresca
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
