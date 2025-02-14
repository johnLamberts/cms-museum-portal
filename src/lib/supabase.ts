import { createClient } from "@supabase/supabase-js"

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl) throw new Error("Missing env.VITE_SUPABASE_URL")
  if (!supabaseAnonKey) throw new Error("Missing env.VITE_SUPABASE_ANON_KEY")

  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  export default supabase;

