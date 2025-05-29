const CACHE_NAME = "devs-notebook-images-v1";
const IMAGE_CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

// Install event - cache critical images
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/images/logo.png",
        // Add other critical images here
      ]);
    })
  );
});

// Fetch event - implement image caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle image requests
  if (
    request.destination === "image" ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Check if cached image is still fresh
          const cacheTime = parseInt(
            cachedResponse.headers.get("sw-cache-time") || "0"
          );
          const now = Date.now();

          if (now - cacheTime < IMAGE_CACHE_EXPIRY) {
            return cachedResponse;
          }
        }

        try {
          // Fetch new image
          const response = await fetch(request);

          if (response.ok) {
            // Clone response and add cache timestamp
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set("sw-cache-time", Date.now().toString());

            const modifiedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers,
            });

            cache.put(request, modifiedResponse);
          }

          return response;
        } catch (error) {
          // Return cached version if network fails
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return fallback image for local images
          if (url.pathname.startsWith("/images/")) {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Image not available</text></svg>',
              {
                headers: {
                  "Content-Type": "image/svg+xml",
                  "Cache-Control": "no-store",
                },
              }
            );
          }

          throw error;
        }
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith("devs-notebook-images-") &&
              cacheName !== CACHE_NAME
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
