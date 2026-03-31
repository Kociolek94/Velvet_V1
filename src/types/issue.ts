import { Database } from './supabase'

export type Issue = Database['public']['Tables']['issues']['Row']
export type IssueInsert = Database['public']['Tables']['issues']['Insert']
export type IssueUpdate = Database['public']['Tables']['issues']['Update']

export type IssueStatus = Database['public']['Enums']['issue_status']
export type IssuePriority = Database['public']['Enums']['issue_priority']
export type IssueType = Database['public']['Enums']['issue_type']

export interface IssueContent {
    title?: string
    fact?: string
    emotions?: string[]
    needs?: string
    suggestions?: string
    [key: string]: any // Fallback for various templates
}
