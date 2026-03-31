'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DiaryEntry } from '@/types/diary'

export function useDiary(coupleId: string | null) {
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchEntries = useCallback(async () => {
        if (!coupleId) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('diary_entries')
                .select('*')
                .eq('couple_id', coupleId)
                .order('event_date', { ascending: false })
            
            if (error) throw error
            setEntries(data || [])
        } catch (err) {
            console.error('Error fetching diary entries:', err)
        } finally {
            setLoading(false)
        }
    }, [coupleId, supabase])

    useEffect(() => {
        fetchEntries()

        if (!coupleId) return

        const channel = supabase
            .channel(`diary_${coupleId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'diary_entries', filter: `couple_id=eq.${coupleId}` },
                () => fetchEntries()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [coupleId, fetchEntries, supabase])

    return { entries, loading, refetch: fetchEntries }
}
