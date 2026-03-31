'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Issue } from '@/types/issue'

export function useIssues(coupleId: string | null) {
    const [issues, setIssues] = useState<Issue[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!coupleId) return

        let channel: any

        async function fetchIssues() {
            try {
                const { data, error } = await supabase
                    .from('issues')
                    .select('*')
                    .eq('couple_id', coupleId)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setIssues(data || [])
            } catch (err) {
                console.error('Error fetching issues:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchIssues()

        // Realtime subscription
        channel = supabase
            .channel(`issues_${coupleId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'issues', filter: `couple_id=eq.${coupleId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setIssues(prev => [payload.new as Issue, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setIssues(prev => prev.map(issue => issue.id === payload.new.id ? (payload.new as Issue) : issue))
                    } else if (payload.eventType === 'DELETE') {
                        setIssues(prev => prev.filter(issue => issue.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [coupleId, supabase])

    return { issues, loading, setIssues }
}
