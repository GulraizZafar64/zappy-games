"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { GameCard } from "@/components/game-card"
import { Heart, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { gameData } from "@/data/games"

export default function LikedGamesPage() {
  const [likedGames, setLikedGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null) // New state for database errors
  const { user, isSupabaseConfigured } = useAuth()

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchLikedGames()
    } else {
      setLoading(false)
      if (!isSupabaseConfigured) {
        setDbError(
          "Liked games are not available. Please ensure your Supabase database is set up and tables are created.",
        )
      }
    }
  }, [user, isSupabaseConfigured])

  const fetchLikedGames = async () => {
    if (!user || !isSupabaseConfigured) return

    setLoading(true)
    setDbError(null) // Clear previous errors

    try {
      const { data, error } = await supabase.from("likes").select("game_id, created_at").eq("user_id", user.id)

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setDbError(
            "Liked games are not available. Please ensure your Supabase database is set up and tables are created (run the SQL scripts).",
          )
        } else {
          setDbError("Failed to load liked games. Please try again later.")
        }
        throw error
      }

      if (data) {
        // Match liked game IDs with game data
        const likedGameData = data
          .map((like) => {
            const game = gameData.games.find((g) => g.url === like.game_id)
            return game ? { ...game, liked_at: like.created_at } : null
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.liked_at).getTime() - new Date(a.liked_at).getTime())

        setLikedGames(likedGameData)
      }
    } catch (error) {
      console.error("Error fetching liked games:", error)
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="h-16 w-16 text-gray-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4 font-orbitron">Sign In Required</h1>
          <p className="text-gray-400 text-lg mb-8">You need to sign in to view your liked games.</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-700"></div>
                <div className="p-4">
                  <div className="bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white font-orbitron flex items-center space-x-3">
                <Heart className="h-10 w-10 text-red-500 fill-current" />
                <span>Liked Games</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {likedGames.length} game{likedGames.length !== 1 ? "s" : ""} you've liked
              </p>
            </div>
          </div>
        </div>

        {dbError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Database Error</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{dbError}</p>
          </div>
        )}

        {/* Games Grid */}
        {likedGames.length === 0 && !dbError ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Liked Games Yet</h2>
            <p className="text-gray-400 text-lg mb-8">Start exploring and like games to see them here!</p>
            <Link
              href="/games"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <span>Browse Games</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {likedGames.map((game, index) => (
              <GameCard key={game.url} game={game} index={index} isLiked={true} onLikeChange={fetchLikedGames} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
