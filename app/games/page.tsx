import { Metadata } from "next";
import AllGamesMainPage from "./games";
import { gameData } from "@/data/games";

export const metadata: Metadata = {
 title: "All Free Online Games - Play Now | ZappyGames",
 description: `Browse and play ${gameData.games.length}+ free online games on ZappyGames. Discover action, puzzle, adventure, and more categories.`,
 metadataBase: new URL("https://zappygames.online"),
 alternates: {
   canonical: "/games",
 },
}

export default function AllGamesPage() {
 return (
   <AllGamesMainPage/>
 );
}