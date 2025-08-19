"use client"

import { useState, useEffect } from "react"
import { Eye, X } from "lucide-react"

export function PreviewModeIndicator() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPreview =
        window.location.hostname.includes("preview-") ||
        window.location.hostname.includes("vusercontent.net") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname === "localhost"

      setIsPreviewMode(isPreview)

      if (isPreview) {
        // Show indicator after a short delay
        setTimeout(() => {
          const dismissed = localStorage.getItem("preview-indicator-dismissed")
          if (!dismissed) {
            setShowIndicator(true)
          }
        }, 2000)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowIndicator(false)
    localStorage.setItem("preview-indicator-dismissed", "true")
  }

  if (!isPreviewMode || !showIndicator) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-2xl shadow-amber-500/25 border border-amber-400/20 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Preview Mode</h3>
              <p className="text-amber-100 text-xs">
                Some PWA features are limited in preview. Deploy to enable full functionality.
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-white/70 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
