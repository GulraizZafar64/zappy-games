"use client"

import { useState, useEffect } from "react"
import { GameCard } from "@/components/game-card"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import Link from "next/link"
import { ArrowRight, Loader2, Search } from "lucide-react"
import Script from "next/script"
import { SnapCarousel } from "@/components/snap-carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Game = {
  name: string
  url: string
  category: string
  image: string
  iframe?: string
  rating?: number
  plays?: number
  badge?: string
  rank?: number
}

function useGames(searchTerm: string, selectedCategory: string) {
  const [games, setGames] = useState<Game[]>([])
  const [sections, setSections] = useState<{ [key: string]: Game[] }>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchGames = async (p: number, search: string, cat: string) => {
    if (p > 1) setLoadingMore(true)
    else setLoading(true)

    try {
      const catParam = cat && cat !== "All Games" ? `&category=${encodeURIComponent(cat)}` : ""
      const searchParam = search ? `&q=${encodeURIComponent(search)}` : ""
      const mainUrl = `/api/games?page=${p}&limit=24${catParam}${searchParam}`

      if (p === 1) {
        // Parallelize all initial fetches for speed
        const [mainRes, featuredRes, trendingRes, newRes] = await Promise.all([
          fetch(mainUrl).then(res => res.json()),
          fetch(`/api/games?limit=12&random=true`).then(res => res.json()),
          fetch(`/api/games?limit=12&category=Driving&random=true`).then(res => res.json()),
          fetch(`/api/games?limit=12&category=Shooting&random=true`).then(res => res.json())
        ])

        setGames(mainRes.games || [])
        setSections({
          featured: featuredRes.games || [],
          trending: trendingRes.games || [],
          new: newRes.games || []
        })
        setHasMore(mainRes.pagination?.hasMore ?? false)
      } else {
        const r = await fetch(mainUrl)
        const d = await r.json()
        const newGames = d.games || []
        setGames(prev => [...prev, ...newGames])
        setHasMore(d.pagination?.hasMore ?? false)
      }
    } catch (e) {
      console.error("Failed to fetch games", e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchGames(1, debouncedSearch, selectedCategory)
  }, [debouncedSearch, selectedCategory])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchGames(nextPage, debouncedSearch, selectedCategory)
    }
  }

  return { games, sections, loading, hasMore, loadingMore, loadMore }
}

function buildCategories() {
  return [
    { name: "All Games", url: "all", type: "category" },
    { name: "Action", url: "action", type: "category" },
    { name: "Driving", url: "driving", type: "category" },
    { name: "Puzzle", url: "puzzle", type: "category" },
    { name: "Shooting", url: "shooting", type: "category" },
    { name: "Adventure", url: "adventure", type: "category" }
  ]
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Games")
  const { games, sections, loading, hasMore, loadingMore, loadMore } = useGames(searchTerm, selectedCategory)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    const target = document.getElementById("load-more-trigger")
    if (target) observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, loadMore])

  const categories = buildCategories()

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6117892625157590"
        crossOrigin="anonymous"
      />
      <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans selection:bg-zappy-green selection:text-black">
        {/* GAMER TOP BAR */}
        <div className="pt-24 pb-8 px-4 border-b border-white/5 bg-gradient-to-b from-black to-[#0a0a0b]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black font-orbitron tracking-tighter uppercase leading-none">
                  Play <span className="text-zappy-green text-glow">Free</span>
                </h1>
                <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase">
                  Discover thousands of games. No downloads. No lag.
                </p>
              </div>

              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-0 bg-zappy-green/20 blur-xl group-focus-within:bg-zappy-green/40 transition-all duration-500" />
                <div className="relative flex items-center bg-black border border-white/10 group-focus-within:border-zappy-green/50 transition-all">
                  <Search className="ml-4 h-4 w-4 text-gray-500 group-focus-within:text-zappy-green" />
                  <input
                    type="text"
                    placeholder="SEARCH PROTOCOL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent px-4 py-4 text-xs font-bold font-orbitron tracking-widest focus:outline-none uppercase placeholder:text-gray-700"
                  />
                  <div className="mr-4 flex gap-1">
                    <div className="h-1 w-1 bg-zappy-green" />
                    <div className="h-1 w-3 bg-zappy-green" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar pt-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-8 py-3 text-[10px] font-black cursor-pointer uppercase tracking-[0.2em] transition-all whitespace-nowrap border category-skew relative group shrink-0 ${selectedCategory === cat.name
                    ? "bg-zappy-green text-white zappy-green !shadow-[0_4px_15px_rgba(169,255,77,0.3)] translate-y-[-2px]"
                    : "bg-[#141416] text-gray-500 border-white/5 hover:border-zappy-green/50 hover:text-white"
                    }`}
                >
                  <span className="category-text-skew block">{cat.name}</span>
                  {selectedCategory === cat.name && (
                    <div className="absolute inset-x-0 -bottom-px h-1 bg-black/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="flex-1 px-4 py-12">
          <div className="max-w-7xl mx-auto space-y-24">

            {loading ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <Loader2 className="h-12 w-12 text-zappy-green animate-spin" />
                <span className="text-[10px] font-black tracking-[0.5em] text-zappy-green animate-pulse">SYNCHRONIZING...</span>
              </div>
            ) : (
              <>
                {/* BENTO GRID - TOP PICKS */}
                <div id="top-picks" className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-zappy-green shadow-[0_0_15px_rgba(169,255,77,0.8)]" />
                    <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter">
                      Top Picks <span className="text-gray-600">/ 01</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(sections.featured || []).map((game, index) => (
                      <GameCard
                        key={game.url}
                        game={game}
                        index={index}
                        size={index === 0 ? 'large' : index === 1 ? 'tall' : index === 4 || index === 7 || index === 3 ? 'wide' : 'medium'}
                      />
                    ))}
                  </div>
                </div>

                {/* RANDOM DISCOVER SNAP CAROUSEL */}
                <div id="random-discover">
                  <SnapCarousel />
                </div>

                {/* ADVENTURE MISSIONS (Fixed Category) */}
                <div id="adventure-missions" className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-zappy-green shadow-[0_0_15px_rgba(169,255,77,0.8)]" />
                      <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter">
                        Adventure Missions <span className="text-gray-600">/ 02</span>
                      </h2>
                    </div>
                    <Link href="/games?category=Adventure" className="text-[10px] font-black text-zappy-green hover:underline tracking-widest uppercase">
                      VIEW ALL MISSIONS »
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(sections.trending || []).map((game, index) => (
                      <GameCard key={game.url} game={game} index={index} />
                    ))}
                  </div>
                </div>

                {/* ALL GAMES GRID */}
                <div id="all-games" className="space-y-12">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-zappy-green shadow-[0_0_15px_rgba(169,255,77,0.8)]" />
                    <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter">
                      Everything <span className="text-gray-600">/ 03</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {games.map((game, index) => (
                      <GameCard key={game.url} game={game} index={index} />
                    ))}
                  </div>
                </div>



                {games.length === 0 && !loading && (
                  <div className="text-center py-32 border border-dashed border-white/5">
                    <p className="text-gray-600 font-black font-orbitron tracking-widest text-xs uppercase animate-pulse">
                      SIGNAL LOST. NO DATA TRANSMITTED.
                    </p>
                  </div>
                )}

                <div id="load-more-trigger" className="h-32 flex flex-col justify-center items-center gap-4">
                  {loadingMore && (
                    <>
                      <Loader2 className="h-8 w-8 text-zappy-green animate-spin" />
                      <span className="text-[8px] font-black tracking-[0.4em] text-zappy-green uppercase">DOWNLOADING ASSETS...</span>
                    </>
                  )}
                  {!hasMore && games.length > 0 && (
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1 h-px bg-white/5" />
                      <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.8em]">END OF SIGNAL</p>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                  )}
                </div>

                {/* SEO CONTENT SECTION */}
                <div className="pt-24 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-zappy-green" />
                        <h2 className="text-xl font-black font-orbitron uppercase tracking-widest">
                          Zappy Games Protocol
                        </h2>
                      </div>
                      <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-medium capitalize">
                        <p>
                          Welcome to the nexus of browser gaming. <span className="text-white">Zappy Games</span> is engineered for players who demand instant action without the friction of downloads or accounts. Our library is curated by enthusiasts, for enthusiasts, featuring the latest in WebGL and HTML5 technology.
                        </p>
                        <p>
                          Whether you're looking for high-octane racing, hyper-casual clickers, or complex strategy missions, our interface is optimized for speed. Every transmission is direct, ensuring zero latency on any device.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="p-4 bg-white/5 border border-white/5">
                            <span className="text-zappy-green font-black block text-lg">1,000+</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest">Active Titles</span>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/5">
                            <span className="text-zappy-green font-black block text-lg">4K UHD</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest">Web Engine</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-zappy-green" />
                        <h2 className="text-xl font-black font-orbitron uppercase tracking-widest text-glow">
                          Frequent Comms
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {[
                          { q: "Is Zappy Games really free?", a: "Affirmative. Our protocol is open to all. No coins, no credits, just pure gameplay." },
                          { q: "Are mobile devices supported?", a: "Encoded for mobility. 99% of our library is responsive on iOS and Android devices." },
                          { q: "Do I need an account to save progress?", a: "Progress is cached locally in your data-packets (browser storage). No login required." }
                        ].map((faq, i) => (
                          <div key={i} className="group p-4 bg-[#0a0a0b] border border-white/5 hover:border-zappy-green/20 transition-all">
                            <h3 className="text-xs font-black uppercase text-white mb-2 group-hover:text-zappy-green transition-colors font-orbitron">
                              {faq.q}
                            </h3>
                            <p className="text-gray-500 text-xs font-medium">
                              {faq.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(169, 255, 77, 0.4);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .category-skew {
          transform: skew(-10deg);
        }
        .category-text-skew {
          transform: skew(10deg);
        }
      `}</style>
    </>
  )
}

