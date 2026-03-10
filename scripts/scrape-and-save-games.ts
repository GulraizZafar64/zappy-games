import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"
import * as fs from "fs"
import * as path from "path"
import dotenv from "dotenv"

dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const SCRAPE_SOURCE_URL = process.env.SCRAPE_SOURCE_URL
const GAMES_JSON_PATH = path.join(process.cwd(), "data", "games.json")

interface RawGame {
  name: string
  image: string
  url?: string
  category?: string
  source_url?: string
}

async function fetchRawGames(): Promise<RawGame[]> {
  if (SCRAPE_SOURCE_URL) {
    const res = await fetch(SCRAPE_SOURCE_URL)
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : data.games || []
  }
  const json = JSON.parse(fs.readFileSync(GAMES_JSON_PATH, "utf-8"))
  const games = json.games || []
  return games.slice(0, 5).map((g: any) => ({
    name: g.name,
    image: g.image,
    url: g.url,
    category: g.category,
    source_url: g.source_url,
  }))
}

async function enrichWithGemini(raw: RawGame): Promise<any> {
  const { enrichGameWithGemini } = await import("../lib/gemini")
  return enrichGameWithGemini(raw, GEMINI_API_KEY!)
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY")
    process.exit(1)
  }

  await connectDB()
  const rawGames = await fetchRawGames()
  console.log(`Fetched ${rawGames.length} raw games. Checking for existing in DB...`)

  const existingGames = await Game.find({}).select("url external_id").lean()
  const existingUrls = new Set(existingGames.map((r: any) => r.url))
  const existingExt = new Set(existingGames.map((r: any) => r.external_id).filter(Boolean))

  let insertedCount = 0
  for (const raw of rawGames) {
    const slug = raw.url || raw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const extId = raw.source_url || slug
    if (existingUrls.has(slug) || existingExt.has(extId)) continue

    try {
      const enriched = await enrichWithGemini(raw)
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
      
      console.log("Inserted:", enriched.name)
      insertedCount++
      existingUrls.add(finalSlug)
      existingExt.add(extId)
    } catch (e: any) {
      console.error("Failed for", raw.name, e.message)
    }
  }

  console.log(`Scrape and save complete. Total inserted: ${insertedCount}`)
  process.exit(0)
}

main()
