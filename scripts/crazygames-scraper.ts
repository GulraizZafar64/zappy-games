import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import axios from "axios"
import * as cheerio from "cheerio"
import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"
import { generateTemplateDescription } from "../lib/game-templates"

const BASE_URL = "https://www.crazygames.com"
const MAX_GAMES = 3500
const BATCH_SIZE = 50      // games processed concurrently per batch
const PAGE_DELAY_MS = 3500 // Significantly increased delay to avoid 429 Rate Limits

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findGamesInJson(obj: any): any[] {
    if (!obj || typeof obj !== "object") return []
    if (Array.isArray(obj)) {
        if (obj.length > 0 && obj[0].name && obj[0].slug && obj[0].cover) return obj
        return obj.flatMap(findGamesInJson)
    }
    return Object.values(obj).flatMap(findGamesInJson)
}

/** Recursively search a JSON object for a "description" field with meaningful text. */
function extractDescription(obj: any, depth = 0): string {
    if (depth > 8 || !obj || typeof obj !== "object") return ""
    if (typeof obj.description === "string" && obj.description.length > 30) {
        return obj.description
    }
    for (const val of Object.values(obj)) {
        if (typeof val === "object") {
            const found = extractDescription(val, depth + 1)
            if (found) return found
        }
    }
    return ""
}

/**
 * Visit a game's individual page on CrazyGames and extract the raw description.
 * Tries: __NEXT_DATA__ JSON → og:description → meta description
 */
async function scrapeGameDescription(slug: string): Promise<string> {
    const gameUrl = `${BASE_URL}/game/${slug}`
    try {
        const { data } = await axios.get(gameUrl, { timeout: 12000 })
        const $ = cheerio.load(data)

        const jsonText = $("#__NEXT_DATA__").html()
        if (jsonText) {
            const json = JSON.parse(jsonText)
            const desc = extractDescription(json)
            if (desc.length > 30) return desc
        }

        const ogDesc = $('meta[property="og:description"]').attr("content") || ""
        if (ogDesc.length > 20) return ogDesc

        return $('meta[name="description"]').attr("content") || ""
    } catch {
        return "" // non-fatal — enrichment still runs on name + category alone
    }
}

/** 
 * Deterministic SEO enrichment (No AI)
 * Provides meta tags, keywords, and 1000+ word descriptions via templates.
 */
function fastEnrich(g: { name: string, category: string, slug: string, scraped_description?: string }): any {
    const { name, category, slug, scraped_description } = g
    const cleanName = name.trim()
    const cat = category.toLowerCase()

    const meta_description = `Play ${cleanName} for free online at Zappy Games. ${cleanName} is an exciting ${cat} game you can play in your browser with no downloads or registration required. Enjoy unblocked access to top-rated browser games.`

    const seo_keywords = [
        cleanName,
        `${cleanName} online`,
        `play ${cleanName}`,
        `${cleanName} free`,
        "free online games",
        "browser games",
        "no download games",
        "unblocked games",
        cat,
        `${cat} games`
    ]

    const ranking_keywords = [
        `play ${cleanName} online free`,
        `${cleanName} game unblocked`,
        `best ${cat} games 2025`,
        `${cleanName} browser game`,
        "free games no download"
    ]

    const content_enhanced = `${cleanName} is a premier ${cat} title that delivers instant action and deep engagement. Optimized for all devices, this game brings the best of modern web technology to your fingertips. Master the challenges of ${cleanName} and join a global community of players.`

    return {
        name: cleanName,
        url: slug,
        category: cat,
        meta_description,
        seo_keywords,
        ranking_keywords,
        content_enhanced,
        badge: Math.random() > 0.85 ? (Math.random() > 0.5 ? "Hot" : "New") : null,
        rank: Math.floor(Math.random() * 80) + 1,
        description: generateTemplateDescription({
            name: cleanName,
            category: cat,
            scraped_description: scraped_description || undefined,
            url: slug
        })
    }
}

/**
 * Full enrichment pipeline for one game:
 *  1. Scrape raw description from the game's own page
 *  2. AI enrichment → 800-1500 word SEO description + metadata
 *  3. Return document for bulk upsert
 */
async function processGame(g: any): Promise<any | null> {
    const image = `https://imgs.crazygames.com/${g.cover}?auto=format,compress&q=75&cs=strip&ch=DPR&w=400`
    const iframe = `https://www.crazygames.com/embed/${g.slug}`
    const category = (g.categoryName || "other").toLowerCase()

    try {
        // Step 1: scrape raw description
        console.log(`  🔍 [${g.slug}] Scraping description...`)
        const scraped_description = await scrapeGameDescription(g.slug)

        // Step 2: Local SEO enrichment (Optimized & Fast)
        console.log(`  ⚡ [${g.slug}] Fast SEO enrichment...`)
        const fast = fastEnrich({
            name: g.name,
            category,
            slug: g.slug,
            scraped_description: scraped_description || undefined
        })

        // Step 3: build document
        const gameDoc = {
            name: fast.name,
            url: fast.url,
            category: fast.category,
            image: image,
            iframe: iframe,
            video_url: null,
            plays: Math.floor(Math.random() * 50000) + 5000,
            rating: 4.5,
            scraped_at: new Date(),
            external_id: g.id || g.slug,
            source_url: `${BASE_URL}/game/${g.slug}`,
            description: fast.description,
            meta_description: fast.meta_description,
            seo_keywords: fast.seo_keywords,
            ranking_keywords: fast.ranking_keywords,
            content_enhanced: fast.content_enhanced,
            badge: fast.badge,
            rank: fast.rank,
        }

        return gameDoc
    } catch (err) {
        console.error(`  ❌ [${g.slug}] Error: ${(err as Error).message}`)
        return null
    }
}

/**
 * Process an array of games in concurrent batches, then save to DB in batches of 50.
 */
async function processBatch(games: any[]): Promise<number> {
    let saved = 0
    const documentsToSave: any[] = []

    // Process concurrently in large batches as requested (50 at once)
    const AI_BATCH = BATCH_SIZE
    for (let i = 0; i < games.length; i += AI_BATCH) {
        const batch = games.slice(i, i + AI_BATCH)
        console.log(`\n  ▶ Enriching AI batch ${Math.floor(i / AI_BATCH) + 1} (${batch.length} games concurrently)...`)

        const results = await Promise.allSettled(batch.map(processGame))

        for (const res of results) {
            if (res.status === "fulfilled" && res.value) {
                documentsToSave.push(res.value)
            }
        }

        // Bulk save to database
        if (documentsToSave.length > 0) {
            console.log(`\n  💾 Saving ${documentsToSave.length} games to database in bulk...`)
            const bulkOps = documentsToSave.map(doc => ({
                updateOne: {
                    filter: { url: doc.url },
                    update: { $set: doc },
                    upsert: true
                }
            }))

            try {
                await Game.bulkWrite(bulkOps)
                saved += documentsToSave.length
                console.log(`  ✅ Successfully saved ${documentsToSave.length} games.`)
                documentsToSave.length = 0 // Clear the array
            } catch (bulkErr) {
                console.error(`  ❌ Bulk write failed: ${(bulkErr as Error).message}`)
            }
        }

        // Minimal pause between large batches to maximize speed
        if (i + AI_BATCH < games.length) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }
    return saved
}



// ─── Main ─────────────────────────────────────────────────────────────────────

async function scrapeCrazyGames() {
    console.log("🚀 Starting CrazyGames Scraper with AI Description Enrichment...")
    console.log(`   Batch size: ${BATCH_SIZE} concurrent | Max games: ${MAX_GAMES}`)
    await connectDB()

    const processedSlugs = new Set<string>()

    // 🔥 PRE-LOAD EXISTING SLUGS FROM DB (to prevent re-scrapping duplicates)
    console.log("📂 Pre-loading existing games from database...")
    const existingGames = await Game.find({}, { url: 1 }).lean()
    existingGames.forEach(g => {
        if (g.url) processedSlugs.add(g.url)
    })
    console.log(`✅ Loaded ${processedSlugs.size} existing items. Target: ${MAX_GAMES} total.`)

    let totalSavedInThisRun = 0

    const categoryPaths = [
        "/new",
        "/originals",
        "/c/action",
        "/c/driving",
        "/c/shooting",
        "/c/puzzle",
        "/c/adventure",
        "/c/sports",
        "/c/strategy",
        "/c/clicker",
        "/t/basketball",
        "/t/soccer",
        "/t/bike",
        "/t/car",
        "/t/card",
        "/t/casual",
        "/t/multiplayer",
        "/t/stickman",
        "/t/io",
        "/t/beauty",
        "/t/simulation",
        "/t/fighting",
        "/t/horror",
        "/t/mahjong",
        "/t/escape-room",
        "/t/tower-defense",
        "/t/fps",
        "/t/mmo",
        "/t/flash",
        "/t/survival",
        "/t/war",
        "/t/zombie",
        "/t/2-player",
        "/t/minecraft",
        "/t/pool",
        "/t/board-games",
        "/t/world-war-2",
        "/t/one-button",
    ]

    for (const catPath of categoryPaths) {
        if (processedSlugs.size >= MAX_GAMES) break

        for (let page = 1; page <= 15; page++) {
            if (processedSlugs.size >= MAX_GAMES) break

            const url = page === 1 ? `${BASE_URL}${catPath}` : `${BASE_URL}${catPath}/${page}`
            console.log(`\n📡 Fetching ${url}...`)

            try {
                // Simple retry logic ONLY for 429s (Rate Limits)
                let response
                for (let retry = 0; retry < 3; retry++) {
                    try {
                        response = await axios.get(url, {
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.9',
                            }
                        })
                        break
                    } catch (err: any) {
                        const status = err.response?.status
                        // If it's a 404, the page doesn't exist (common for tags pagination). Don't retry.
                        if (status === 404) {
                            console.log(`  ℹ️ Page not found (404): ${url}. Moving to next.`)
                            break
                        }
                        // Only retry on 429 or transient errors
                        if (status === 429 || !status) {
                            if (retry === 2) throw err
                            console.warn(`  ⚠️ Rate Limited (429) for ${url}. Retry ${retry + 1} in 10s...`)
                            await new Promise(resolve => setTimeout(resolve, 10000))
                        } else {
                            throw err // Other errors (403, 500, etc.)
                        }
                    }
                }

                const data = response?.data
                if (!data) continue // Skip if no data or 404

                const $ = cheerio.load(data)
                const jsonText = $("#__NEXT_DATA__").html()

                if (!jsonText) {
                    console.warn(`⚠️ No NEXT_DATA found on ${url}`)
                    continue
                }

                const json = JSON.parse(jsonText)
                const allGames = findGamesInJson(json)

                // Filter out already-processed slugs
                const newGames = allGames.filter(g => !processedSlugs.has(g.slug))
                const toProcess = newGames.slice(0, MAX_GAMES - processedSlugs.size)

                console.log(`📦 ${catPath} p${page}: ${allGames.length} found, ${toProcess.length} new to process`)

                if (toProcess.length === 0) break

                // Mark all as queued before processing (prevent duplicates across parallel batches)
                toProcess.forEach(g => processedSlugs.add(g.slug))

                // Process in concurrent batches
                const saved = await processBatch(toProcess)
                totalSavedInThisRun += saved

                console.log(`✨ Progress: ${processedSlugs.size}/${MAX_GAMES} queued | ${totalSavedInThisRun} NEW saved in this run`)
            } catch (e) {
                console.error(`❌ Failed to fetch ${url}:`, (e as Error).message)
                break
            }

            await new Promise(resolve => setTimeout(resolve, PAGE_DELAY_MS))
        }
    }

    console.log(`\n🏁 Done! Final Stats: ${processedSlugs.size} total in DB | ${totalSavedInThisRun} added new`)
    process.exit(0)
}

scrapeCrazyGames()
