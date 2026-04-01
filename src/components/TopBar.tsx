'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, User, Activity, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
    onOpenNotifications: () => void
    unreadCount: number
    setUnreadCount: (count: number) => void
}

export default function TopBar({ onOpenNotifications, unreadCount, setUnreadCount }: TopBarProps) {
    const [profile, setProfile] = useState<{ display_name: string | null } | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    // Profile
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('display_name')
                        .eq('id', user.id)
                        .single()
                    setProfile(profileData)

                    // Initial Unread Count
                    const { count } = await supabase
                        .from('notifications')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('is_read', false)
                    setUnreadCount(count || 0)

                    // Realtime subscription
                    const channel = supabase
                        .channel('topbar_notifications')
                        .on(
                            'postgres_changes',
                            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                            () => setUnreadCount(unreadCount + 1)
                        )
                        .subscribe()

                    return () => {
                        supabase.removeChannel(channel)
                    }
                }
            } catch (err) {
                console.error('Error fetching data in TopBar:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [supabase, setUnreadCount])

    return (
        <header className="h-20 border-b border-white/5 bg-[#0A0E14]/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
                <img 
                    src="/Velvet.png" 
                    alt="Velvet" 
                    className="w-10 h-10 object-contain" 
                />
                <span className="text-xl font-bold tracking-[0.2em] text-velvet-gold uppercase font-heading">Velvet</span>
            </div>

            <div className="hidden lg:flex items-center justify-center flex-1">
                {/* Logo moved to Sidebar on Desktop */}
            </div>

            <div className="flex items-center gap-6">
                <button 
                    onClick={onOpenNotifications}
                    className="relative p-2 text-velvet-cream/60 hover:text-velvet-gold transition-colors group"
                >
                    <Bell size={22} className="group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 rounded-full border-2 border-[#0A0E14] text-[8px] font-black flex items-center justify-center text-white animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                <button className="flex items-center gap-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group min-w-[140px] justify-between">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-velvet-burgundy to-velvet-gold/20 flex items-center justify-center text-velvet-cream shrink-0">
                            <User size={18} />
                        </span>
                        <span className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-velvet-gold/80 group-hover:text-velvet-gold px-1 truncate max-w-[120px]">
                            {loading ? (
                                <Loader2 size={12} className="animate-spin opacity-40" />
                            ) : (
                                profile?.display_name || 'Użytkownik'
                            )}
                        </span>
                    </div>
                </button>
            </div>
        </header>
    )
}
