// pwa-worker 01 — event
// Lines 1-16 of readable/pwa-worker.pretty.js (statement-aligned).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// Keep Chrome installability independent from OneSignal CDN availability.
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch (_) {}
