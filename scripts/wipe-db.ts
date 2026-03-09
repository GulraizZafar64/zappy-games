import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function reset() {
    await connectDB()
    console.log("🧨 WIPING ENTIRE DATABASE...")
    const res = await Game.deleteMany({})
    console.log(`💥 Wiped ${res.deletedCount} games.`)
    process.exit(0)
}

reset()
