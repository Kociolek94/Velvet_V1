'use server'

import { createClient } from '../../utils/supabase/server'
import { DiaryInsert, DiaryUpdate } from '@/types/diary'

export async function createDiaryEntry(entry: DiaryInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('diary_entries')
        .insert(entry)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function updateDiaryEntry(id: string, updates: DiaryUpdate) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('diary_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data
}

export async function deleteDiaryEntry(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

export async function addPerspective(id: string, content: any) {
    const supabase = await createClient()
    // First get current content to merge
    const { data: entry, error: fetchError } = await supabase
        .from('diary_entries')
        .select('content')
        .eq('id', id)
        .single()
    
    if (fetchError) throw fetchError

    const currentContent = typeof entry.content === 'object' ? entry.content : {}
    const updatedContent = { ...(currentContent as object), ...content }

    const { error } = await supabase
        .from('diary_entries')
        .update({ content: updatedContent })
        .eq('id', id)
    
    if (error) throw error
}
