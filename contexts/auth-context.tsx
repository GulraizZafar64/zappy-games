// "use client"

// import type React from "react"

// import { createContext, useContext, useEffect, useState } from "react"
// import type { User } from "@supabase/supabase-js"
// import { supabase } from "@/lib/supabase"

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<{ error: any }>
//   signUp: (email: string, password: string, username: string) => Promise<{ error: any }>
//   signOut: () => Promise<void>
//   updateNotificationSettings: (enabled: boolean) => Promise<void>
//   isSupabaseConfigured: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

//   useEffect(() => {
//     // Check if Supabase is properly configured
//     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//     const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

//     if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://placeholder.supabase.co") {
//       setIsSupabaseConfigured(false)
//       setLoading(false)
//       return
//     }

//     // Get initial session
//     supabase.auth
//       .getSession()
//       .then(({ data: { session } }) => {
//         setUser(session?.user ?? null)
//         setLoading(false)
//       })
//       .catch(() => {
//         setIsSupabaseConfigured(false)
//         setLoading(false)
//       })

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       setUser(session?.user ?? null)
//       setLoading(false)
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   const signIn = async (email: string, password: string) => {
//     if (!isSupabaseConfigured) {
//       return { error: { message: "Authentication not available in preview mode" } }
//     }

//     const { error } = await supabase.auth.signInWithPassword({ email, password })
//     return { error }
//   }

//   const signUp = async (email: string, password: string, username: string) => {
//     if (!isSupabaseConfigured) {
//       return { error: { message: "Authentication not available in preview mode" } }
//     }

//     const { data, error } = await supabase.auth.signUp({ email, password })

//     if (!error && data.user) {
//       // Create user profile
//       await supabase.from("users").insert({
//         id: data.user.id,
//         email,
//         username,
//         notifications_enabled: false,
//       })
//     }

//     return { error }
//   }

//   const signOut = async () => {
//     if (isSupabaseConfigured) {
//       await supabase.auth.signOut()
//     }
//   }

//   const updateNotificationSettings = async (enabled: boolean) => {
//     if (!user || !isSupabaseConfigured) return

//     await supabase.from("users").update({ notifications_enabled: enabled }).eq("id", user.id)
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         updateNotificationSettings,
//         isSupabaseConfigured,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }


"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
// import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateNotificationSettings: (enabled: boolean) => Promise<void>
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  useEffect(() => {
    // --- Supabase configuration check (commented out) ---
    // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://placeholder.supabase.co") {
    //   setIsSupabaseConfigured(false)
    //   setLoading(false)
    //   return
    // }

    // --- Get initial session (commented out) ---
    // supabase.auth
    //   .getSession()
    //   .then(({ data: { session } }) => {
    //     setUser(session?.user ?? null)
    //     setLoading(false)
    //   })
    //   .catch(() => {
    //     setIsSupabaseConfigured(false)
    //     setLoading(false)
    //   })

    // --- Listen for auth changes (commented out) ---
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   setUser(session?.user ?? null)
    //   setLoading(false)
    // })

    // return () => subscription.unsubscribe()

    setLoading(false) // fallback so loading finishes
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Authentication not available in preview mode" } }
    }

    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // return { error }
    return { error: null }
  }

  const signUp = async (email: string, password: string, username: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: "Authentication not available in preview mode" } }
    }

    // const { data, error } = await supabase.auth.signUp({ email, password })

    // if (!error && data.user) {
    //   // Create user profile
    //   await supabase.from("users").insert({
    //     id: data.user.id,
    //     email,
    //     username,
    //     notifications_enabled: false,
    //   })
    // }

    return { error: null }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      // await supabase.auth.signOut()
    }
  }

  const updateNotificationSettings = async (enabled: boolean) => {
    if (!user || !isSupabaseConfigured) return

    // await supabase.from("users").update({ notifications_enabled: enabled }).eq("id", user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateNotificationSettings,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
