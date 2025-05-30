const CACHE_NAME = "devs-notebook-v1";
const OFFLINE_CACHE = "devs-notebook-offline-v1";
const IMAGE_CACHE = "devs-notebook-images-v1";
const CONTENT_CACHE = "devs-notebook-content-v1";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/favicon.ico",
  "/images/logo.png",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main-app.js",
  "/_next/static/chunks/app-pages-internals.js",
];

const CONTENT_PATHS = [
  "/java",
  "/javascript",
  "/react",
  "/kotlin",
  "/scala",
  "/algorithms",
  "/data-structures",
  "/databases",
  "/apis",
  "/design-patterns",
  "/quick-reference",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS.filter((url) => url !== "/offline"));
      }),
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add("/offline");
      }),
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== OFFLINE_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== CONTENT_CACHE
            ) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.pathname.startsWith("/images/")) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  if (isContentRequest(url.pathname)) {
    event.respondWith(handleContentRequest(request));
    return;
  }

  event.respondWith(handleStaticRequest(request));
});

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Image not available offline", { status: 404 });
  }
}

async function handleContentRequest(request) {
  const cache = await caches.open(CONTENT_CACHE);
  const cachedResponse = await cache.match(request);

  if (navigator.onLine) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
        return response;
      }
    } catch (error) {
      console.log("Network request failed, serving from cache");
    }
  }

  if (cachedResponse) {
    return cachedResponse;
  }

  return caches.match("/offline");
}

async function handleAPIRequest(request) {
  if (navigator.onLine) {
    try {
      const response = await fetch(request);
      return response;
    } catch {
      return new Response(
        JSON.stringify({ error: "API not available offline" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response(JSON.stringify({ error: "API not available offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (navigator.onLine) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
        return response;
      }
    } catch (error) {
      console.log("Network request failed, serving from cache");
    }
  }

  if (cachedResponse) {
    return cachedResponse;
  }

  return caches.match("/offline");
}

function isContentRequest(pathname) {
  return (
    CONTENT_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.includes("/md/") ||
    pathname.endsWith(".md")
  );
}

self.addEventListener("backgroundsync", (event) => {
  if (event.tag === "content-sync") {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  const cache = await caches.open(CONTENT_CACHE);

  for (const path of CONTENT_PATHS) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        await cache.put(path, response);
      }
    } catch (error) {
      console.log(`Failed to sync ${path}:`, error);
    }
  }
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_CONTENT") {
    const { url } = event.data;
    cacheContent(url);
  }

  if (event.data && event.data.type === "GET_CACHE_STATUS") {
    getCacheStatus().then((status) => {
      event.ports[0].postMessage(status);
    });
  }
});

async function cacheContent(url) {
  const cache = await caches.open(CONTENT_CACHE);
  try {
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
    }
  } catch (error) {
    console.log(`Failed to cache ${url}:`, error);
  }
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }

  return status;
}
