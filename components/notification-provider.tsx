"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Bell } from "lucide-react"

export function NotificationProvider() {
  const { user } = useAuth()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPreview =
        window.location.hostname.includes("preview-") ||
        window.location.hostname.includes("vusercontent.net") ||
        window.location.hostname.includes("vercel.app")

      setIsPreviewMode(isPreview)

      if ("Notification" in window) {
        setNotificationPermission(Notification.permission)
      }
    }
  }, [])

  useEffect(() => {
    if (user && notificationPermission === "default" && !isPreviewMode) {
      // Show permission prompt after user logs in (only in production)
      setTimeout(() => {
        setShowPermissionPrompt(true)
      }, 5000)
    }

    if (user && notificationPermission === "granted") {
      setupPushNotifications()
    }
  }, [user, notificationPermission, isPreviewMode])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)
        setShowPermissionPrompt(false)

        if (permission === "granted") {
          setupPushNotifications()
          showWelcomeNotification()
        }
      } catch (error) {
        console.log("Notification permission request failed:", error)
        setShowPermissionPrompt(false)
      }
    }
  }

  const setupPushNotifications = () => {
    // Only set up push notifications in production with service worker
    if (isPreviewMode) {
      console.log("Push notifications not available in preview mode")
      setupBasicNotifications()
      return
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          // Subscribe to push notifications
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "demo-key"),
          })
        })
        .then((subscription) => {
          console.log("Push subscription:", subscription)
          // In a real app, you'd send this subscription to your server
        })
        .catch((error) => {
          console.log("Push subscription failed, using basic notifications:", error)
          setupBasicNotifications()
        })
    } else {
      setupBasicNotifications()
    }
  }

  const setupBasicNotifications = () => {
    // Schedule basic notifications without service worker
    scheduleDailyNotifications()
  }

  const showWelcomeNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Welcome to ZappyGames!", {
        body: "You'll now receive notifications about new games and updates.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "welcome",
      })
    }
  }

  const scheduleDailyNotifications = () => {
    // Schedule notification for 7 PM daily
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setHours(19, 0, 0, 0)

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime()

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("ZappyGames - Daily Gaming Time!", {
          body: "Check out new games and continue your favorites!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          tag: "daily-reminder",
        })
      }

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

  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false)
    localStorage.setItem("notification-prompt-dismissed", "true")
  }

  // Don't show if already dismissed or in preview mode
  useEffect(() => {
    const dismissed = localStorage.getItem("notification-prompt-dismissed")
    if (dismissed || isPreviewMode) {
      setShowPermissionPrompt(false)
    }
  }, [isPreviewMode])

  if (!showPermissionPrompt || notificationPermission !== "default" || isPreviewMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-2xl shadow-blue-500/25 border border-blue-500/20 backdrop-blur-xl">
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">Stay Updated!</h3>
            <p className="text-blue-100 text-sm mb-4">
              Get notified about new games, updates, and daily gaming reminders.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={requestNotificationPermission}
                className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
              >
                Enable
              </button>
              <button
                onClick={dismissPermissionPrompt}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
