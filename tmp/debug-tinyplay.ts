import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function check() {
    await connectDB()
    const sample = await Game.findOne({ url: { $regex: /tinyplay/i } }).lean()
    console.log("Found tinyplay sample:", JSON.stringify(sample, null, 2))

    const count = await Game.countDocuments({ url: { $regex: /tinyplay/i } })
    console.log("Total tinyplay games:", count)
    process.exit(0)
}

check()
