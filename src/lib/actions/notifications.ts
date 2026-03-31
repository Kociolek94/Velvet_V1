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
