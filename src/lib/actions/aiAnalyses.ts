'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createPartnerNotification } from './notifications'

/**
 * Pobiera najnowszą analizę AI dla danej pary.
 */
export async function getLatestAnalysis(coupleId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ai_analyses')
        .select('content, created_at')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error('Error fetching latest AI analysis:', error)
        return null
    }

    return data
}

/**
 * Zapisuje nową analizę AI w bazie danych.
 */
export async function saveAnalysis(coupleId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Nieautoryzowany')

    const { data, error } = await supabase
        .from('ai_analyses')
        .insert([{
            couple_id: coupleId,
            content: content
        }])
        .select()
        .single()

    if (error) {
        console.error('Error saving AI analysis:', error)
        throw new Error('Nie udało się zapisać analizy')
    }

    // Notify partner
    try {
        await createPartnerNotification({
            type: 'analysis',
            title: 'Nowy wgląd od Velvet Engine',
            content: 'AI przygotowało nową analizę Waszej relacji. Sprawdź, co podpowiada Velvet!',
            link: '/dashboard',
            coupleId: coupleId,
            senderId: user.id
        })
    } catch (notifyError) {
        console.error('Failed to send analysis notification:', notifyError)
    }

    revalidatePath('/dashboard')
    return data
}
