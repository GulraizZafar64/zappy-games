import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import mongoose from "mongoose"
import { connectDB } from "../lib/mongodb"
import { Game } from "../models/Game"

async function setupIndexes() {
    console.log("🚀 Starting Index Setup...")
    try {
        await connectDB()
        console.log("📡 Connected to MongoDB.")

        console.log("🧹 Dropping existing indexes (to ensure clean slate)...")
        try {
            await Game.collection.dropIndexes()
            console.log("✅ Indexes dropped.")
        } catch (e) {
            console.log("ℹ️ No existing indexes to drop or collection doesn't exist.")
        }

        console.log("🏗️ Creating new indexes (including Text Search)...")
        await Game.createIndexes()

        const indexes = await Game.collection.indexes()
        console.log("📋 Current Indexes:", JSON.stringify(indexes, null, 2))

        console.log("✨ All indexes setup successfully!")
    } catch (e) {
        console.error("❌ Error setting up indexes:", e)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

setupIndexes()
