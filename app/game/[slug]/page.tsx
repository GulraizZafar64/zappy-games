import { gameData } from "@/data/games";
import { Metadata } from "next";
import GameDetailPageMain from "./game-detail";

// Generate metadata dynamically based on the slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params;
 const gameUrl = decodeURIComponent(slug);
 const game = gameData.games.find(
   (g) => g.name.toLowerCase().replace(/\s+/g, "-") === gameUrl
 );

 if (!game) {
   return {
     title: "Game Not Found | ZappyGames",
     description: "The requested game could not be found.",
   };
 }

 return {
   title: `${game.name} - Play Online Free | ZappyGames`,
   description: `Play ${game.name} for free on ZappyGames. Enjoy exciting ${game.category} games and discover more similar games online.`,
   metadataBase: new URL("https://zappygames.online"),
   alternates: {
     canonical: `/game/${encodeURIComponent(game.name.toLowerCase().replace(/\s+/g, "-"))}`,
   },
 };
}

export default function GameDetailPage() {
 return <GameDetailPageMain />;
}