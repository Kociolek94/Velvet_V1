import { Database } from './supabase'

export type ActivityDeckItem = Database['public']['Tables']['activity_deck']['Row']
export type ActivityInsert = Database['public']['Tables']['activity_deck']['Insert']
export type ActivityUpdate = Database['public']['Tables']['activity_deck']['Update']
