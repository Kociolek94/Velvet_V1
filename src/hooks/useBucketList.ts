'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BucketListItem } from '@/types/bucket-list'

export function useBucketList(coupleId: string | null) {
    const [items, setItems] = useState<BucketListItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchItems = useCallback(async () => {
        if (!coupleId) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('bucket_list')
                .select('*')
                .eq('couple_id', coupleId)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            setItems(data || [])
        } catch (err) {
            console.error('Error fetching bucket list:', err)
        } finally {
            setLoading(false)
        }
    }, [coupleId, supabase])

    useEffect(() => {
        fetchItems()

        if (!coupleId) return

        const channel = supabase
            .channel(`bucket_list_${coupleId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bucket_list', filter: `couple_id=eq.${coupleId}` },
                () => fetchItems()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [coupleId, fetchItems, supabase])

    return { items, loading, refetch: fetchItems }
}
