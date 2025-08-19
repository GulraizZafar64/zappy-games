"use client"

import { Wifi, RefreshCw, Home, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Offline Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-4 border-gray-700">
            <Wifi className="h-16 w-16 text-gray-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">!</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4 font-orbitron">You're Offline</h1>

        {/* Description */}
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          No internet connection detected. Some features may not be available, but you can still browse cached games.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>

          <Link
            href="/games"
            className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-700"
          >
            <Gamepad2 className="h-5 w-5" />
            <span>Browse Cached Games</span>
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Offline Tips:</h3>
          <ul className="text-gray-400 text-sm space-y-2 text-left">
            <li>• Check your internet connection</li>
            <li>• Previously visited games may still work</li>
            <li>• Your progress is saved locally</li>
            <li>• Try refreshing when back online</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
