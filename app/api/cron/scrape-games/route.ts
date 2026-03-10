import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Game } from "@/models/Game"
import { enrichGameWithGemini } from "@/lib/gemini"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const CRON_SECRET = process.env.CRON_SECRET

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authOk(request: Request): boolean {
  if (!CRON_SECRET) return true
  const auth = request.headers.get("authorization")
  return auth === `Bearer ${CRON_SECRET}`
}

export async function GET(request: Request) {
  if (!authOk(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return runScrape()
}

export async function POST(request: Request) {
  if (!authOk(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return runScrape()
}

async function runScrape() {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY" },
      { status: 500 }
    )
  }

  await connectDB()
  const sourceUrl = process.env.SCRAPE_SOURCE_URL

  let rawGames: { name: string; image: string; url?: string; category?: string; source_url?: string }[]
  if (sourceUrl) {
    try {
      const res = await fetch(sourceUrl)
      const data = await res.json()
      rawGames = Array.isArray(data) ? data : data.games || []
    } catch (e) {
      return NextResponse.json({ error: "Fetch source failed" }, { status: 500 })
    }
  } else {
    try {
      const gamesJson = await import("@/data/games.json").then((m: any) => m.default ?? m)
      rawGames = (gamesJson?.games || []).slice(0, 3).map((g: any) => ({
        name: g.name,
        image: g.image,
        url: g.url,
        category: g.category,
        source_url: g.source_url,
      }))
    } catch (e) {
      rawGames = []
    }
  }

  const existingGames = await Game.find({}).select("url external_id").lean()
  const existingUrls = new Set(existingGames.map((r: any) => r.url))
  const existingExt = new Set(existingGames.map((r: any) => r.external_id).filter(Boolean))

  let inserted = 0
  for (const raw of rawGames) {
    const slug = raw.url || raw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const extId = raw.source_url || slug
    if (existingUrls.has(slug) || existingExt.has(extId)) continue
    
    try {
      const enriched = await enrichGameWithGemini(raw, GEMINI_API_KEY)
      const finalSlug = enriched.url || slug
      
      await Game.create({
        name: enriched.name,
        url: finalSlug,
        category: enriched.category,
        image: enriched.image,
        iframe: `https://example.com/games/${finalSlug}/embed`,
        rating: 4.5,
        plays: (enriched.rank || 50) * 100,
        description: enriched.description,
        meta_description: enriched.meta_description,
        seo_keywords: enriched.seo_keywords,
        content_enhanced: enriched.content_enhanced,
        scraped_at: new Date(),
        source_url: raw.source_url || null,
        external_id: raw.source_url || finalSlug,
        badge: enriched.badge || null,
        rank: enriched.rank ?? null,
      })
      
      inserted++
      existingUrls.add(finalSlug)
      existingExt.add(extId)
    } catch (e) {
      console.error("Enrich/insert failed for", raw.name, e)
    }
  }

  return NextResponse.json({ ok: true, inserted, total: rawGames.length })
}
