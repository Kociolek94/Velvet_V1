'use server'

import { createClient } from '../../utils/supabase/server'
import { BucketListInsert, BucketListUpdate, BucketListCommentInsert } from '@/types/bucket-list'
import { createPartnerNotification } from './notifications'

export async function createBucketListItem(item: BucketListInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('bucket_list')
        .insert(item)
        .select()
        .single()
    
    if (error) throw error

    // Notify partner
    try {
        await createPartnerNotification({
            type: 'bucket',
            title: 'Nowe marzenie na liście!',
            content: `Partner dodał nowe marzenie: "${item.title}". Zobacz, co razem zaplanujecie!`,
            link: '/dashboard/bucket-list',
            coupleId: item.couple_id,
            senderId: item.created_by || ''
        })
    } catch (notifyError) {
        console.error('Failed to send bucket notification:', notifyError)
    }

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

    // Notify partner if completed just now
    if (updates.is_completed) {
        try {
            await createPartnerNotification({
                type: 'bucket',
                title: 'Marzenie spełnione!',
                content: `Wspólnie zrealizowaliście: "${data.title}". Gratulacje!`,
                link: '/dashboard/bucket-list',
                coupleId: data.couple_id,
                senderId: '' // System/Action trigger
            })
        } catch (notifyError) {
            console.error('Failed to send bucket completion notification:', notifyError)
        }
    }

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

    // Notify partner if completed
    if (isCompleted) {
        try {
            const { data: item } = await supabase
                .from('bucket_list')
                .select('title, couple_id')
                .eq('id', id)
                .single()

            if (item) {
                await createPartnerNotification({
                    type: 'bucket',
                    title: 'Marzenie spełnione!',
                    content: `Wspólnie zrealizowaliście: "${item.title}". Gratulacje!`,
                    link: '/dashboard/bucket-list',
                    coupleId: item.couple_id,
                    senderId: '' // System/Action trigger
                })
            }
        } catch (notifyError) {
            console.error('Failed to send bucket toggle notification:', notifyError)
        }
    }
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

    // Notify partner
    try {
        // Get item title and couple_id
        const { data: item } = await supabase
            .from('bucket_list')
            .select('title, couple_id')
            .eq('id', comment.bucket_list_id)
            .single()

        if (item) {
            await createPartnerNotification({
                type: 'bucket',
                title: 'Nowy komentarz do marzenia',
                content: `Partner skomentował Wasze marzenie: "${item.title}".`,
                link: '/dashboard/bucket-list',
                coupleId: item.couple_id,
                senderId: comment.author_id
            })
        }
    } catch (notifyError) {
        console.error('Failed to send bucket comment notification:', notifyError)
    }

    return data
}
