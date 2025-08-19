// Simplified Service Worker for better compatibility
const CACHE_NAME = "ZappyGames-simple-v1"
const STATIC_ASSETS = ["/", "/games", "/offline.html"]

// Install event
self.addEventListener("install", (event) => {
  console.log("Simple Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Simple Service Worker: Caching assets")
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.log("Cache addAll failed:", error)
          // Continue even if some assets fail to cache
          return Promise.resolve()
        })
      })
      .then(() => {
        console.log("Simple Service Worker: Skip waiting")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.log("Install failed:", error)
      }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Simple Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Simple Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Simple Service Worker: Claiming clients")
        return self.clients.claim()
      })
      .catch((error) => {
        console.log("Activate failed:", error)
      }),
  )
})

// Fetch event - basic caching strategy
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).catch(() => {
            // Offline fallback
            if (event.request.destination === "document") {
              return caches.match("/offline.html")
            }
          })
        )
      })
      .catch((error) => {
        console.log("Fetch failed:", error)
        // Return offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/offline.html")
        }
      }),
  )
})

// Basic push notification handling
self.addEventListener("push", (event) => {
  console.log("Simple Service Worker: Push received")

  const options = {
    body: event.data ? event.data.text() : "New games available!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: "ZappyGames-notification",
  }

  event.waitUntil(self.registration.showNotification("ZappyGames", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Simple Service Worker: Notification clicked")

  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})
