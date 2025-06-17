// A unique name for our cache
const CACHE_NAME = 'meal-planner-cache-v1';

// The list of files we want to cache
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the installation is complete
  event.waitUntil(
    // Open our cache
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the files from our list to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: fires for every network request the page makes.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // We respond to the request
  event.respondWith(
    // Try to find a matching request in our cache
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it
        if (response) {
          return response;
        }

        // If no match was found, fetch it from the network
        return fetch(event.request);
      }
    )
  );
});

// Activate event: fires when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If this cache name is not on our whitelist, delete it
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
