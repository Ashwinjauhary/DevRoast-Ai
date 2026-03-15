// Empty service worker to silence 404s
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Clear any existing service worker caches if needed
});
