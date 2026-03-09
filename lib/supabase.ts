/**
 * Stub: Supabase removed in favor of MongoDB. Kept for compatibility with existing imports.
 */
const noop = () => Promise.resolve({ data: null, error: null })
const noopSelect = () => ({
  eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
})
const noopInsert = () => Promise.resolve({ data: null, error: null })
const noopDelete = () => ({ eq: () => Promise.resolve({ error: null }) })
const noopUpsert = () => Promise.resolve({ data: null, error: null })

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: noop,
    signUp: noop,
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => noopSelect(),
    insert: () => noopInsert(),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => noopDelete(),
    upsert: () => noopUpsert(),
  }),
}
