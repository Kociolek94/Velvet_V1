'use client'

import { X, Calendar, Quote, Heart } from 'lucide-react'

interface DiaryDetailViewProps {
    entry: {
        title: string
        content: string
        image_path: string
        event_date: string
    }
    onClose: () => void
}

export default function DiaryDetailView({ entry, onClose }: DiaryDetailViewProps) {
    const PUBLIC_STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/diary_media/`
    const imageUrl = entry.image_path.startsWith('http') ? entry.image_path : `${PUBLIC_STORAGE_URL}${entry.image_path}`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

            {/* Content Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-velvet-dark-alt border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                
                {/* Image Section (Left on Desktop) */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={entry.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:hidden" />
                    
                    {/* Close button for mobile inside image */}
                    <button 
                        onClick={onClose}
                        className="absolute top-6 left-6 md:hidden p-3 rounded-2xl bg-black/60 text-white backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section (Right on Desktop) */}
                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                    {/* PC Header */}
                    <div className="hidden md:flex justify-end p-6">
                        <button 
                            onClick={onClose}
                            className="p-3 rounded-2xl bg-white/5 text-velvet-cream/40 hover:text-velvet-gold hover:bg-white/10 transition-all group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    <div className="p-8 md:p-12 md:pt-0 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-velvet-gold/40">
                                <Calendar size={16} />
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black italic">
                                    {new Date(entry.event_date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading text-velvet-gold uppercase tracking-widest leading-[1.1]">
                                {entry.title}
                            </h2>
                        </div>

                        <div className="w-12 h-[1px] bg-velvet-gold/30" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-velvet-gold/30">
                                <Quote size={20} className="text-velvet-gold/10" />
                                <h4 className="text-[9px] uppercase tracking-[0.3em] font-black">Nasza Historia</h4>
                            </div>
                            <p className="text-velvet-cream/80 text-lg font-light leading-relaxed whitespace-pre-wrap selection:bg-velvet-gold selection:text-black">
                                {entry.content || 'Brak dodatkowego opisu dla tego wspomnienia.'}
                            </p>
                        </div>

                        <div className="pt-12 flex justify-between items-center opacity-30 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Heart size={14} className="text-velvet-gold fill-velvet-gold" />
                                <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Na zawsze w Velvet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
