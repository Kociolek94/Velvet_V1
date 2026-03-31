'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ActivityDeckItem } from '@/types/activity'

export function useActivityDeck(coupleId: string | null) {
    const [activities, setActivities] = useState<ActivityDeckItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchActivities = useCallback(async () => {
        if (!coupleId) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('activity_deck')
                .select('*')
                .eq('couple_id', coupleId)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            setActivities(data || [])
        } catch (err) {
            console.error('Error fetching activities:', err)
        } finally {
            setLoading(false)
        }
    }, [coupleId, supabase])

    useEffect(() => {
        fetchActivities()

        if (!coupleId) return

        const channel = supabase
            .channel(`activity_deck_${coupleId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'activity_deck', filter: `couple_id=eq.${coupleId}` },
                () => fetchActivities()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [coupleId, fetchActivities, supabase])

    const shuffle = useCallback(() => {
        if (activities.length === 0) return null
        return activities[Math.floor(Math.random() * activities.length)]
    }, [activities])

    return { activities, loading, refetch: fetchActivities, shuffle }
}
