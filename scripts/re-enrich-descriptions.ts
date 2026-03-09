/**
 * Re-enrich existing games that have short/missing descriptions.
 * Run: npx tsx scripts/re-enrich-descriptions.ts
 *
 * Finds games where description is shorter than MIN_WORDS words,
 * then re-runs AI enrichment and updates them in MongoDB.
 */
import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import axios from "axios"
import * as cheerio from "cheerio"
import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"
import { enrichGame } from "../lib/ai-enrich"

const BASE_URL = "https://www.crazygames.com"
const MIN_WORDS = 800     // re-enrich any game with fewer words than this
const BATCH_SIZE = 5      // concurrent games per batch
const BATCH_PAUSE_MS = 1500

function extractDescription(obj: any, depth = 0): string {
    if (depth > 8 || !obj || typeof obj !== "object") return ""
    if (typeof obj.description === "string" && obj.description.length > 30) return obj.description
    for (const val of Object.values(obj)) {
        if (typeof val === "object") {
            const found = extractDescription(val, depth + 1)
            if (found) return found
        }
    }
    return ""
}

async function scrapeGameDescription(slug: string): Promise<string> {
    const gameUrl = `${BASE_URL}/game/${slug}`
    try {
        const { data } = await axios.get(gameUrl, { timeout: 12000 })
        const $ = cheerio.load(data)
        const jsonText = $("#__NEXT_DATA__").html()
        if (jsonText) {
            const desc = extractDescription(JSON.parse(jsonText))
            if (desc.length > 30) return desc
        }
        const ogDesc = $('meta[property="og:description"]').attr("content") || ""
        if (ogDesc.length > 20) return ogDesc
        return $('meta[name="description"]').attr("content") || ""
    } catch {
        return ""
    }
}

async function reEnrichGame(game: any): Promise<void> {
    const slug = game.url
    console.log(`  🔍 [${slug}] Scraping description...`)
    const scraped_description = await scrapeGameDescription(slug)

    console.log(`  🤖 [${slug}] Running AI enrichment...`)
    try {
        const enriched = await enrichGame({
            name: game.name,
            url: slug,
            category: game.category,
            image: game.image,
            iframe: game.iframe,
            source_url: game.source_url || `${BASE_URL}/game/${slug}`,
            scraped_description: scraped_description || undefined,
        })

        const wordCount = enriched.description.split(/\s+/).filter(Boolean).length

        await Game.findOneAndUpdate(
            { url: slug },
            {
                description: enriched.description,
                meta_description: enriched.meta_description,
                seo_keywords: enriched.seo_keywords,
                ranking_keywords: enriched.ranking_keywords,
                content_enhanced: enriched.content_enhanced,
                badge: enriched.badge ?? game.badge,
                rank: enriched.rank ?? game.rank,
            }
        )
        console.log(`  ✅ [${slug}] Updated — ${wordCount} words`)
    } catch (err) {
        console.error(`  ❌ [${slug}] Failed: ${(err as Error).message}`)
    }
}

async function main() {
    console.log("🔄 Re-Enrichment Script — fixing short descriptions...")
    console.log(`   Min words threshold: ${MIN_WORDS} | Batch size: ${BATCH_SIZE}`)
    await connectDB()

    // Find all games with descriptions below the word threshold
    const allGames = await Game.find({}, { url: 1, name: 1, category: 1, image: 1, iframe: 1, source_url: 1, description: 1, badge: 1, rank: 1 }).lean()

    const needsEnrichment = allGames.filter(g => {
        const words = (g.description || "").split(/\s+/).filter(Boolean).length
        return words < MIN_WORDS
    })

    console.log(`\n📊 Total games in DB: ${allGames.length}`)
    console.log(`📝 Games needing re-enrichment (<${MIN_WORDS} words): ${needsEnrichment.length}\n`)

    if (needsEnrichment.length === 0) {
        console.log("✅ All games already have long descriptions!")
        process.exit(0)
    }

    let processed = 0
    for (let i = 0; i < needsEnrichment.length; i += BATCH_SIZE) {
        const batch = needsEnrichment.slice(i, i + BATCH_SIZE)
        console.log(`\n▶ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needsEnrichment.length / BATCH_SIZE)} (${batch.length} games)...`)
        await Promise.allSettled(batch.map(reEnrichGame))
        processed += batch.length
        console.log(`   Progress: ${processed}/${needsEnrichment.length}`)
        if (i + BATCH_SIZE < needsEnrichment.length) {
            await new Promise(resolve => setTimeout(resolve, BATCH_PAUSE_MS))
        }
    }

    console.log(`\n🏁 Done! Re-enriched ${needsEnrichment.length} games.`)
    process.exit(0)
}

main()
