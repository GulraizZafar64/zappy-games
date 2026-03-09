import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import axios from "axios"
import * as cheerio from "cheerio"
import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

const BASE_URL = "https://www.crazygames.com"

async function debugImage(slug: string) {
    console.log(`🔍 Debugging images for: ${slug}`)
    try {
        const { data } = await axios.get(`${BASE_URL}/game/${slug}`)
        const $ = cheerio.load(data)
        const ogImage = $('meta[property="og:image"]').attr("content")
        console.log(`OG Image found: ${ogImage}`)

        const jsonText = $("#__NEXT_DATA__").html()
        if (jsonText) {
            const json = JSON.parse(jsonText)
            // Look for cover in the new format
            const gameData = json.props?.pageProps?.game
            if (gameData) {
                console.log(`JSON Cover: ${gameData.cover}`)
                console.log(`JSON Covers:`, JSON.stringify(gameData.covers, null, 2))
            }
        }
    } catch (e) {
        console.error(`Failed: ${(e as Error).message}`)
    }
}

async function run() {
    await connectDB()
    const games = await Game.find({}).limit(5)
    for (const g of games) {
        await debugImage(g.url)
    }
    process.exit(0)
}

run()
