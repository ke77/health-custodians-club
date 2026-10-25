// read once and fail loudly, so a missing key shows up as a clear message instead of a vague network error
function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`)
  return value
}

// NEXT_PUBLIC_ values must be read with literal names so next.js can inline them in the browser bundle
export const supabaseUrl = () => required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
export const supabaseAnonKey = () =>
  required('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
