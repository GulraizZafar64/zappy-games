import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Game } from "@/models/Game"

export const dynamic = "force-dynamic"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB()
        const { slug } = await params

        // Search by URL or slug-ified name
        const game = await Game.findOne({
            $or: [
                { url: slug },
                { name: { $regex: new RegExp(`^${slug.replace(/-/g, " ")}$`, "i") } }
            ]
        }).lean()

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 })
        }

        return NextResponse.json({
            game: {
                ...game,
                _id: game._id?.toString(),
            }
        })
    } catch (e) {
        console.error("[API game detail]", e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
