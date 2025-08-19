"use client"

import { useEffect, useState } from "react"
import { Users, Gamepad2, Star, Download } from "lucide-react"

export function StatsSection() {
  const [counts, setCounts] = useState({ games: 0, players: 0, rating: 0, downloads: 0 })

  useEffect(() => {
    const targets = { games: 1000, players: 50000, rating: 4.8, downloads: 1000000 }
    const duration = 2000
    const steps = 60

    const increment = {
      games: targets.games / steps,
      players: targets.players / steps,
      rating: targets.rating / steps,
      downloads: targets.downloads / steps,
    }

    let step = 0
    const timer = setInterval(() => {
      step++
      setCounts({
        games: Math.min(Math.floor(increment.games * step), targets.games),
        players: Math.min(Math.floor(increment.players * step), targets.players),
        rating: Math.min(Number((increment.rating * step).toFixed(1)), targets.rating),
        downloads: Math.min(Math.floor(increment.downloads * step), targets.downloads),
      })

      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    { icon: Gamepad2, label: "Games Available", value: counts.games.toLocaleString(), suffix: "+" },
    { icon: Users, label: "Active Players", value: counts.players.toLocaleString(), suffix: "+" },
    { icon: Star, label: "Average Rating", value: counts.rating.toString(), suffix: "/5" },
    { icon: Download, label: "Games Played", value: (counts.downloads / 1000000).toFixed(1), suffix: "M+" },
  ]

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, label, value, suffix }, index) => (
            <div
              key={label}
              className="text-center group animate-in fade-in duration-1000"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <Icon className="h-8 w-8 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron">
                  {value}
                  <span className="text-purple-400">{suffix}</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
