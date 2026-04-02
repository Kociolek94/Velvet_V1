'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShieldCheck,
    BookHeart,
    Trophy,
    Compass,
    Activity,
    Gift,
    Flame,
    Users,
    Layers,
    Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard, href: '/dashboard', label: 'Status' },
    { id: 'sparks', icon: Sparkles, href: '/dashboard/sparks', label: 'Okruchy' },
    { id: 'issues', icon: ShieldCheck, href: '/dashboard/issues', label: 'Przestrzeń' },
    { id: 'diary', icon: BookHeart, href: '/dashboard/diary', label: 'Pamiętnik' },
    { id: 'games', icon: Trophy, href: '/dashboard/games', label: 'Gry' },
    { id: 'activity-deck', icon: Layers, href: '/dashboard/activity-deck', label: 'Talia' },
    { id: 'bucket-list', icon: Compass, href: '/dashboard/bucket-list', label: 'Marzenia' },
    { id: 'wishlist', icon: Gift, href: '/dashboard/wishlist', label: 'Życzenia' },
    { id: 'room', icon: Flame, href: '/dashboard/room', label: 'Namiętność' },
    { id: 'profile', icon: Users, href: '/dashboard/profile', label: 'Profil' },
]

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-20 bg-[#0D121A]/90 backdrop-blur-2xl border border-white/5 rounded-3xl z-50 shadow-2xl overflow-x-auto no-scrollbar flex items-center px-4 gap-2">
            {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`relative flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[70px] ${isActive
                            ? 'text-velvet-gold bg-white/5'
                            : 'text-velvet-cream/40 hover:text-velvet-gold'
                            }`}
                    >
                        {isActive && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-velvet-gold rounded-full shadow-[0_0_8px_#D4AF37]" />}
                        <Icon size={22} className={isActive ? 'scale-110' : ''} />
                        <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 ${isActive ? 'text-velvet-gold' : 'text-velvet-cream/30'}`}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}
