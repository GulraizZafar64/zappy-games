
/**
 * Enrich game data using Gemini/Claude for metadata and SEO Templates for long descriptions.
 * This approach avoids JSON truncation and API rate limits while guaranteeing 1000+ words.
 */

import { generateTemplateDescription } from "./game-templates"

export interface RawGameInput {
  name: string
  image?: string
  url?: string
  category?: string
  source_url?: string
  iframe?: string
  video_url?: string
  scraped_description?: string
}

export interface EnrichedGame {
  name: string
  url: string
  category: string
  image: string
  iframe: string
  video_url?: string | null
  description: string
  meta_description: string
  seo_keywords: string[]
  ranking_keywords: string[]
  content_enhanced: string
  badge?: "Hot" | "New" | "Featured" | "Top" | null
  rank?: number | null
}

// ─── Prompt: metadata only (JSON, no long description) ───────────────────────
const METADATA_PROMPT = `You are an SEO expert for a free online games website called Zappy Games.
Given a game's basic info, return ONLY a valid JSON object with these exact keys (no markdown, no code block, no extra text):
- name: string (clean title)
- url: string (slug: lowercase, hyphens only)
- category: string (one of: action, puzzle, racing, sports, adventure, strategy, simulation, other)
- image: string (use the provided image URL as-is)
- iframe: string (use provided iframe URL or placeholder)
- video_url: string or null
- meta_description: string (max 160 chars, include primary keyword naturally)
- seo_keywords: string[] (10-15 keywords mixing short-tail and long-tail: game name, genre, "free online", "play in browser", "no download", platform terms)
- ranking_keywords: string[] (6-10 high-intent search phrases people actually search, e.g. "play [game] online free", "best [genre] games 2025", "[game] unblocked")
- content_enhanced: string (2-3 paragraphs for on-page SEO — naturally weave ranking_keywords and seo_keywords throughout)
- badge: "Hot" | "New" | "Featured" | "Top" | null
- rank: number | null (1-100 popularity estimate)`

// ─── Gemini helpers ───────────────────────────────────────────────────────────

function getGeminiKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 11; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`] || (i === 1 ? process.env.GEMINI_API_KEY : null)
    if (k && k.trim()) keys.push(k.trim())
  }
  if (keys.length === 0 && process.env.GEMINI_API_KEY) {
    const single = process.env.GEMINI_API_KEY
    if (single.includes(",")) keys.push(...single.split(",").map((s) => s.trim()).filter(Boolean))
    else keys.push(single)
  }
  return keys
}

async function geminiGenerate(prompt: string, apiKey: string, maxTokens: number, isJson = false): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      ...(isJson ? { responseMimeType: "application/json" } : {})
    },
  })
  return result.response.text()
}

async function tryGeminiMeta(raw: RawGameInput, apiKey: string): Promise<Omit<EnrichedGame, "description">> {
  const prompt = `${METADATA_PROMPT}\n\nInput game:\n${JSON.stringify(raw)}`
  const text = await geminiGenerate(prompt, apiKey, 2048, true)
  const jsonStr = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    throw new Error(`Gemini metadata JSON parse failed: ${jsonStr.substring(0, 120)}`)
  }
}

// ─── Claude helpers ───────────────────────────────────────────────────────────

async function tryClaudeMeta(raw: RawGameInput): Promise<Omit<EnrichedGame, "description">> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === "sk-") throw new Error("No valid ANTHROPIC_API_KEY")
  const { Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ apiKey })
  const prompt = `${METADATA_PROMPT}\n\nInput game:\n${JSON.stringify(raw)}`
  const msg = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  })
  const text = (msg.content[0] as { type: "text"; text: string }).text
  const jsonStr = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    throw new Error(`Claude metadata JSON parse failed: ${jsonStr.substring(0, 120)}`)
  }
}

// ─── Logic: Metadata and Description ──────────────────────────────────────────

async function getMeta(raw: RawGameInput): Promise<Omit<EnrichedGame, "description">> {
  const geminiKeys = [...getGeminiKeys()].sort(() => Math.random() - 0.5)
  for (const key of geminiKeys) {
    try {
      return await tryGeminiMeta(raw, key)
    } catch (e: any) {
      const msg = e.message || ""
      console.warn(`    Gemini meta failed (${msg.substring(0, 60)}), trying next...`)
      if (msg.includes("429") || msg.includes("limit")) {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 1000))
      }
    }
  }

  try {
    console.warn("    All Gemini keys failed for metadata, trying Claude...")
    return await tryClaudeMeta(raw)
  } catch (e) {
    console.error("    AI Metadata failed completely, using basic fallback.")
    return {
      name: raw.name,
      url: raw.url || raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: raw.category || "action",
      image: raw.image || "",
      iframe: raw.iframe || "",
      video_url: raw.video_url || null,
      meta_description: `Play ${raw.name} free online at Zappy Games. An exciting ${raw.category || "browser"} game with no download required.`,
      seo_keywords: [raw.name, "free online", "play in browser", "no download", "unblocked", raw.category || "games"],
      ranking_keywords: [`play ${raw.name} online free`, `${raw.name} unblocked`],
      content_enhanced: `${raw.name} is a top-rated ${raw.category || "action"} game available now on Zappy Games. Experience the thrill and master the challenges!`,
      badge: "New",
      rank: 50
    }
  }
}

async function getDescription(raw: RawGameInput): Promise<string> {
  // Use high-quality SEO templates (1000-1800 words) to guarantee quality and speed.
  return generateTemplateDescription({
    name: raw.name,
    category: raw.category || "action",
    scraped_description: raw.scraped_description,
    url: raw.url
  })
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function enrichGame(raw: RawGameInput): Promise<EnrichedGame> {
  // Run both calls in parallel
  const [metaResult, descResult] = await Promise.allSettled([
    getMeta(raw),
    getDescription(raw),
  ])

  if (metaResult.status === "rejected") {
    // This should rarely happen now because of the robust getMeta fallback
    throw new Error(`Metadata generation failed: ${metaResult.reason}`)
  }

  const meta = metaResult.value
  const description = descResult.status === "fulfilled" ? descResult.value : ""

  return {
    ...meta,
    description,
    image: meta.image || raw.image || "",
    iframe: meta.iframe || raw.iframe || "",
  }
}
