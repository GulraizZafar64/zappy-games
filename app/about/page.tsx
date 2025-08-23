import { ArrowLeft, Users, Target, Zap, Heart } from "lucide-react"
import Head from "next/head"
import Link from "next/link"
import AboutUsPage from './about-us'
import { Metadata } from "next"
export const metadata: Metadata = {
 title: "About ZappyGames - Free Online Gaming",
 description: "Learn more about ZappyGames - your ultimate destination for free browser-based online games across all genres.",
 metadataBase: new URL("https://zappygames.online"),
 alternates: {
   canonical: "/about",
 },
}
export default function AboutPage() {
  return (
    <AboutUsPage />
  )
}