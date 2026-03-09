"use client"

import { useState, useEffect } from "react"
import { GameCard } from "@/components/game-card"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/ui/pagination-demo"
import { Loader2 } from "lucide-react"

type Game = {
  name: string
  url: string
  category: string
  image: string
  iframe?: string
  rating?: number
  plays?: number
  badge?: string
}

function buildCategories(games: Game[]) {
  const map = new Map<string, { name: string; url: string; type: string }>()
  games.forEach((g) => {
    const cat = (g.category || "other").split(" ")[0].toLowerCase()
    if (!map.has(cat)) {
      map.set(cat, {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        url: cat,
        type: "category",
      })
    }
  })
  return [{ name: "All Games", url: "all", type: "category" }, ...Array.from(map.values())]
}

export default function AllGamesMainPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All Games")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 24

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then((d) => {
        setGames(d.games || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const isAll = selectedCategory === "All Games" || selectedCategory === "all games"
  const filtered = games.filter((g) => {
    if (!isAll && g.category?.split(" ")[0].toLowerCase() !== selectedCategory) return false
    if (searchTerm && !g.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const indexOfLastGame = currentPage * gamesPerPage
  const indexOfFirstGame = indexOfLastGame - gamesPerPage
  const currentGames = filtered.slice(indexOfFirstGame, indexOfLastGame)
  const totalPages = Math.ceil(filtered.length / gamesPerPage)
  const categories = buildCategories(games)

  return (
    <div className="min-h-screen bg-black pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-2">
            All Games
            <span className="text-zappy-green"> Collection</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {games.length} games
          </p>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-zappy-green animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 mt-8">
              {currentGames.map((game, index) => (
                <GameCard key={game.url} game={game} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-400">
                No games found. Try another category or search.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
