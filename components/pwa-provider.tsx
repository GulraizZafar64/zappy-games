"use client"

import { useEffect, useState } from "react"

export function PWAProvider() {
  const [swSupported, setSWSupported] = useState(false)
  const [swRegistered, setSWRegistered] = useState(false)

  useEffect(() => {
    // Check if we're in a supported environment
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("localhost"))

    const isHTTPS = typeof window !== "undefined" && (window.location.protocol === "https:" || isLocalhost)

    const hasServiceWorker = "serviceWorker" in navigator

    setSWSupported(hasServiceWorker && isHTTPS)

    if (hasServiceWorker && isHTTPS) {
      registerServiceWorker()
    } else {
      console.log("Service Worker not supported in this environment")
      // Set up fallback functionality
      setupFallbackFeatures()
    }

    // Request notification permission regardless of SW support
    if ("Notification" in window && Notification.permission === "default") {
      // Don't auto-request, let the notification provider handle it
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      // Try the main service worker first
      let swPath = "/sw.js"
      let swResponse = await fetch(swPath, { method: "HEAD" }).catch(() => ({ ok: false }))

      // If main SW fails, try the simple one
      if (!swResponse.ok) {
        swPath = "/sw-simple.js"
        swResponse = await fetch(swPath, { method: "HEAD" }).catch(() => ({ ok: false }))
      }

      if (!swResponse.ok) {
        console.log("No service worker files found, using fallback mode")
        setupFallbackFeatures()
        return
      }

      const registration = await navigator.serviceWorker.register(swPath, {
        scope: "/",
        updateViaCache: "none",
      })

      console.log("Service Worker registered successfully:", registration)
      setSWRegistered(true)

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateNotification()
            }
          })
        }
      })

      // Register for background sync if supported
      if ("sync" in window.ServiceWorkerRegistration.prototype) {
        try {
          await registration.sync.register("background-sync")
        } catch (error) {
          console.log("Background sync not supported:", error)
        }
      }

      // Register for periodic background sync if supported
      if ("periodicSync" in window.ServiceWorkerRegistration.prototype) {
        try {
          await (registration as any).periodicSync.register("daily-games-update", {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          })
        } catch (error) {
          console.log("Periodic sync not supported:", error)
        }
      }
    } catch (error) {
      console.log("Service Worker registration failed, using fallback mode:", error)
      setupFallbackFeatures()
    }
  }

  const setupFallbackFeatures = () => {
    // Set up localStorage-based caching for offline support
    setupLocalStorageCache()

    // Set up manual notification scheduling
    setupManualNotifications()

    console.log("PWA fallback features enabled")
  }

  const setupLocalStorageCache = () => {
    // Cache game data in localStorage
    const cacheGameData = () => {
      try {
        const gameData = {
          timestamp: Date.now(),
          games: [], // This would be populated with actual game data
        }
        localStorage.setItem("ZappyGames-cache", JSON.stringify(gameData))
      } catch (error) {
        console.log("LocalStorage caching failed:", error)
      }
    }

    // Cache data periodically
    setInterval(cacheGameData, 30 * 60 * 1000) // Every 30 minutes
  }

  const setupManualNotifications = () => {
    // Set up notifications without service worker
    if ("Notification" in window) {
      const scheduleNotification = () => {
        if (Notification.permission === "granted") {
          // Schedule daily notification
          const now = new Date()
          const scheduledTime = new Date()
          scheduledTime.setHours(19, 0, 0, 0) // 7 PM

          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1)
          }

          const timeUntilNotification = scheduledTime.getTime() - now.getTime()

          setTimeout(() => {
            new Notification("ZappyGames - Daily Gaming Time!", {
              body: "Check out new games and continue your favorites!",
              icon: "/icons/icon-192x192.png",
              badge: "/icons/icon-72x72.png",
              tag: "daily-reminder",
            })

            // Schedule next day
            setInterval(
              () => {
                if (Notification.permission === "granted") {
                  new Notification("ZappyGames - Time to Play!", {
                    body: "Discover new games based on your interests!",
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/icon-72x72.png",
                    tag: "daily-reminder",
                  })
                }
              },
              24 * 60 * 60 * 1000,
            ) // 24 hours
          }, timeUntilNotification)
        }
      }

      scheduleNotification()
    }
  }

  const showUpdateNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("ZappyGames Updated!", {
        body: "New features and games are available. Refresh to update.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "app-update",
        requireInteraction: true,
      })
    }
  }

  return null
}
