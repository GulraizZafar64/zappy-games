import gamesJson from "./games.json";

export interface Game {
  name: string;
  url: string;
  category: string;
  image: string;
  iframe: string;
  rating?: number;
  plays?: number;
  description?: string;
  video_url?: string;
  rank?: number;
  badge?: "Hot" | "New" | "Featured" | "Top";
  seo_keywords?: string[];
  meta_description?: string;
  content_enhanced?: boolean;
  scraped_at?: string;
  source_url?: string;
  external_id?: string;
}

export interface GamesData {
  lastUpdated: string;
  source: string;
  games: Game[];
  categories: { name: string; url: string; type: string }[];
}

const games = gamesJson.games as Game[];

const categoryMap = new Map<string, { name: string; url: string; type: string }>();
games.forEach((g) => {
  const cat = g.category?.split(" ")[0] || "Other";
  const key = cat.toLowerCase();
  if (!categoryMap.has(key)) {
    categoryMap.set(key, {
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      url: key,
      type: "category",
    });
  }
});

export const gameData: GamesData = {
  lastUpdated: gamesJson.lastUpdated,
  source: gamesJson.source,
  games,
  categories: Array.from(categoryMap.values()),
};

export default gameData;
