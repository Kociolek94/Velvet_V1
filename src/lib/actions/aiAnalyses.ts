'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

    revalidatePath('/dashboard')
    return data
}
