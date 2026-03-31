'use server'

import { createClient } from '../../utils/supabase/server'
import { BucketListInsert, BucketListUpdate, BucketListCommentInsert } from '@/types/bucket-list'

export async function createBucketListItem(item: BucketListInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bucket_list')
        .insert(item)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function updateBucketListItem(id: string, updates: BucketListUpdate) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bucket_list')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function deleteBucketListItem(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('bucket_list')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

export async function toggleBucketListItemStatus(id: string, isCompleted: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('bucket_list')
        .update({ is_completed: isCompleted })
        .eq('id', id)
    
    if (error) throw error
}

export async function addBucketListComment(comment: BucketListCommentInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bucket_list_comments')
        .insert(comment)
        .select(`
            *,
            author:profiles(display_name, avatar_url)
        `)
        .single()
    
    if (error) throw error
    return data
}
