'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useAuth() {
    const [userId, setUserId] = useState<string | null>(null)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function getSession() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    setUserId(user.id)
                    
                    // Fetch couple_id from profiles
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('couple_id')
                        .eq('id', user.id)
                        .single()
                    
                    if (profile) {
                        setCoupleId(profile.couple_id)
                    }
                }
            } catch (err) {
                console.error('Error in useAuth:', err)
            } finally {
                setLoading(false)
            }
        }

        getSession()
    }, [supabase])

    return { userId, coupleId, loading }
}
