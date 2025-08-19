"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { GameCard } from "@/components/game-card";
import { Clock, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { gameData } from "@/data/games";

export default function RecentGamesPage() {
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedGames, setLikedGames] = useState<string[]>([]);
  const [dbError, setDbError] = useState<string | null>(null); // New state for database errors
  const { user, isSupabaseConfigured } = useAuth();

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchRecentGames();
      fetchLikedGames();
    } else {
      setLoading(false);
      if (!isSupabaseConfigured) {
        setDbError(
          "Recent games are not available. Please ensure your Supabase database is set up and tables are created."
        );
      }
    }
  }, [user, isSupabaseConfigured]);

  const fetchRecentGames = async () => {
    if (!user || !isSupabaseConfigured) return;

    setLoading(true);
    setDbError(null); // Clear previous errors

    try {
      const { data, error } = await supabase
        .from("recent_plays")
        .select("game_id, played_at")
        .eq("user_id", user.id)
        .order("played_at", { ascending: false });

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setDbError(
            "Recent games are not available. Please ensure your Supabase database is set up and tables are created (run the SQL scripts)."
          );
        } else {
          setDbError("Failed to load recent games. Please try again later.");
        }
        throw error;
      }

      if (data) {
        // Match recent game IDs with game data
        const recentGameData = data
          .map((play) => {
            const game = gameData.games.find((g) => g.url === play.game_id);
            return game ? { ...game, played_at: play.played_at } : null;
          })
          .filter(Boolean);

        setRecentGames(recentGameData);
      }
    } catch (error) {
      console.error("Error fetching recent games:", error);
    }

    setLoading(false);
  };

  const fetchLikedGames = async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data } = await supabase
        .from("likes")
        .select("game_id")
        .eq("user_id", user.id);

      if (data) {
        setLikedGames(data.map((like) => like.game_id));
      }
    } catch (error) {
      console.error("Error fetching liked games:", error);
    }
  };

  const formatPlayTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Clock className="h-16 w-16 text-gray-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4 font-orbitron">
            Sign In Required
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            You need to sign in to view your recent games.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse"
              >
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
    );
  }

  function setImageError(arg0: boolean) {
    throw new Error("Function not implemented.");
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
                <Clock className="h-10 w-10 text-blue-500" />
                <span>Recent Games</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {recentGames.length} game{recentGames.length !== 1 ? "s" : ""}{" "}
                you've played recently
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
        {recentGames.length === 0 && !dbError ? (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No Recent Games
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Start playing games to see your recent activity here!
            </p>
            <Link
              href="/games"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <span>Browse Games</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {recentGames.map((game, index) => (
    <div
  key={`${game.url}-${game.played_at}`}
  className="flex items-center space-x-6 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30"
>
  <div className="flex-shrink-0 w-32 h-32 relative overflow-hidden rounded-lg">
    <Image
      src={
        game.image ||
        "/placeholder.svg?height=300&width=300&query=game"
      }
      alt={game.name}
      fill
      className="object-cover transition-all duration-500 hover:scale-110 hover:brightness-110"
      onError={(e) => {
        e.currentTarget.src = "/placeholder.svg?height=300&width=300&query=game";
      }}
    />
  </div>
  <div className="flex-1">
    <h3 className="text-xl font-bold text-white mb-2">
      {game.name}
    </h3>
    <p className="text-gray-400 mb-2 capitalize">
      {game.category}
    </p>
    <p className="text-purple-400 text-sm">
      Played {formatPlayTime(game.played_at)}
    </p>
  </div>
  <Link
    href={`/game/${encodeURIComponent(game.url)}`}
    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
  >
    Play Again
  </Link>
</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
