import mongoose from "mongoose"

const getMongoUri = () => process.env.MONGODB_URI || ""

function isValidMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")
}

let cached = (global as any).mongoose

if (!cached) {
  (global as any).mongoose = { conn: null, promise: null }
  cached = (global as any).mongoose
}

export async function connectDB() {
  const uri = getMongoUri()
  if (!uri || !isValidMongoUri(uri)) {
    console.warn("MONGODB_URI is not set or invalid.")
    return null
  }
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export function isMongoConfigured() {
  const uri = process.env.MONGODB_URI || ""
  return !!uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
}
