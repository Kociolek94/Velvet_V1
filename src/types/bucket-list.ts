import { Database } from './supabase'

export type BucketListItem = Database['public']['Tables']['bucket_list']['Row']
export type BucketListInsert = Database['public']['Tables']['bucket_list']['Insert']
export type BucketListUpdate = Database['public']['Tables']['bucket_list']['Update']

export type BucketListComment = Database['public']['Tables']['bucket_list_comments']['Row'] & {
    author?: {
        display_name: string | null
        avatar_url: string | null
    }
}

export interface BucketListCommentInsert {
    bucket_list_id: string
    author_id: string
    content: string
}
