'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { subHours } from 'date-fns'
import { createPartnerNotification } from './notifications'

export async function sendSpark(content: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Nieautoryzowany dostęp')

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.couple_id) throw new Error('Nie znaleziono powiązanej pary')

    const { error } = await supabase
        .from('love_sparks')
        .insert([{
            couple_id: profile.couple_id,
            sender_id: user.id,
            content
        }])

    if (error) throw error

    // Notify partner
    try {
        await createPartnerNotification({
            type: 'spark',
            title: 'Ktoś o Tobie myśli...',
            content: 'Otrzymałeś nowy Love Spark! Sprawdź co słodkiego napisał partner.',
            link: '/dashboard/sparks',
            coupleId: profile.couple_id,
            senderId: user.id
        })
    } catch (notifyError) {
        console.error('Failed to send spark notification:', notifyError)
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/sparks')
    return { success: true }
}

export async function getSparks() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Nieautoryzowany dostęp')

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.couple_id) throw new Error('Nie znaleziono powiązanej pary')

    const { data, error } = await supabase
        .from('love_sparks')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: false })

    if (error) throw error

    return {
        mySparks: data.filter(s => s.sender_id === user.id),
        partnerSparks: data.filter(s => s.sender_id !== user.id)
    }
}

export async function getRecentSparks() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Nieautoryzowany dostęp')

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.couple_id) throw new Error('Nie znaleziono powiązanej pary')

    const twentyFourHoursAgo = subHours(new Date(), 24).toISOString()

    const { data, error } = await supabase
        .from('love_sparks')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false })

    if (error) throw error

    return data
}
