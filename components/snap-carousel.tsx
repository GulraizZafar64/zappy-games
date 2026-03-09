"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { Shuffle, ChevronRight, ChevronLeft, Zap, Loader2, RefreshCw } from "lucide-react"

type Game = {
    name: string
    url: string
    category: string
    image: string
    rating?: number
    plays?: number
    badge?: string
}

const BATCH = 20

function formatPlays(n?: number) {
    if (!n) return "0"
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return `${n}`
}

export function SnapCarousel() {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)
    const [batchNum, setBatchNum] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchRandom = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/games?random=true&limit=${BATCH}`)
            const data = await res.json()
            const newGames: Game[] = data.games || []

            setGames(newGames)
            setFetched(true)
            setBatchNum(prev => prev + 1)

            // Snap back to start after new batch loads
            setTimeout(() => {
                scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" })
            }, 100)
        } catch (e) {
            console.error("Snap carousel fetch error", e)
        } finally {
            setLoading(false)
        }
    }, [])

    const scrollBy = (dir: "left" | "right") => {
        const el = scrollRef.current
        if (!el) return
        const cardWidth = el.firstElementChild?.clientWidth || 200
        el.scrollBy({ left: dir === "right" ? cardWidth * 3 : -cardWidth * 3, behavior: "smooth" })
    }

    useEffect(() => {
        fetchRandom()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-zappy-green shadow-[0_0_15px_rgba(169,255,77,0.8)]" />
                    <div>
                        <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter">
                            Random <span className="text-gray-600">/ Discover</span>
                        </h2>
                        {fetched && (
                            <p className="text-[9px] font-bold tracking-[0.3em] text-gray-600 uppercase">
                                Batch #{batchNum} · {BATCH} random games
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Scroll arrows */}
                    {fetched && (
                        <>
                            <button
                                onClick={() => scrollBy("left")}
                                className="w-9 h-9 flex items-center justify-center border border-white/10 bg-[#141416] hover:border-zappy-green/40 hover:bg-zappy-green/5 text-gray-500 hover:text-zappy-green transition-all"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scrollBy("right")}
                                className="w-9 h-9 flex items-center justify-center border border-white/10 bg-[#141416] hover:border-zappy-green/40 hover:bg-zappy-green/5 text-gray-500 hover:text-zappy-green transition-all"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* Fetch / Reload button */}
                    <button
                        onClick={fetchRandom}
                        disabled={loading}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-zappy-green hover:bg-zappy-green/90 text-white font-black text-[10px] tracking-[0.2em] uppercase font-orbitron transition-all disabled:opacity-60 shadow-[0_0_20px_rgba(169,255,77,0.3)] hover:shadow-[0_0_30px_rgba(169,255,77,0.5)]"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : fetched ? (
                            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                        ) : (
                            <Zap className="w-3.5 h-3.5" />
                        )}
                        <span>{loading ? "Loading..." : fetched ? "New Batch" : "Fetch Games"}</span>
                    </button>
                </div>
            </div>

            {/* Carousel / Empty state */}
            {!fetched && !loading ? (
                /* Pre-fetch empty state */
                <div
                    className="relative flex items-center justify-center h-48 border border-dashed border-white/5 bg-[#0d0d0f] cursor-pointer group"
                    onClick={fetchRandom}
                >
                    <div className="text-center space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-zappy-green/10 border border-zappy-green/20 flex items-center justify-center group-hover:bg-zappy-green/20 transition-all">
                            <Shuffle className="w-6 h-6 text-zappy-green" />
                        </div>
                        <p className="text-[10px] font-black font-orbitron uppercase tracking-[0.3em] text-gray-600 group-hover:text-zappy-green transition-colors">
                            Click to discover 20 random games
                        </p>
                    </div>
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zappy-green/30" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zappy-green/30" />
                </div>
            ) : loading && games.length === 0 ? (
                /* First-time loading skeleton */
                <div className="flex gap-3 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-none w-40 h-52 bg-[#141416] border border-white/5 animate-pulse rounded-sm"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            ) : (
                /* Snap scroll carousel */
                <div className="relative">
                    {/* Left fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
                    {/* Right fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />

                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
                        style={{
                            scrollSnapType: "x mandatory",
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {games.map((game, idx) => (
                            <Link
                                key={`${game.url}-${batchNum}-${idx}`}
                                href={`/game/${game.url}`}
                                className="group flex-none w-40 sm:w-44 md:w-48 relative bg-[#141416] border border-white/5 hover:border-zappy-green/40 transition-all duration-300 overflow-hidden"
                                style={{ scrollSnapAlign: "start" }}
                            >
                                {/* Game image */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        onError={(e) => {
                                            const el = e.target as HTMLImageElement
                                            el.src = "/placeholder-game.png"
                                        }}
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Badge */}
                                    {game.badge && (
                                        <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${game.badge === "Hot" ? "bg-red-500 text-white" :
                                            game.badge === "New" ? "bg-zappy-green text-black" :
                                                "bg-white/20 text-white"
                                            }`}>
                                            {game.badge}
                                        </div>
                                    )}

                                    {/* Category pill */}
                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-[7px] font-black uppercase tracking-wider text-gray-300 border border-white/10">
                                        {game.category}
                                    </div>

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 rounded-full bg-zappy-green flex items-center justify-center shadow-[0_0_20px_rgba(169,255,77,0.6)]">
                                            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-black ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-2.5 space-y-1">
                                    <p className="text-white text-[11px] font-bold leading-tight truncate group-hover:text-zappy-green transition-colors">
                                        {game.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <span className="text-[9px]">⭐ {game.rating?.toFixed(1) || "4.5"}</span>
                                        <span className="text-[9px]">·</span>
                                        <span className="text-[9px]">{formatPlays(game.plays)} plays</span>
                                    </div>
                                </div>

                                {/* Bottom green line on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zappy-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        ))}

                        {/* Reload card at end */}
                        <div
                            onClick={fetchRandom}
                            className="flex-none w-40 sm:w-44 md:w-48 border border-dashed border-white/5 hover:border-zappy-green/30 bg-[#0d0d0f] hover:bg-zappy-green/5 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all"
                            style={{ scrollSnapAlign: "start" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-zappy-green/10 border border-zappy-green/20 flex items-center justify-center group-hover:bg-zappy-green/20 transition-all">
                                <RefreshCw className="w-5 h-5 text-zappy-green group-hover:rotate-180 transition-transform duration-500" />
                            </div>
                            <p className="text-[9px] font-black tracking-[0.2em] text-gray-600 group-hover:text-zappy-green uppercase text-center px-2 transition-colors font-orbitron">
                                Load More Random Games
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch indicator dots */}
            {fetched && batchNum > 1 && (
                <div className="flex justify-center gap-1.5">
                    {Array.from({ length: Math.min(batchNum, 8) }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all ${i === batchNum - 1 ? "w-6 bg-zappy-green" : "w-1 bg-white/10"
                                }`}
                        />
                    ))}
                    {batchNum > 8 && (
                        <span className="text-[8px] font-black text-gray-600 self-center">+{batchNum - 8}</span>
                    )}
                </div>
            )}
        </div>
    )
}
