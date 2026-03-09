import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Comment } from "@/models/Comment"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameUrl = searchParams.get("gameUrl")

  if (!gameUrl) {
    return NextResponse.json({ error: "Game URL required" }, { status: 400 })
  }

  try {
    await connectDB()
    const comments = await Comment.find({ gameUrl }).sort({ createdAt: -1 }).limit(50)
    return NextResponse.json({ comments })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { gameUrl, name, email, message } = await request.json()

    if (!gameUrl || !name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }

    await connectDB()
    const newComment = await Comment.create({ gameUrl, name, email, message })
    return NextResponse.json({ comment: newComment }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
