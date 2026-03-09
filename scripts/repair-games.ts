import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import axios from "axios"
import * as cheerio from "cheerio"
import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

const BASE_URL = "https://www.crazygames.com"

async function findOnCrazyGames(name: string) {
    try {
        const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(name)}`
        const { data } = await axios.get(searchUrl)
        const $ = cheerio.load(data)

        // Find the first game link
        const firstGame = $('a[href*="/game/"]').first()
        if (firstGame.length) {
            const relativeUrl = firstGame.attr("href")
            const slug = relativeUrl?.split("/").pop()
            if (slug) {
                // Fetch game page for real data
                const gamePageUrl = `${BASE_URL}/game/${slug}`
                const pageRes = await axios.get(gamePageUrl)
                const page$ = cheerio.load(pageRes.data)

                const ogImage = page$('meta[property="og:image"]').attr("content")
                const iframeUrl = `https://www.crazygames.com/embed/${slug}`

                return {
                    url: slug,
                    image: ogImage,
                    iframe: iframeUrl,
                    category: page$('meta[property="og:category"]').attr("content") || "Other"
                }
            }
        }
    } catch (e) {
        // console.error(`Failed to find ${name} on CrazyGames`)
    }
    return null
}

async function repair() {
    await connectDB()
    console.log("🛠️ Starting Game Repair...")

    // Find games that look like placeholders or from TinyPlay
    const brokenGames = await Game.find({
        $or: [
            { image: { $regex: /tinyplay/i } },
            { image: "" },
            { image: { $exists: false } },
            { source_url: { $regex: /tinyplay/i } }
        ]
    }).limit(100)

    console.log(`🔍 Found ${brokenGames.length} potentially broken games.`)

    for (const game of brokenGames) {
        console.log(`✨ Attempting to repair: ${game.name}`)
        const fixedData = await findOnCrazyGames(game.name)

        if (fixedData) {
            console.log(`✅ Found data for ${game.name} on CrazyGames!`)
            await Game.updateOne({ _id: game._id }, {
                $set: {
                    url: fixedData.url,
                    image: fixedData.image,
                    iframe: fixedData.iframe,
                    source_url: `https://www.crazygames.com/game/${fixedData.url}`,
                    rank: 10 // Give it a better rank now that it's fixed
                }
            })
        } else {
            console.log(`❌ No data found for ${game.name}. Removing to clean up.`)
            await Game.deleteOne({ _id: game._id })
        }
    }

    console.log("🏁 Repair finished.")
    process.exit(0)
}

repair()
