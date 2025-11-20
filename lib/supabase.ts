import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          latitude: number
          longitude: number
          website: string | null
          phone: string | null
          region: string
          features: string[]
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          latitude: number
          longitude: number
          website?: string | null
          phone?: string | null
          region: string
          features?: string[]
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          latitude?: number
          longitude?: number
          website?: string | null
          phone?: string | null
          region?: string
          features?: string[]
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      regions: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}