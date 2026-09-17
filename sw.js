// sw.js: Service Worker for offline capability of Micro-Startup Compass PWA.
// Uses a network-first strategy so updates are immediately visible, falling back to cache offline.

const CACHE_NAME = "startup-compass-v16";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon.svg",
  "./css/main.css",
  "./css/stages.css",
  "./css/modules.css",
  "./css/responsive.css",
  "./js/app.js",
  "./js/store.js",
  "./js/services/aiClient.js",
  "./js/data/alchemistData.js",
  "./js/data/decisionTrees.js",
  "./js/data/grantsData.js",
  "./js/data/ideaSparks.js",
  "./js/data/innovatorStories.js",
  "./js/data/simulatorPersonas.js",
  "./js/data/testingPlaybook.js",
  "./js/modules/aiSettingsModal.js",
  "./js/modules/buildRoadmap.js",
  "./js/modules/cheapTesting.js",
  "./js/modules/conversationSimulator.js",
  "./js/modules/dailyMissions.js",
  "./js/modules/exportDossier.js",
  "./js/modules/helpAndLegalViews.js",
  "./js/modules/interviewTracker.js",
  "./js/modules/leanCanvas.js",
  "./js/modules/milestoneBadges.js",
  "./js/modules/realityCheck.js",
  "./js/modules/setbackAlchemist.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
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

self.addEventListener("fetch", (event) => {
  // Network-first strategy: Always fetch fresh asset when connected, fall back to cache when offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
      })
  );
});
