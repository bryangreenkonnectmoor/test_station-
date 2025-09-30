import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please create .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Audience = {
  id: string
  name: string
  age_range: string
  gender: string
  location: string
  interests: string[]
  income_level: string
  created_at: string
}

export type Concept = {
  id: string
  audience_id: string
  title: string
  description: string
  parent_concept_id: string | null
  created_at: string
  audience?: Audience
}
