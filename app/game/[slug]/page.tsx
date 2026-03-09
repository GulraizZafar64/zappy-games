import { connectDB } from "@/lib/mongodb"
import { Game } from "@/models/Game"
import { Metadata } from "next"
import GameDetailPageMain from "./game-detail"

// Generate metadata dynamically based on the slug from MongoDB
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gameSlug = decodeURIComponent(slug)

  try {
    await connectDB()
    const game = await Game.findOne({ url: gameSlug }).select(
      "name category meta_description seo_keywords image"
    ).lean()

    if (!game) {
      return {
        title: "Game Not Found | ZappyGames",
        description: "The requested game could not be found.",
        robots: { index: false, follow: false },
      }
    }

    const g = game as any
    const gameTitle = `Play ${g.name} Online Free | ZappyGames`
    const gameDesc =
      g.meta_description ||
      `Play ${g.name} for free on ZappyGames. Enjoy exciting ${g.category} games with no download required.`
    const canonicalUrl = `/game/${gameSlug}`
    const fullUrl = `https://zappygames.online/game/${gameSlug}`

    return {
      title: gameTitle,
      description: gameDesc,
      keywords: g.seo_keywords ?? [],
      metadataBase: new URL("https://zappygames.online"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: gameTitle,
        description: gameDesc,
        url: fullUrl,
        siteName: "ZappyGames",
        images: g.image
          ? [{ url: g.image, width: 400, height: 300, alt: g.name }]
          : [{ url: "/og-image.png", width: 1200, height: 630, alt: "ZappyGames" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: gameTitle,
        description: gameDesc,
        images: g.image ? [g.image] : ["/og-image.png"],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1 },
      },
    }
  } catch {
    return {
      title: "Game Not Found | ZappyGames",
      description: "The requested game could not be found.",
    }
  }
}

export default function GameDetailPage() {
  return <GameDetailPageMain />
}