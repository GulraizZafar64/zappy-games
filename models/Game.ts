import mongoose from "mongoose"

export interface IGame {
  name: string
  url: string
  category: string
  image: string
  iframe: string
  video_url?: string
  rating?: number
  plays?: number
  description?: string
  rank?: number
  badge?: "Hot" | "New" | "Featured" | "Top"
  seo_keywords?: string[]
  ranking_keywords?: string[]
  meta_description?: string
  content_enhanced?: string
  scraped_at?: Date
  source_url?: string
  external_id?: string
  created_at: Date
}

const GameSchema = new mongoose.Schema<IGame>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    iframe: { type: String, required: true },
    video_url: { type: String },
    rating: { type: Number, default: 4.0 },
    plays: { type: Number, default: 0 },
    description: { type: String },
    rank: { type: Number, default: 100 },
    badge: { type: String, enum: ["Hot", "New", "Featured", "Top"] },
    seo_keywords: [{ type: String }],
    ranking_keywords: [{ type: String }],
    meta_description: { type: String },
    content_enhanced: { type: String },
    scraped_at: { type: Date },
    source_url: { type: String },
    external_id: { type: String, sparse: true },
  },
  { timestamps: true }
)

// Performance Indexes
GameSchema.index({ name: "text", description: "text" }) // For efficient search
GameSchema.index({ category: 1 })
GameSchema.index({ rank: 1, created_at: -1 })
GameSchema.index({ badge: 1 })

export const Game = mongoose.models?.Game || mongoose.model<IGame>("Game", GameSchema)
