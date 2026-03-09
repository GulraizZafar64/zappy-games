import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function checkGames() {
    await connectDB()
    const games = await Game.find({}).sort({ rank: 1, created_at: -1 }).limit(50).lean()

    console.log(`Found ${games.length} games in the first 50.`)
    games.forEach((g, i) => {
        console.log(`${i + 1}. [${g.name}] Image: ${g.image?.substring(0, 50)}... URL: ${g.url}`)
    })
    process.exit(0)
}

checkGames()
