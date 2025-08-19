"use client"

import { useState, useEffect } from "react"
import { Download, X, Smartphone, Monitor } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Check if we're in preview mode
    const isPreview =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("preview-") ||
        window.location.hostname.includes("vusercontent.net") ||
        window.location.hostname.includes("vercel.app"))

    setIsPreviewMode(isPreview)

    // Check if app is already installed
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    }

    // Only set up install prompt if not in preview mode
    if (!isPreview) {
      setupInstallPrompt()
    }
  }, [])

  const setupInstallPrompt = () => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed")
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      localStorage.setItem("pwa-installed", "true")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstalled(true)
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.log("Install prompt failed:", error)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  // Don't show if already installed, standalone, or in preview mode
  if (isInstalled || isStandalone || isPreviewMode || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl shadow-purple-500/25 border border-purple-500/20 backdrop-blur-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              {isIOS ? <Smartphone className="h-6 w-6 text-white" /> : <Monitor className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Install ZappyGames</h3>
              <p className="text-purple-100 text-sm">Get the full app experience</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-purple-100 text-sm">
            <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
            <span>Faster loading and offline access</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-100 text-sm">
            <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
            <span>Push notifications for new games</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-100 text-sm">
            <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
            <span>Native app-like experience</span>
          </div>
        </div>

        {isIOS ? (
          <div className="text-purple-100 text-sm">
            <p className="mb-2">To install on iOS:</p>
            <p>
              1. Tap the share button <span className="font-mono">⎋</span>
            </p>
            <p>
              2. Select "Add to Home Screen" <span className="font-mono">➕</span>
            </p>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Install App</span>
            </button>
            <button onClick={handleDismiss} className="px-4 py-3 text-white/70 hover:text-white transition-colors">
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
