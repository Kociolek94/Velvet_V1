'use server'

import { createClient } from '../../utils/supabase/server'
import { ActivityInsert, ActivityUpdate } from '@/types/activity'

export async function createActivity(activity: ActivityInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('activity_deck')
        .insert(activity)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function updateActivity(id: string, updates: ActivityUpdate) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('activity_deck')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function deleteActivity(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('activity_deck')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

export async function toggleActivityCompletion(id: string, isCompleted: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('activity_deck')
        .update({ 
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', id)
    
    if (error) throw error
}
