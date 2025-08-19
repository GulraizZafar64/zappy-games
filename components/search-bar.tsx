"use client"

import { Search, Sparkles } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

        <div className="relative bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden group-hover:border-purple-400/50 transition-all duration-300">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-400 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          <input
            type="text"
            placeholder="Search for your next adventure..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-16 py-6 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-medium"
          />
          <Sparkles className="absolute right-6 top-1/2 transform -translate-y-1/2 text-pink-400 h-6 w-6 animate-pulse" />
        </div>
      </div>

      {/* Popular searches */}
      {/* <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="text-gray-400 text-sm">Popular:</span>
        {["Action", "Puzzle", "Racing", "Adventure"].map((term) => (
          <button
            key={term}
            onClick={() => onSearchChange(term.toLowerCase())}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium hover:underline transition-colors duration-200"
          >
            {term}
          </button>
        ))}
      </div> */}
    </div>
  )
}
