'use server'

import { createClient } from '../../utils/supabase/server'
import { DiaryInsert, DiaryUpdate } from '@/types/diary'
import { createPartnerNotification } from './notifications'

export async function createDiaryEntry(entry: DiaryInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('diary_entries')
        .insert(entry)
        .select()
        .single()
    
    if (error) throw error

    // Notify partner
    try {
        await createPartnerNotification({
            type: 'diary',
            title: 'Nowy wpis w Dzienniku',
            content: 'Partner właśnie opisał Wasze wspólne wspomnienie. Zajrzyj do Dziennika!',
            link: `/dashboard/diary`,
            coupleId: entry.couple_id,
            senderId: entry.created_by || ''
        })
    } catch (notifyError) {
        console.error('Failed to send diary notification:', notifyError)
    }

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

    // Notify partner
    try {
        // Fetch full entry to get couple_id
        const { data: updatedEntry } = await supabase
            .from('diary_entries')
            .select('*')
            .eq('id', id)
            .single()

        const { data: { user } } = await supabase.auth.getUser()

        if (updatedEntry && user) {
            await createPartnerNotification({
                type: 'diary',
                title: 'Nowa perspektywa w Dzienniku',
                content: 'Partner dodał swoją perspektywę do wspólnego wpisu!',
                link: `/dashboard/diary`,
                coupleId: updatedEntry.couple_id,
                senderId: user.id
            })
        }
    } catch (notifyError) {
        console.error('Failed to send perspective notification:', notifyError)
    }
}
