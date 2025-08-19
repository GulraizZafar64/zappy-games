const CACHE_NAME = "ZappyGames-v1"
const STATIC_CACHE = "ZappyGames-static-v1"
const DYNAMIC_CACHE = "ZappyGames-dynamic-v1"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/games",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Service Worker: Skip waiting")
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests
  if (url.origin !== location.origin) return

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse
      }

      // Fetch from network and cache dynamic content
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Offline fallback
          if (request.destination === "document") {
            return caches.match("/offline.html")
          }

          // Fallback for images
          if (request.destination === "image") {
            return caches.match("/icons/icon-192x192.png")
          }
        })
    }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received")

  const options = {
    body: event.data ? event.data.text() : "New games available!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Play Now",
        icon: "/icons/play-action.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/close-action.png",
      },
    ],
    requireInteraction: true,
    silent: false,
  }

  event.waitUntil(self.registration.showNotification("ZappyGames", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked")

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "close") {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"))
  }
})

// Background sync event
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag)

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Perform background tasks here
      console.log("Performing background sync..."),
    )
  }
})

// Periodic background sync (requires registration)
self.addEventListener("periodicsync", (event) => {
  console.log("Service Worker: Periodic sync", event.tag)

  if (event.tag === "daily-games-update") {
    event.waitUntil(
      // Update game data in the background
      updateGameData(),
    )
  }
})

async function updateGameData() {
  try {
    // Fetch latest game data
    const response = await fetch("/api/games")
    const games = await response.json()

    // Store in cache
    const cache = await caches.open(DYNAMIC_CACHE)
    await cache.put("/api/games", new Response(JSON.stringify(games)))

    console.log("Game data updated in background")
  } catch (error) {
    console.error("Failed to update game data:", error)
  }
}
