/**
 * Vercel Cron: run monthly to scrape latest games, enrich with Gemini, save only new to DB.
 * Set CRON_SECRET in env and call: GET/POST with header Authorization: Bearer <CRON_SECRET>
 */
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { enrichGameWithGemini } from "@/lib/gemini"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY or Supabase config" },
      { status: 500 }
    )
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
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
    const gamesJson = await import("@/data/games.json").then((m: any) => m.default ?? m)
    rawGames = (gamesJson?.games || []).slice(0, 3).map((g: any) => ({
      name: g.name,
      image: g.image,
      url: g.url,
      category: g.category,
      source_url: g.source_url,
    }))
  }

  const { data: existingRows } = await supabase.from("games").select("url, external_id")
  const existingUrls = new Set((existingRows || []).map((r) => r.url))
  const existingExt = new Set((existingRows || []).map((r) => (r as any).external_id).filter(Boolean))

  let inserted = 0
  for (const raw of rawGames) {
    const slug = raw.url || raw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const extId = raw.source_url || slug
    if (existingUrls.has(slug) || existingExt.has(extId)) continue
    try {
      const enriched = await enrichGameWithGemini(raw, GEMINI_API_KEY)
      const finalSlug = enriched.url || slug
      await supabase.from("games").insert({
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
        content_enhanced: true,
        scraped_at: new Date().toISOString(),
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
