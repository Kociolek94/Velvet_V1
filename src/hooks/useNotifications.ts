'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { markAsRead, markAllAsRead, deleteNotification } from '@/lib/actions/notifications'

export interface NotificationItem {
    id: string
    type: 'issue' | 'diary' | 'habit' | 'system'
    title: string
    content: string
    link?: string
    is_read: boolean
    created_at: string
}

export function useNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    
    const supabase = createClient()

    const fetchNotifications = useCallback(async () => {
        if (!userId) return
        
        setLoading(true)
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)

        if (data) {
            setNotifications(data as NotificationItem[])
            setUnreadCount(data.filter(n => !n.is_read).length)
        }
        setLoading(false)
    }, [userId, supabase])

    useEffect(() => {
        if (userId) {
            fetchNotifications()

            // Subscribe to real-time changes
            const channel = supabase
                .channel(`user-notifications-${userId}`)
                .on(
                    'postgres_changes',
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: 'notifications', 
                        filter: `user_id=eq.${userId}` 
                    },
                    () => {
                        fetchNotifications()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [userId, fetchNotifications, supabase])

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id)
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const handleMarkAllAllRead = async () => {
        if (!userId) return
        try {
            await markAllAsRead(userId)
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            const notify = notifications.find(n => n.id === id)
            if (notify && !notify.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Failed to delete notification:', error)
        }
    }

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAllRead,
        deleteNotification: handleDelete,
        refresh: fetchNotifications
    }
}
