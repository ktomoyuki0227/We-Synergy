import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          host_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          host_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          host_id?: string
          created_at?: string
        }
      }
      keywords: {
        Row: {
          id: string
          room_id: string
          user_id: string
          word: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          word: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          word?: string
          created_at?: string
        }
      }
      history: {
        Row: {
          id: string
          room_id: string
          keyword_a: string
          keyword_b: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          keyword_a: string
          keyword_b: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          keyword_a?: string
          keyword_b?: string
          created_at?: string
        }
      }
    }
  }
}
