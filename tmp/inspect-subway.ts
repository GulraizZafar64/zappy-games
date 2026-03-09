import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function inspect() {
    await connectDB()
    const games = await Game.find({ name: /Subway/i }).lean()
    console.log(JSON.stringify(games, null, 2))
    process.exit(0)
}

inspect()
