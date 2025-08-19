import { createClient } from "@supabase/supabase-js"

// Use fallback values for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Create a mock client if no real credentials are provided
const createSupabaseClient = () => {
  if (supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder-key") {
    // Return a mock client for development
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url?: string
          created_at: string
          notifications_enabled: boolean
        }
        Insert: {
          id: string
          email: string
          username: string
          avatar_url?: string
          notifications_enabled?: boolean
        }
        Update: {
          email?: string
          username?: string
          avatar_url?: string
          notifications_enabled?: boolean
        }
      }
      games: {
        Row: {
          id: string
          name: string
          url: string
          category: string
          image: string
          iframe: string
          rating: number
          plays: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          category: string
          image: string
          iframe: string
          rating?: number
          plays?: number
        }
        Update: {
          name?: string
          url?: string
          category?: string
          image?: string
          iframe?: string
          rating?: number
          plays?: number
        }
      }
      comments: {
        Row: {
          id: string
          game_id: string
          user_id: string
          content: string
          parent_id?: string
          created_at: string
          username: string
        }
        Insert: {
          game_id: string
          user_id: string
          content: string
          parent_id?: string
          username: string
        }
        Update: {
          content?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          game_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          game_id: string
        }
        Update: never
      }
      recent_plays: {
        Row: {
          id: string
          user_id: string
          game_id: string
          played_at: string
        }
        Insert: {
          user_id: string
          game_id: string
        }
        Update: {
          played_at?: string
        }
      }
    }
  }
}
