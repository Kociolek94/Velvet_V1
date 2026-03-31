'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    LayoutDashboard,
    ShieldCheck,
    BookHeart,
    Trophy,
    LogOut,
    ChevronLeft,
    Activity,
    Compass,
    Gift,
    Flame,
    Users,
    Layers
} from 'lucide-react'

const MENU_ITEMS = [
    { id: 'back', label: 'Wróć do menu', href: '/', icon: ChevronLeft },
    { id: 'dashboard', label: 'Status Relacji', href: '/dashboard', icon: LayoutDashboard },
    { id: 'safe-space', label: 'Bezpieczna Przestrzeń', href: '/dashboard/issues', icon: ShieldCheck },
    { id: 'diary', label: 'Pamiętnik Związku', href: '/dashboard/diary', icon: BookHeart },
    { id: 'games', label: 'Velvet Games', href: '/dashboard/games', icon: Trophy },
    { id: 'activity-deck', label: 'Talia Aktywności', href: '/dashboard/activity-deck', icon: Layers },
    { id: 'bucket-list', label: 'Lista Marzeń', href: '/dashboard/bucket-list', icon: Compass },
    { id: 'wishlist', label: 'Lista Życzeń', href: '/dashboard/wishlist', icon: Gift },
    { id: 'room', label: 'Pokój Namiętności', href: '/dashboard/room', icon: Flame },
    { id: 'profile', label: 'Profil Pary', href: '/dashboard/profile', icon: Users },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen bg-[#0A0E14] border-r border-white/5 p-6 fixed left-0 top-0 z-40 overflow-y-auto custom-scrollbar">
            <div className="mb-8 px-4 mt-2">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-velvet-gold/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                        <Activity size={18} className="text-velvet-gold" />
                    </div>
                    <span className="text-xl font-bold tracking-[0.2em] text-velvet-gold uppercase font-heading">Velvet</span>
                </Link>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {MENU_ITEMS.map((item) => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href) && item.href !== '/'
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'text-velvet-gold bg-white/5'
                                : 'text-velvet-cream/40 hover:text-velvet-gold hover:bg-white/5'
                                }`}
                        >
                            {isActive && <div className="v-nav-indicator" />}
                            <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-velvet-gold' : ''}`} />
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-velvet-gold' : ''}`}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="pt-6 mt-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 text-velvet-cream/30 hover:text-white transition-all w-full group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Wyloguj</span>
                </button>
            </div>
        </aside>
    )
}
