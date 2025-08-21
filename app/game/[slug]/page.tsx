"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Maximize, ArrowLeft, MessageCircle, Heart, Play } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { useAuth } from "@/contexts/auth-context";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { supabase } from "@/lib/supabase";
import { gameData } from "@/data/games";
import Head from "next/head";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
      const gameUrl = decodeURIComponent(params.slug as string);
    const game = gameData.games.find(
      (g) => g.name.toLowerCase().replace(/\s+/g, "-") === gameUrl
    );

  if (!game) {
    return {
      title: "Game Not Found | ZappyGames",
      description: "This game could not be found.",
    }
  }

  const title = `${game.name} - Play Online Free | ZappyGames`
  const description = `Play ${game.name} online for free at ZappyGames. Enjoy fun and exciting ${game.category} games without downloads.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://zappygames.online/game/${gameUrl}`,
    },
    openGraph: {
      title,
      description,
      url: `https://zappygames.online/game/${gameUrl}`,
      siteName: "ZappyGames",
      type: "website",
      images: [
        {
          url: game.image || "/placeholder.png",
          width: 1200,
          height: 630,
          alt: game.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [game.image || "/placeholder.png"],
    },
  }
}


export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [suggestedGames, setSuggestedGames] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const { user, isSupabaseConfigured } = useAuth();
  const { openModal } = useAuthModal();

  useEffect(() => {
    const gameUrl = decodeURIComponent(params.slug as string);
    const foundGame = gameData.games.find(
      (g) => g.name.toLowerCase().replace(/\s+/g, "-") === gameUrl
    );
    setGame(foundGame);

    if (foundGame) {
      const suggested = gameData.games
        .filter(
          (g) => g.category === foundGame.category && g.url !== foundGame.url
        )
        .slice(0, 4);
      setSuggestedGames(suggested);
    }

    if (foundGame && user && isSupabaseConfigured) {
      checkIfLiked(foundGame.url);
      trackRecentPlay(foundGame.url);
    }
  }, [params.slug, user, isSupabaseConfigured]);

  const checkIfLiked = async (gameId: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_id", gameId)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      // Not liked or error occurred
      setIsLiked(false);
    }
  };

  const trackRecentPlay = async (gameId: string) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      await supabase.from("recent_plays").upsert(
        {
          user_id: user.id,
          game_id: gameId,
        },
        {
          onConflict: "user_id,game_id",
        }
      );
    } catch (error) {
      console.error("Error tracking recent play:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      openModal("signin");
      return;
    }

    if (!isSupabaseConfigured) {
      alert(
        "Database not configured. Likes are not available in preview mode."
      );
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
        setIsLiked(false);
      } else {
        await supabase.from("likes").insert({
          user_id: user.id,
          game_id: game.url,
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    }

    setLiking(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const handleSuggestedGameClick = (gameUrl: string) => {
    router.push(`/game/${encodeURIComponent(gameUrl)}`);
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Game not found</div>
      </div>
    );
  }

  return (
    <>
      {/* <Head>
        <title>{game.name} - Play Online Free | ZappyGames</title>
        <meta
          name="description"
          content={`Play ${game.name} for free on ZappyGames. Enjoy exciting ${game.category} games and discover more similar games online.`}
        />
        <meta property="og:title" content={`${game.name} - Play Online Free`} />
        <meta property="og:description" content={`Play ${game.name} now!`} />
        <meta property="og:image" content={game.image || "/og-image.png"} />
        <meta
          property="og:url"
          content={`https://zappygames.online/game/${encodeURIComponent(
            game.name.toLowerCase().replace(/\s+/g, "-")
          )}`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://zappygames.online/game/${encodeURIComponent(
            game.name.toLowerCase().replace(/\s+/g, "-")
          )}`}
        />
      </Head> */}

      <div className="min-h-screen mt-28">
        {/* Header */}
        <div className="p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{game.name}</h1>
              <p className="text-gray-400 capitalize">{game.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
              } ${liking ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isLiked ? "Liked" : "Like"}</span>
            </button> */}

              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize className="h-4 w-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div
          className={`${isFullscreen ? "fixed inset-0 z-50 bg-black" : "p-4"}`}
        >
          <div className={`${isFullscreen ? "h-full" : "max-w-7xl mx-auto"}`}>
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 rotate-45" />
              </button>
            )}

            <div
              className={`${
                isFullscreen ? "h-full" : "aspect-video"
              } bg-black rounded-lg overflow-hidden`}
            >
              <iframe
                src={game.iframes[0].src}
                className="w-full h-full border-0"
                allowFullScreen
                title={game.name}
              />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {/* {!isFullscreen && (
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Comments</h2>
            </div>
            <CommentSection gameId={game.url} />
          </div>
        </div>
      )} */}

        {!isFullscreen && suggestedGames.length > 0 && (
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Play className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">
                    More {game.category} Games
                  </h2>
                </div>
                <div className="text-gray-400 text-sm">
                  Discover similar games you might enjoy
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedGames.map((suggestedGame) => (
                  <div
                    key={suggestedGame.url}
                    onClick={() => handleSuggestedGameClick(suggestedGame.url)}
                    className="group cursor-pointer bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={suggestedGame.image || "/placeholder.svg"}
                        alt={suggestedGame.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg">
                          <Play className="h-6 w-6 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                        {suggestedGame.name}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize mb-3">
                        {suggestedGame.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm font-medium">
                          Play Now
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 text-xs">
                          <Heart className="h-3 w-3" />
                          <span>{Math.floor(Math.random() * 1000) + 100}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
