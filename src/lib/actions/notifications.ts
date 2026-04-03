'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAsRead(notificationId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/dashboard')
    return { success: true }
}

export async function markAllAsRead(userId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

    if (error) throw new Error(error.message)
    
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteNotification(notificationId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/dashboard')
    return { success: true }
}

export async function createPartnerNotification({
    type,
    title,
    content,
    link,
    coupleId,
    senderId
}: {
    type: string,
    title: string,
    content: string,
    link?: string,
    coupleId: string,
    senderId: string
}) {
    const supabase = await createClient()

    // 1. Find partner's ID
    const { data: partner, error: partnerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('couple_id', coupleId)
        .neq('id', senderId)
        .maybeSingle()

    if (partnerError || !partner) {
        console.warn('Notification: No partner found to notify', partnerError)
        return null
    }

    // 2. Insert notification
    const { data, error } = await supabase
        .from('notifications')
        .insert([{
            user_id: partner.id,
            type,
            title,
            content,
            link,
            is_read: false
        }])
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}
