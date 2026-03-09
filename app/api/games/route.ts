import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Game } from "@/models/Game"
import gamesJson from "@/data/games.json"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const category = searchParams.get("category")
  const q = searchParams.get("q")
  const random = searchParams.get("random") === "true"
  const skip = (page - 1) * limit

  // 1. Build Optimized Filter
  const filter: any = {}
  if (category && category !== "All Games" && category !== "all") {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") }
  }
  if (q) {
    filter.$text = { $search: q }
  }

  try {
    await connectDB()
    let games;
    let total;

    // Random mode: use MongoDB $sample for truly random games
    if (random) {
      const filter: any = {}
      if (category && category !== "All Games" && category !== "all") {
        filter.category = { $regex: new RegExp(`^${category}$`, "i") }
      }
      total = await Game.countDocuments(filter)
      const pipeline: any[] = []
      if (Object.keys(filter).length > 0) pipeline.push({ $match: filter })
      pipeline.push({ $sample: { size: limit } })
      pipeline.push({ $project: { name: 1, url: 1, category: 1, image: 1, rating: 1, plays: 1, badge: 1, rank: 1, iframe: 1 } })
      games = await Game.aggregate(pipeline)
      const list = (games || []).map((g: any) => ({
        _id: g._id?.toString(),
        name: g.name, url: g.url, category: g.category, image: g.image,
        rating: g.rating, plays: g.plays, badge: g.badge, rank: g.rank, iframe: g.iframe,
      }))
      return NextResponse.json({ games: list, source: "mongodb-random", pagination: { total, page: 1, limit, hasMore: true } })
    }

    try {
      total = await Game.countDocuments(filter)
      games = await Game.find(filter)
        .select("name url category image rating plays badge rank created_at iframe description content_enhanced")
        .sort(q ? { score: { $meta: "textScore" } } : { rank: 1, created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    } catch (dbError: any) {
      if (q && (dbError.code === 27 || dbError.message?.includes("text index"))) {
        console.warn("⚠️ Text index missing, falling back to regex search.")
        const fallbackFilter = { ...filter }
        delete fallbackFilter.$text
        fallbackFilter.name = { $regex: q, $options: "i" }

        total = await Game.countDocuments(fallbackFilter)
        games = await Game.find(fallbackFilter)
          .select("name url category image rating plays badge rank created_at iframe description content_enhanced")
          .sort({ rank: 1, created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
      } else {
        throw dbError
      }
    }

    if (games && games.length > 0) {
      const list = games.map((g: any) => ({
        _id: g._id?.toString(),
        name: g.name,
        url: g.url,
        category: g.category,
        image: g.image,
        rating: g.rating,
        plays: g.plays,
        badge: g.badge,
        rank: g.rank,
        iframe: g.iframe,
        description: g.description,
        content_enhanced: g.content_enhanced
      }))
      return NextResponse.json({
        games: list,
        source: "mongodb",
        pagination: { total, page, limit, hasMore: total > skip + games.length }
      })
    }
    return NextResponse.json({ games: [], pagination: { total: 0, page, limit, hasMore: false } })
  } catch (e) {
    console.error("[API games]", e)
  }
  const fallback = (gamesJson as any).games || []
  return NextResponse.json({ games: fallback, source: "json" })
}
