"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Maximize, ArrowLeft, Play, Star, Share2, Loader2, ChevronDown } from "lucide-react"
import { GameCard } from "@/components/game-card"
import { CommentSection } from "@/components/comment-section"

type Game = {
  _id?: string
  name: string
  url: string
  category: string
  image: string
  iframe: string
  video_url?: string
  description?: string
  content_enhanced?: string
  rating?: number
  plays?: number
  badge?: string
  rank?: number
}

export default function GameDetailPageMain() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [allGames, setAllGames] = useState<Game[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slug = decodeURIComponent((params.slug as string) || "")
    setLoading(true)

    // Parallel fetch: specific game and recommendations
    Promise.all([
      fetch(`/api/games/${slug}`).then(r => r.json()),
      fetch("/api/games?limit=50").then(r => r.json())
    ]).then(([gameData, listData]) => {
      if (gameData.game) {
        setGame(gameData.game)
      } else {
        const games = listData.games || []
        const found = games.find(
          (g: Game) =>
            g.url === slug || g.name.toLowerCase().replace(/\s+/g, "-") === slug
        )
        setGame(found || null)
      }
      // Randomize allGames for better discovery
      const shuffled = [...listData.games || []].sort(() => Math.random() - 0.5)
      setAllGames(shuffled)
    })
      .catch(err => {
        console.error("Error fetching game data:", err)
      })
      .finally(() => setLoading(false))
  }, [params.slug])

  const sidebarGames = allGames.slice(0, 15)
  const moreGames = allGames.filter(g => g.url !== game?.url).slice(15, 30)

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])
  const iframeSrc = game?.iframe || ""

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-zappy-green animate-spin" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Game Not Found</h1>
          <p className="text-gray-400 mb-8">We couldn't find the game you're looking for.</p>
          <button onClick={() => router.push("/")} className="bg-zappy-green text-black px-6 py-2 rounded-lg font-bold">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-zappy-green transition-colors">Games</Link>
          <span className="text-gray-700">»</span>
          <span className="hover:text-zappy-green transition-colors cursor-pointer">{game.category}</span>
          <span className="text-gray-700">»</span>
          <span className="text-gray-300 font-medium">{game.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            <div
              ref={containerRef}
              className={`relative ${isFullscreen ? "bg-black w-screen h-screen flex items-center justify-center" : "aspect-video overflow-hidden border border-white/5 shadow-2xl bg-[#141416]"}`}
            >
              {iframeSrc ? (
                <>
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={game.name}
                    allow="autoplay; gaming; fullscreen"
                  />
                  {/* Bottom Overlay to mask external footer */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 z-100 bg-[#0a0a0b] border-t border-white/10 flex items-center px-4 pointer-events-none z-10">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-zappy-green animate-pulse" />
                      <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase font-orbitron">
                        {game.name}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#141416]">
                  <Play className="h-16 w-16 text-zappy-green opacity-20" />
                  <p className="text-gray-500 font-orbitron text-xs">OFFLINE</p>
                </div>
              )}
              {iframeSrc && (
                <button
                  onClick={toggleFullscreen}
                  className={`absolute flex justify-center items-center top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md cursor-pointer text-white hover:text-gray-500 transition-all shadow-lg group ${isFullscreen ? "opacity-0 hover:opacity-100" : ""}`}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  <Maximize className={`h-4 w-4 ${isFullscreen ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            {/* Game Info Bar */}
            <div className="bg-[#141416] p-6 border border-white/5 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight font-orbitron uppercase tracking-tighter">
                    {game.name}
                  </h1>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-zappy-green font-medium">
                      <Star className="h-3 w-3 fill-zappy-green" />
                      {game.rating?.toFixed(1) || "8.7"}
                    </span>
                    <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">
                      {(game.plays || 23237).toLocaleString()} plays
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1b1b1e] hover:bg-[#252528] text-white px-5 py-3 transition-all border border-white/5 font-bold uppercase text-xs tracking-widest">
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 bg-[#a9ff4d] hover:bg-[#c1ff7a] text-black px-8 py-3 transition-all font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-zappy-green/10">
                    <Play className="h-3 w-3 fill-black" />
                    Engage
                  </button>
                </div>
              </div>

              {/* Stats Table */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-10 pt-8 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Category</p>
                  <p className="text-xs text-zappy-green font-bold uppercase font-orbitron">{game.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Rating</p>
                  <p className="text-xs text-white font-bold font-orbitron">{game.rating || "8.5"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Platform</p>
                  <p className="text-xs text-white font-bold uppercase font-orbitron">Web</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Stability</p>
                  <p className="text-xs text-white font-bold font-orbitron">99.9%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">Technology</p>
                  <p className="text-xs text-white font-bold font-orbitron uppercase">HTML5</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {(game.description || game.content_enhanced) && (
              <div className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zappy-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-[#0a0a0b] p-8 md:p-12 border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-[0.3em] font-orbitron">
                      <div className="h-6 w-1 bg-zappy-green shadow-[0_0_10px_rgba(169,255,77,0.8)]" />
                      Mission Briefing
                    </h2>
                    <div className="hidden md:flex gap-1">
                      <div className="h-1 w-1 bg-white/20" />
                      <div className="h-1 w-4 bg-zappy-green" />
                    </div>
                  </div>

                  <div className="text-gray-400 leading-relaxed font-medium text-sm md:text-base selection:bg-zappy-green selection:text-black">
                    {game.content_enhanced ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: game.content_enhanced }}
                        className="prose prose-invert prose-sm max-w-none prose-p:mb-6 prose-headings:text-zappy-green prose-headings:font-orbitron prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-white prose-li:text-gray-300 capitalize"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap font-sans opacity-90 first-letter:text-3xl first-letter:font-black first-letter:text-zappy-green first-letter:mr-1 capitalize">
                        {game.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-zappy-green uppercase tracking-[0.5em] font-orbitron">Operation Manual</h3>
                      <ul className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                        <li className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-zappy-green" />
                          WASD / ARROWS - MANEUVER
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-zappy-green" />
                          SPACEBAR - INTERACT / ACTION
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-zappy-green" />
                          ESC - PAUSE PROTOCOL
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] font-orbitron">System Compatibility</h3>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                        ZAPPY CLOUD ENGINE v4.2 // FULLY OPTIMIZED FOR DESKTOP, TABLET, AND MOBILE INTERFACES. NO EXTERNAL PLUGINS REQUIRED.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Section with better UI */}
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-zappy-green shadow-[0_0_15px_rgba(169,255,77,0.8)]" />
                  <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter">Related Combatants</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {moreGames.map((g, i) => (
                  <GameCard key={g.url} game={g} index={i} size="medium" />
                ))}
              </div>
            </div>

            <div className="mt-20">
              <CommentSection gameUrl={game.url} />
            </div>

            {/* END OF PAGE CONTENT */}
            <div className="mt-32 pt-16 border-t border-white/5 space-y-12 pb-24 text-center md:text-left">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black font-orbitron uppercase tracking-tighter mb-6 text-glow">
                  Why Play <span className="text-zappy-green">{game.name}</span> on Zappy?
                </h2>
                <div className="space-y-6 text-gray-500 text-sm font-medium leading-loose uppercase tracking-wide">
                  <p>
                    Experience <span className="text-white">{game.name}</span> like never before. Zappy Games provides a dedicated gateway for zero-latency gameplay. We strip away the bloat of traditional gaming sites, delivering just the code and the fun directly to your browser.
                  </p>
                  <p>
                    Our platform is built on the <span className="text-zappy-green">Gamer Protocol</span>, ensuring every click and keyboard press is registered with millisecond precision. Join thousands of other players today in the ultimate browser-based arena.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-4 w-1 bg-zappy-green animate-pulse" />
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] font-orbitron shadow-[0_0_10px_rgba(255,255,255,0.1)]">Deployment Log</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {sidebarGames.map((g, i) => (
                <GameCard key={g.url} game={g} index={i} size="medium" />
              ))}
            </div>

            <button className="w-full bg-[#141416] hover:bg-zappy-green hover:text-black border border-white/5 py-4 font-black transition-all text-[10px] flex items-center justify-center gap-3 uppercase tracking-[0.4em] font-orbitron group">
              INITIATE LIST EXPANSION
              <ChevronDown className="h-3 w-3 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
