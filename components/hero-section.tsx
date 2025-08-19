"use client"

import { SearchBar } from "@/components/search-bar"
import { Play, Star, Users, Trophy } from "lucide-react"

interface HeroSectionProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function HeroSection({ searchTerm, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main heading with enhanced typography */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-orbitron leading-tight">
            Play Free
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-gradient-x">
              Online Games
            </span>
          </h1>

          {/* Subtitle with better styling */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of games across all categories.
            <span className="text-purple-400 font-semibold"> No downloads, no registration required.</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Play, text: "Instant Play" },
              { icon: Star, text: "Premium Quality" },
              { icon: Users, text: "Multiplayer" },
              { icon: Trophy, text: "Achievements" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Icon className="h-4 w-4 text-purple-400" />
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

        {/* CTA Button */}
        <div className="mt-8"
        >
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer"
                      onClick={() => {
      const section = document.getElementById("fetured-games");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }}
          >
            <span className="relative z-10">Start Playing Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  )
}
