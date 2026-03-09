import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function cleanDB() {
    await connectDB()
    console.log("🧹 Cleaning up database...")

    // Delete all games that came from tinyplay.io (confirmed broken tags)
    const res = await Game.deleteMany({
        $or: [
            { url: { $regex: /tinyplay/i } },
            { image: { $regex: /tinyplay/i } },
            { source_url: { $regex: /tinyplay/i } }
        ]
    })

    console.log(`✅ Deleted ${res.deletedCount} broken TinyPlay games.`)

    // Also update current CrazyGames games to have a better rank
    const updateRes = await Game.updateMany(
        { source_url: { $regex: /crazygames/i } },
        { $set: { rank: 1 } }
    )
    console.log(`✨ Updated ${updateRes.modifiedCount} CrazyGames to Rank 1.`)

    process.exit(0)
}

cleanDB()
