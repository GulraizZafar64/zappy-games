"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Play, Star, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { supabase } from "@/lib/supabase";

interface Game {
  name: string;
  url: string;
  category: string;
  image: string;
  iframe: string;
  rating?: number;
  plays?: number;
}

interface GameCardProps {
  game: any;
  index: number;
  isLiked: boolean;
  onLikeChange: () => void;
}

export function GameCard({
  game,
  index,
  isLiked,
  onLikeChange,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [liking, setLiking] = useState(false);
  const { user, isSupabaseConfigured } = useAuth();
  const { openModal } = useAuthModal();

  const rating = game.rating || 4.0 + Math.random() * 1.0;
  const plays = game.plays || Math.floor(Math.random() * 10000) + 1000;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openModal("signin");
      return;
    }

    if (!isSupabaseConfigured) {
      return;
    }

    setLiking(true);

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("game_id", game.url);
      } else {
        await supabase.from("likes").insert({
          user_id: user.id,
          game_id: game.url,
        });
      }
      onLikeChange();
    } catch (error) {
      console.error("Error toggling like:", error);
    }

    setLiking(false);
  };

  const handleGameClick = async () => {
    if (user && isSupabaseConfigured) {
      try {
        // Track recent play
        await supabase.from("recent_plays").upsert(
          {
            user_id: user.id,
            game_id: game.url,
          },
          {
            onConflict: "user_id,game_id",
          }
        );
      } catch (error) {
        console.error("Error tracking recent play:", error);
      }
    }
  };

  return (
    <Link
     href={`/game/${game.name.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={handleGameClick}
    >
      <div
        className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm animate-in fade-in duration-700"
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="aspect-square relative overflow-hidden">
          {!imageError ? (
            <Image
              src={
                game.image || "/placeholder.svg?height=300&width=300&query=game"
              }
              alt={game.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 flex items-center justify-center">
              <span className="text-white text-4xl font-bold font-orbitron">
                {game.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Overlay with enhanced effects */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 transform transition-all duration-300 hover:scale-110 shadow-2xl shadow-purple-500/50">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/70 backdrop-blur-sm text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">
              {game.category.toUpperCase()}
            </span>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">
              {rating?.toFixed(1)}
            </span>
          </div>

          {/* Like button */}
          {/* <button
            onClick={handleLike}
            disabled={liking || !isSupabaseConfigured}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 flex justify-center items-center cursor-pointer ${
              isLiked
                ? "bg-red-500/80 text-white"
                : "bg-black/70 text-gray-300 hover:text-red-400"
            } ${!isSupabaseConfigured ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </button> */}
        </div>

        <div className="p-5">
          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors duration-300">
            {game.name}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{plays.toLocaleString()} plays</span>
            </div>
            <span className="capitalize font-medium">{game.category}</span>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
      </div>
    </Link>
  );
}
