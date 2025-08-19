"use client";

import { useState, useEffect } from "react";
import { GameCard } from "@/components/game-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchBar } from "@/components/search-bar";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { gameData } from "@/data/games";

export default function AllGamesPage() {
  const [games, setGames] = useState(gameData.games);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedGames, setLikedGames] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(20);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLikedGames();
    }
  }, [user]);

  const fetchLikedGames = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("likes")
      .select("game_id")
      .eq("user_id", user.id);

    if (data) {
      setLikedGames(data.map((like) => like.game_id));
    }
  };

  useEffect(() => {
    let filtered = gameData.games;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (game) => game.category.split(" ")[0] === selectedCategory
      );
    } else {
      filtered = gameData.games.slice(0, 30);
    }

    if (searchTerm) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setGames(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(games.length / gamesPerPage);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-orbitron">
            All Games
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}
              Collection
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore our complete library of {gameData.games.length} amazing
            games
          </p>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Filters */}
        <CategoryFilter
          categories={gameData.categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-12">
          {currentGames.map((game, index) => (
            <GameCard
              key={game.url}
              game={game}
              index={index}
              isLiked={likedGames.includes(game.url)}
              onLikeChange={fetchLikedGames}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-400 text-xl mb-2">
              No games found matching your criteria.
            </p>
            <p className="text-gray-500">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
