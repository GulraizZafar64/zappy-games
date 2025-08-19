"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { GameCard } from "@/components/game-card"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecentGame {
  id: string
  name: string
  url: string
  category: string
  image: string
  iframe: string
  rating: number
  plays: number
  played_at: string
}

export function RecentGames() {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isSupabaseConfigured } = useAuth()

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchRecentGames()
    } else {
      setLoading(false)
    }
  }, [user, isSupabaseConfigured])

  const fetchRecentGames = async () => {
    if (!user || !isSupabaseConfigured) return

    try {
      const { data } = await supabase
        .from("recent_plays")
        .select(`
          played_at,
          games (
            id,
            name,
            url,
            category,
            image,
            iframe,
            rating,
            plays
          )
        `)
        .eq("user_id", user.id)
        .order("played_at", { ascending: false })
        .limit(5)

      if (data) {
        const games = data.map((item) => ({
          ...item.games,
          played_at: item.played_at,
        })) as RecentGame[]

        setRecentGames(games)
      }
    } catch (error) {
      console.error("Error fetching recent games:", error)
    }
    setLoading(false)
  }

  if (!user || !isSupabaseConfigured || loading) return null

  if (recentGames.length === 0) return null

  return (
    <section className="px-4 py-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white font-orbitron">Recently Played</h2>
          </div>
          <Link
            href="/recent"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {recentGames.map((game, index) => (
            <div key={game.id} className="flex-shrink-0 w-64">
              <GameCard game={game} index={index} isLiked={false} onLikeChange={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
