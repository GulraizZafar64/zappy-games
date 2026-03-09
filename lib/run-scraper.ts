/**
 * Scrape games (iframe, image, video, content), enrich with AI, save to MongoDB.
 * Only inserts new games (by url / external_id). Called on server start and by scheduler.
 * Uses JSON import for seed data to avoid Node-only fs/path in bundle.
 */

import { connectDB } from "./mongodb"
import { Game } from "@/models/Game"
import { enrichGame } from "./ai-enrich"
import seedGames from "@/data/games.json"
const SCRAPE_SOURCE_URL = process.env.SCRAPE_SOURCE_URL

async function fetchRawGames(): Promise<
  { name: string; image: string; url?: string; category?: string; iframe?: string; video_url?: string; source_url?: string }[]
> {
  const games = (seedGames as any).games || []
  return games.map((g: any) => ({
    name: g.name,
    image: g.image || "",
    url: g.url,
    category: g.category,
    iframe: g.iframe,
    video_url: g.video_url,
    source_url: g.source_url || g.url,
  }))
}

function slugify(text: string): string {
  if (!text) return ""
  // If it's a URL, get the last part
  if (text.includes("://") || text.includes("/")) {
    try {
      const url = new URL(text)
      text = url.pathname.split("/").filter(Boolean).pop() || text
    } catch {
      text = text.split("/").filter(Boolean).pop() || text
    }
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function runScraper(): Promise<{ inserted: number; total: number }> {
  const conn = await connectDB()
  if (!conn) {
    console.warn("[Scraper] MongoDB not configured, skipping.")
    return { inserted: 0, total: 0 }
  }

  const rawGames = await fetchRawGames()
  if (rawGames.length === 0) {
    console.warn("[Scraper] No raw games to process.")
    return { inserted: 0, total: 0 }
  }

  const existing = await Game.find({}).select("url external_id").lean()
  const existingUrls = new Set(existing.map((r) => r.url))
  const existingExt = new Set(
    existing.map((r) => (r as any).external_id).filter(Boolean)
  )

  const toProcess = rawGames.filter((g) => {
    const slug = slugify(g.url || g.name)
    const extId = g.source_url || slug
    return slug && !existingUrls.has(slug) && !existingExt.has(extId)
  }).slice(0, 10) // Process max 10 at a time to stay safe

  const hasAI = !!(
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY_1 ||
    process.env.ANTHROPIC_API_KEY
  )

  let inserted = 0
  let aiFailures = 0
  const MAX_AI_FAILURES = 2
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1550745165-9bc0b252723f?auto=format&fit=crop&q=80&w=400"

  for (const raw of toProcess) {
    const slug = slugify(raw.url || raw.name)
    if (!slug || existingUrls.has(slug)) continue

    try {
      let insertedWithAI = false
      if (hasAI && aiFailures < MAX_AI_FAILURES) {
        try {
          console.log("[Scraper] Enriching with AI:", raw.name)
          const enriched = await enrichGame({
            name: raw.name,
            image: raw.image || DEFAULT_IMAGE,
            url: raw.url,
            category: raw.category,
            source_url: raw.source_url,
            iframe: raw.iframe,
            video_url: raw.video_url,
          })
          const finalSlug = enriched.url || slug

          await Game.create({
            name: enriched.name,
            url: finalSlug,
            category: enriched.category,
            image: enriched.image || raw.image || DEFAULT_IMAGE,
            iframe: enriched.iframe || raw.iframe || `https://example.com/games/${finalSlug}/embed`,
            video_url: enriched.video_url || raw.video_url,
            rating: 4.5,
            plays: (enriched.rank || 50) * 100,
            description: enriched.description,
            meta_description: enriched.meta_description,
            seo_keywords: enriched.seo_keywords,
            content_enhanced: enriched.content_enhanced,
            scraped_at: new Date(),
            source_url: raw.source_url,
            external_id: raw.source_url || finalSlug,
            badge: enriched.badge || undefined,
            rank: enriched.rank ?? undefined,
          })
          insertedWithAI = true
          existingUrls.add(finalSlug)
        } catch (enrichError) {
          aiFailures++
          console.warn(`[Scraper] AI enrichment failed for "${raw.name}". (${aiFailures}/${MAX_AI_FAILURES})`)
          if (aiFailures >= MAX_AI_FAILURES) {
            console.warn("[Scraper] Max AI failures reached. Falling back to raw data for remaining games in this run.")
          }
        }
      }

      if (!insertedWithAI) {
        await Game.create({
          name: raw.name,
          url: slug,
          category: raw.category || "other",
          image: raw.image || DEFAULT_IMAGE,
          iframe: raw.iframe || `https://example.com/games/${slug}/embed`,
          video_url: raw.video_url,
          rating: 4.5,
          plays: 5000,
          scraped_at: new Date(),
          source_url: raw.source_url,
          external_id: raw.source_url || slug,
        })
        existingUrls.add(slug)
      }

      inserted++
      existingExt.add(raw.source_url || slug)
    } catch (e) {
      const msg = (e as any).message || ""
      if (msg.includes("E11000")) {
        console.warn("[Scraper] Duplicate game skipped during insert:", raw.name)
      } else {
        console.error("[Scraper] Failed to save game", raw.name, msg)
      }
    }
  }

  console.log("[Scraper] Done. Inserted:", inserted, "Total identified:", rawGames.length)
  return { inserted, total: rawGames.length }
}
