'use client'

import { Heart, Compass, Star, Pen, LucideIcon } from 'lucide-react'

export type TemplateType = 'origin' | 'adventure' | 'milestone' | 'daily'

interface TemplateOption {
    id: TemplateType
    title: string
    description: string
    icon: LucideIcon
}

const templates: TemplateOption[] = [
    { 
        id: 'origin', 
        title: 'Początki', 
        description: 'Pierwsze wrażenia i początki Waszej miłości.', 
        icon: Heart 
    },
    { 
        id: 'adventure', 
        title: 'Przygoda', 
        description: 'Wspólne podróże, wakacje i szalone chwile.', 
        icon: Compass 
    },
    { 
        id: 'milestone', 
        title: 'Sukcesy', 
        description: 'Wspólnie osiągnięte cele i ważne kroki milowe.', 
        icon: Star 
    },
    { 
        id: 'daily', 
        title: 'Codzienność', 
        description: 'Małe gesty i radości zwykłego dnia.', 
        icon: Pen 
    }
]

interface DiaryTemplateSelectorProps {
    selected: TemplateType | null
    onSelect: (type: TemplateType) => void
}

export default function DiaryTemplateSelector({ selected, onSelect }: DiaryTemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelect(t.id)}
                    className={`relative p-6 rounded-[2rem] border transition-all duration-500 text-left group overflow-hidden ${
                        selected === t.id 
                        ? 'bg-velvet-gold/10 border-velvet-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]' 
                        : 'bg-white/5 border-white/5 hover:border-velvet-gold/30'
                    }`}
                >
                    {/* Background Glow */}
                    <div className={`absolute -right-8 -bottom-8 w-24 h-24 blur-3xl transition-opacity duration-700 ${
                        selected === t.id ? 'bg-velvet-gold/20 opacity-100' : 'bg-velvet-gold/5 opacity-0 group-hover:opacity-100'
                    }`} />
                    
                    <div className="relative flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${
                            selected === t.id 
                            ? 'bg-velvet-gold text-black rotate-3' 
                            : 'bg-white/5 text-velvet-gold group-hover:scale-110 group-hover:-rotate-3'
                        }`}>
                            <t.icon size={24} />
                        </div>
                        <div>
                            <h3 className={`text-sm font-heading uppercase tracking-widest transition-colors ${
                                selected === t.id ? 'text-velvet-gold' : 'text-velvet-cream'
                            }`}>
                                {t.title}
                            </h3>
                            <p className="text-[10px] text-velvet-cream/40 mt-1 font-medium leading-relaxed">
                                {t.description}
                            </p>
                        </div>
                    </div>

                    {/* Active Indicator */}
                    {selected === t.id && (
                        <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-velvet-gold rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]" />
                    )}
                </button>
            ))}
        </div>
    )
}
