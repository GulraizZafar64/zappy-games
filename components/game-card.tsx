"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Star, Flame, Sparkles, Trophy } from "lucide-react"
import { useState } from "react"

interface GameCardProps {
  game: {
    name: string
    url: string
    category: string
    image: string
    iframe?: string
    rating?: number
    plays?: number
    badge?: string
  }
  index: number
  isLiked?: boolean
  onLikeChange?: () => void
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall'
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400"

function formatPlays(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${n}`
}

const badgeConfig: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  Hot: { label: "HOT", icon: <Flame className="w-2.5 h-2.5" />, bg: "bg-orange-600", text: "text-white" },
  New: { label: "NEW", icon: <Sparkles className="w-2.5 h-2.5" />, bg: "bg-indigo-600", text: "text-white" },
  Featured: { label: "FEATURED", icon: <Star className="w-2.5 h-2.5" />, bg: "bg-amber-500", text: "text-black" },
  Top: { label: "TOP", icon: <Trophy className="w-2.5 h-2.5" />, bg: "bg-rose-600", text: "text-white" },
}

export function GameCard({ game, index, size = 'medium' }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageSrc, setImageSrc] = useState(game.image || DEFAULT_IMAGE)
  const [imageError, setImageError] = useState(false)

  const rating = game.rating ?? 4.0 + (index % 10) / 10
  const plays = game.plays ?? Math.floor(Math.random() * 8000) + index * 100
  const slug = game.url || game.name.toLowerCase().replace(/\s+/g, "-")
  const badge = game.badge ? badgeConfig[game.badge] : null

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      const fallback = `https://www.crazygames.com/game/${slug}/og-image.png`
      if (imageSrc !== fallback) {
        setImageSrc(fallback)
        setImageError(false)
      }
    }
  }

  const sizeClasses = {
    small: "aspect-square",
    medium: "aspect-[4/3]",
    large: "aspect-square md:aspect-[4/3] col-span-2 row-span-2",
    wide: "aspect-[2/1] col-span-2",
    tall: "aspect-[2/3] row-span-2",
  }

  return (
    <Link
      href={`/game/${slug}`}
      className={`${size === 'large' ? 'md:col-span-2 md:row-span-2' : size === 'wide' ? 'md:col-span-2' : size === 'tall' ? 'row-span-2' : ''}`}
    >
      <div
        className="group relative bg-[#0a0a0b] overflow-hidden border border-white/5 transition-all duration-500 hover:scale-[1.02] h-full flex flex-col"
        style={{
          animationDelay: `${index * 50}ms`,
          boxShadow: isHovered
            ? "0 0 0 1px rgba(34,49,18,0.6), 0 20px 60px rgba(34,49,18,0.25), 0 8px 24px rgba(0,0,0,0.6)"
            : "0 2px 8px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container */}
        <div className={`relative overflow-hidden bg-[#141416] flex-1 ${sizeClasses[size]}`}>
          <Image
            src={imageSrc}
            alt={game.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={handleImageError}
            unoptimized={imageSrc.includes('crazygames.com')}
          />

          {/* ─── HOVER OVERLAY ─── */}
          <div
            className={`absolute inset-0 transition-opacity duration-400 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            {/* Multi-layer dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
            {/* Deep forest green tint */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center bottom, rgba(34,49,18,0.55) 0%, transparent 70%)" }} />

            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(34,49,18,0.9), rgba(120,200,60,0.4), rgba(34,49,18,0.9), transparent)" }}
            />

            {/* Center play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Outer pulse ring */}
                <div
                  className="absolute inset-0 -m-3 rounded-full animate-ping"
                  style={{ background: "rgba(34,49,18,0.3)", animationDuration: "1.5s" }}
                />
                {/* Play circle */}
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #2d4219, #223112)",
                    boxShadow: "0 0 0 2px rgba(120,200,60,0.25), 0 8px 32px rgba(34,49,18,0.8)",
                  }}
                >
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              {/* "PLAY NOW" label */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-black tracking-[0.35em] uppercase px-2.5 py-1"
                  style={{
                    background: "linear-gradient(90deg, #223112, #2d4219)",
                    color: "rgba(180,255,100,0.95)",
                    border: "1px solid rgba(120,200,60,0.2)",
                    letterSpacing: "0.35em",
                  }}
                >
                  PLAY NOW
                </span>

                {/* Rating chip */}
                <div
                  className="flex items-center gap-1 px-2 py-1 backdrop-blur-md"
                  style={{
                    background: "rgba(10,10,11,0.85)",
                    border: "1px solid rgba(34,49,18,0.5)",
                  }}
                >
                  <Star className="w-2.5 h-2.5 fill-current" style={{ color: "#78c83c" }} />
                  <span className="text-[10px] font-black text-white font-orbitron">{rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Plays bar */}
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1 w-full rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (plays / 50000) * 100)}%`,
                      background: "linear-gradient(90deg, #223112, #4a7a20)",
                    }}
                  />
                </div>
                <span className="text-[8px] font-bold text-gray-400 shrink-0">{formatPlays(plays)}</span>
              </div>
            </div>

            {/* Scan line sweep animation */}
            <div
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(120,200,60,0.3), transparent)",
                animation: isHovered ? "scanline 2s linear infinite" : "none",
                top: "0",
              }}
            />
          </div>

          {/* ─── ALWAYS VISIBLE: top-left badges ─── */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            <span
              className="text-[8px] font-black px-2 py-0.5 uppercase tracking-[0.2em] backdrop-blur-sm"
              style={{
                background: "rgba(10,10,11,0.8)",
                color: "rgba(180,255,100,0.9)",
                borderLeft: "2px solid #223112",
              }}
            >
              {game.category}
            </span>
            {badge && (
              <span className={`flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {badge.label}
              </span>
            )}
          </div>

          {/* ─── ALWAYS VISIBLE: star rating (bottom right) ─── */}
          <div className={`absolute bottom-2 right-2 z-10 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
            <div
              className="flex items-center gap-1 px-2 py-0.5 backdrop-blur-md"
              style={{
                background: "rgba(10,10,11,0.85)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Star className="w-2.5 h-2.5 fill-current" style={{ color: "#78c83c" }} />
              <span className="text-[10px] font-black text-white font-orbitron">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* ─── Corner accent (top right, always) ─── */}
          <div
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background: "linear-gradient(225deg, rgba(34,49,18,0.5) 0%, transparent 60%)",
              borderBottom: "1px solid rgba(34,49,18,0.4)",
              borderLeft: "1px solid rgba(34,49,18,0.4)",
            }}
          />
        </div>

        {/* ─── CARD FOOTER ─── */}
        <div
          className="p-3 border-t flex-shrink-0"
          style={{
            background: "linear-gradient(to bottom, #141416, #0e0e10)",
            borderColor: isHovered ? "rgba(34,49,18,0.5)" : "rgba(255,255,255,0.05)",
            transition: "border-color 0.4s",
          }}
        >
          <h3
            className="font-bold text-sm line-clamp-1 font-orbitron uppercase tracking-tighter transition-colors duration-300"
            style={{ color: isHovered ? "#78c83c" : "#ffffff" }}
          >
            {game.name}
          </h3>
          <div className="flex items-center mt-1 text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <div
                className="h-1 w-1 animate-pulse"
                style={{ background: "#223112", boxShadow: "0 0 4px rgba(34,49,18,0.9)" }}
              />
              {formatPlays(plays)} ACTIVE
            </span>
          </div>
        </div>

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            border: "1px solid rgba(34,49,18,0.7)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>

      {/* Keyframes for scanline */}
      <style jsx>{`
        @keyframes scanline {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </Link>
  )
}
