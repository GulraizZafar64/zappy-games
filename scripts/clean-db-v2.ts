import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function clean() {
    await connectDB()
    console.log("🧹 Final cleanup of broken games...")

    // We search for tinyplay in image field (which definitely had them)
    const res = await Game.deleteMany({
        $or: [
            { image: { $regex: /tinyplay/i } },
            { source_url: { $regex: /tinyplay/i } }
        ]
    })

    console.log(`✅ Deleted ${res.deletedCount} broken games.`)
    process.exit(0)
}

clean()
