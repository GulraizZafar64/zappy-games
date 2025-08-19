"use client"

import { useState, useEffect } from "react"
import { GameCard } from "@/components/game-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { GameTabs } from "@/components/game-tabs"
import { RecentGames } from "@/components/recent-games"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { gameData } from "@/data/games"
import { HowToPlay } from "@/components/how-to-play"

export default function HomePage() {
  const [games, setGames] = useState(gameData.games.slice(0, 30)) // Limit to 30 games
  const [selectedCategory, setSelectedCategory] = useState("All Games")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("featured")
  const [likedGames, setLikedGames] = useState<string[]>([])
  const { user, isSupabaseConfigured } = useAuth()

  // useEffect(() => {
  //   if (user && isSupabaseConfigured) {
  //     fetchLikedGames()
  //   }
  // }, [user, isSupabaseConfigured])

  const fetchLikedGames = async () => {
    if (!user || !isSupabaseConfigured) return

    try {
      const { data } = await supabase.from("likes").select("game_id").eq("user_id", user.id)

      if (data) {
        setLikedGames(data.map((like) => like.game_id))
      }
    } catch (error) {
      console.error("Error fetching liked games:", error)
    }
  }

  useEffect(() => {
    let filtered = gameData.games.slice(0, 30) // Always limit to 30

    if (selectedCategory !== "All Games") {
      filtered = filtered.filter((game) => game.category.split(" ")[0] === selectedCategory)
    }else{
      filtered = gameData.games.slice(0, 30)
    }

    if (searchTerm) {
      filtered = filtered.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setGames(filtered)
  }, [selectedCategory, searchTerm])

  const tabs = [
    { id: "featured", label: "Featured", icon: "🌟" },
    { id: "popular", label: "Popular", icon: "🔥" },
    { id: "new", label: "New", icon: "✨" },
    { id: "trending", label: "Trending", icon: "📈" },
  ]

  return (
    <div className="min-h-screen">
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <StatsSection />
       <HowToPlay />
      {/* Recent Games Section - Only show if user is logged in and Supabase is configured */}
      {user && isSupabaseConfigured && <RecentGames />}

      {/* Games Section */}
      <section className="px-4 pb-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12" id="fetured-games">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">Featured Games</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>

          {/* Enhanced Tabs */}
          {/* <GameTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} /> */}

          <CategoryFilter
            categories={gameData.categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-12">
            {games.map((game, index) => (
              <GameCard
                key={game.url}
                game={game}
                index={index}
                isLiked={likedGames.includes(game.url)}
                onLikeChange={fetchLikedGames}
              />
            ))}
          </div>

          {games.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-xl mb-2">No games found matching your criteria.</p>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          )}

          {/* View All Games Button */}
          <div className="text-center mt-12">
            <Link
              href="/games"
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
            >
              <span>View All Games</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
