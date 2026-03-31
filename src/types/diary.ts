import { Database } from './supabase'

export type DiaryEntry = Database['public']['Tables']['diary_entries']['Row']
export type DiaryInsert = Database['public']['Tables']['diary_entries']['Insert']
export type DiaryUpdate = Database['public']['Tables']['diary_entries']['Update']

export interface DiaryContent {
    text?: string
    perspective_a?: string
    perspective_b?: string
    elements?: any[]
    [key: string]: any
}
