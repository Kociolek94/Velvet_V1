'use client'

import { useRouter } from 'next/navigation'
import { LucideIcon, ArrowLeft } from 'lucide-react'

interface ModulePlaceholderProps {
    title: string
    description: string
    icon: LucideIcon
}

export default function ModulePlaceholder({ title, description, icon: Icon }: ModulePlaceholderProps) {
    const router = useRouter()

    return (
        <div className="flex-1 flex items-center justify-center p-6 min-h-[70vh] animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
            <div className="v-card p-12 max-w-xl w-full text-center relative overflow-hidden group border-velvet-gold/20 hover:border-velvet-gold/40 transition-all duration-500">
                {/* Decorative background blast */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-velvet-gold/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-velvet-gold/10 transition-all duration-700" />

                {/* Icon Hub */}
                <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-velvet-gold/10 rounded-[2rem] flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-500">
                        <Icon className="text-velvet-gold" size={48} />
                    </div>
                </div>

                <h1 className="text-3xl font-heading text-velvet-gold uppercase tracking-widest mb-4">
                    {title}
                </h1>

                <p className="text-velvet-cream/40 text-[11px] uppercase tracking-[0.4em] mb-6 font-bold">
                    Sekcja w fazie rozwoju
                </p>

                <p className="text-velvet-cream/70 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                    {description}
                </p>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="v-button-burgundy px-10 py-4 flex items-center gap-3 mx-auto"
                >
                    <ArrowLeft size={18} className="text-velvet-gold" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-velvet-gold">Wróć do Dashboardu</span>
                </button>
            </div>
        </div>
    )
}
