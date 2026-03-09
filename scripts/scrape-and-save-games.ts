/**
 * Monthly game scraper: fetches latest games from a source, enriches via Gemini,
 * and saves only NEW games to DB (existing games by external_id are skipped).
 *
 * Run: npx tsx scripts/scrape-and-save-games.ts
 * Or schedule: 0 0 1 * * (first day of every month)
 *
 * Requires: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SCRAPE_SOURCE_URL (URL that returns JSON array of { name, image, url?, category? })
 */

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
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

interface EnrichedGame {
  name: string
  url: string
  category: string
  image: string
  description: string
  meta_description: string
  seo_keywords: string[]
  ranking_keywords: string[]
  content_enhanced: string
  badge?: string | null
  rank?: number | null
}

async function fetchRawGames(): Promise<RawGame[]> {
  if (SCRAPE_SOURCE_URL) {
    const res = await fetch(SCRAPE_SOURCE_URL)
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : data.games || []
  }
  // Fallback: read from local games.json and use as "source" (for demo / testing)
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

async function enrichWithGemini(raw: RawGame): Promise<EnrichedGame> {
  const { enrichGameWithGemini } = await import("../lib/gemini")
  return enrichGameWithGemini(
    {
      name: raw.name,
      image: raw.image,
      url: raw.url,
      category: raw.category,
      source_url: raw.source_url,
    },
    GEMINI_API_KEY!
  )
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY")
    process.exit(1)
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const rawGames = await fetchRawGames()
  console.log(`Fetched ${rawGames.length} raw games. Checking for existing in DB...`)

  const existing = await supabase.from("games").select("url, external_id")
  const existingUrls = new Set((existing.data || []).map((r) => r.url))
  const existingExternalIds = new Set(
    (existing.data || [])
      .map((r) => (r as any).external_id)
      .filter(Boolean)
  )

  const toInsert: RawGame[] = []
  for (const g of rawGames) {
    const slug = g.url || g.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const extId = g.source_url || slug
    if (existingUrls.has(slug) || existingExternalIds.has(extId)) continue
    toInsert.push(g)
  }

  console.log(`Found ${toInsert.length} new games to enrich and save.`)

  for (const raw of toInsert) {
    try {
      const enriched = await enrichWithGemini(raw)
      const slug = enriched.url || raw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      const row = {
        name: enriched.name,
        url: slug,
        category: enriched.category,
        image: enriched.image,
        iframe: `https://example.com/games/${slug}/embed`,
        rating: 4.5,
        plays: (enriched.rank || 50) * 100,
        description: enriched.description,
        meta_description: enriched.meta_description,
        seo_keywords: enriched.seo_keywords,
        content_enhanced: true,
        scraped_at: new Date().toISOString(),
        source_url: raw.source_url || null,
        external_id: raw.source_url || slug,
        badge: enriched.badge || null,
        rank: enriched.rank || null,
      }
      const { error } = await supabase.from("games").insert(row)
      if (error) {
        console.error("Insert error for", slug, error.message)
      } else {
        console.log("Inserted:", enriched.name)
      }
    } catch (e) {
      console.error("Failed for", raw.name, e)
    }
  }

  console.log("Scrape and save complete.")
}

main()
