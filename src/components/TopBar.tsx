'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, User, Activity, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TopBar() {
    const [profile, setProfile] = useState<{ display_name: string | null } | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function getProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('display_name')
                        .eq('id', user.id)
                        .single()
                    setProfile(data)
                }
            } catch (err) {
                console.error('Error fetching profile in TopBar:', err)
            } finally {
                setLoading(false)
            }
        }
        getProfile()
    }, [supabase])

    return (
        <header className="h-20 border-b border-white/5 bg-[#0A0E14]/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
                <Activity className="text-velvet-gold" size={24} />
                <span className="text-xl font-bold tracking-[0.2em] text-velvet-gold uppercase font-heading">Velvet</span>
            </div>

            <div className="hidden lg:flex items-center justify-center flex-1">
                {/* Logo moved to Sidebar on Desktop */}
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-velvet-cream/60 hover:text-velvet-gold transition-colors group">
                    <Bell size={22} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-[#0A0E14]" />
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
