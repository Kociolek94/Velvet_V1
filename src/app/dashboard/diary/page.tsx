'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import DiaryCard from "@/components/DiaryCard"
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal"
import DiaryDetailView from "@/components/DiaryDetailView"
import { BookHeart, Plus, Compass, Heart, Star, Pen } from "lucide-react"
import { useDiary } from '@/hooks/useDiary'
import { useAuth } from '@/hooks/useAuth'
import { DiaryEntry } from '@/types/diary'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function DiaryPage() {
    const { userId, coupleId, loading: authLoading } = useAuth()
    const { entries, loading: diaryLoading } = useDiary(coupleId)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
    const [activeFilter, setActiveFilter] = useState<string>('all')

    const loading = authLoading || diaryLoading
    
    const filters = [
        { id: 'all', label: 'Wszystkie', icon: BookHeart },
        { id: 'origin', label: 'Początki', icon: Heart },
        { id: 'adventure', label: 'Przygoda', icon: Compass },
        { id: 'milestone', label: 'Sukcesy', icon: Star },
        { id: 'daily', label: 'Codzienność', icon: Pen }
    ]

    const filteredEntries = useMemo(() => {
        return activeFilter === 'all' 
            ? entries 
            : entries.filter(e => e.template_type === activeFilter)
    }, [entries, activeFilter])

    const selectedEntry = useMemo(() => {
        return entries.find(e => e.id === selectedEntryId) || null
    }, [entries, selectedEntryId])

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <BookHeart className="text-velvet-gold animate-pulse" size={24} />
                            <h1 className="text-4xl font-heading text-velvet-gold uppercase tracking-[0.2em] leading-none">Pamiętnik Związku</h1>
                        </div>
                        <div className="flex items-center gap-4 text-velvet-cream/30">
                            <div className="w-8 h-px bg-velvet-gold/30" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black italic">Wasza Wspólna Historia</p>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        variant="burgundy"
                        size="lg"
                        className="group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>Dodaj Wspomnienie</span>
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-white/5 pb-8 overflow-x-auto custom-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-full border transition-all duration-500 whitespace-nowrap ${
                                activeFilter === f.id
                                ? 'bg-velvet-gold/10 border-velvet-gold text-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                : 'bg-white/5 border-white/5 text-velvet-cream/40 hover:border-velvet-gold/30'
                            }`}
                        >
                            <f.icon size={14} className={activeFilter === f.id ? 'animate-pulse' : ''} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black">{f.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-2 border-velvet-gold/10 border-t-velvet-gold rounded-full animate-spin" />
                        <span className="text-[10px] uppercase tracking-[0.4em] text-velvet-gold/40 font-black">Otwieranie Kroniki...</span>
                    </div>
                ) : filteredEntries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
                        {filteredEntries.map((entry) => (
                            <DiaryCard 
                                key={entry.id}
                                title={entry.title}
                                imagePath={entry.image_path || ''}
                                eventDate={entry.event_date || ''}
                                templateType={entry.template_type || undefined}
                                onClick={() => setSelectedEntryId(entry.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="v-card p-20 flex flex-col items-center justify-center text-center border-dashed border-velvet-gold/20 bg-velvet-gold/[0.02] rounded-[3rem]">
                        <div className="p-8 rounded-full bg-velvet-gold/5 mb-8">
                            <Compass className="text-velvet-gold/30" size={64} />
                        </div>
                        <h2 className="text-2xl font-heading text-velvet-gold/60 uppercase tracking-[0.2em] mb-4">Pusty Pamiętnik</h2>
                        <p className="text-velvet-cream/40 text-[11px] uppercase tracking-widest max-w-sm mb-10 leading-relaxed font-bold">
                            Wasza historia dopiero się pisze. Dodajcie pierwsze wspólne zdjęcie i opiszcie tę wyjątkową chwilę.
                        </p>
                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            variant="outline"
                            className="px-12 py-5"
                        >
                            Stwórz Pierwszy Wpis
                        </Button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {coupleId && userId && (
                <AddDiaryEntryModal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    onSuccess={() => {}} // Hook handles refresh via Realtime
                    coupleId={coupleId}
                />
            )}

            {selectedEntry && (
                <DiaryDetailView 
                    entry={selectedEntry} 
                    onClose={() => setSelectedEntryId(null)} 
                />
            )}
        </DashboardLayout>
    )
}
