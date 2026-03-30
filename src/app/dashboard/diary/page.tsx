'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import DiaryCard from "@/components/DiaryCard"
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal"
import DiaryDetailView from "@/components/DiaryDetailView"
import { BookHeart, Plus, Compass } from "lucide-react"

interface DiaryEntry {
    id: string
    title: string
    content: string
    image_path: string
    event_date: string
    couple_id: string
}

export default function DiaryPage() {
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
    
    const supabase = createClient()

    const fetchEntries = useCallback(async (cid: string) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .eq('couple_id', cid)
            .order('event_date', { ascending: false })
        
        if (error) {
            console.error('Error fetching diary entries:', error)
        } else {
            setEntries(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('couple_id')
                .eq('id', user.id)
                .single()

            if (profile?.couple_id) {
                setCoupleId(profile.couple_id)
                fetchEntries(profile.couple_id)
                
                // Realtime subscription
                const channel = supabase
                    .channel('diary_changes')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'diary_entries', filter: `couple_id=eq.${profile.couple_id}` },
                        () => {
                            fetchEntries(profile.couple_id)
                        }
                    )
                    .subscribe()

                return () => {
                    supabase.removeChannel(channel)
                }
            }
        }
        init()
    }, [supabase, fetchEntries])

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <BookHeart className="text-velvet-gold animate-pulse" size={24} />
                            <h1 className="text-4xl font-heading text-velvet-gold uppercase tracking-[0.2em] leading-none">Pamiętnik Związku</h1>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="w-8 h-[1px] bg-velvet-gold/30" />
                            <p className="text-xs uppercase tracking-[0.4em] font-medium">Wasza Wspólna Historia</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="v-button-burgundy self-start md:self-center h-16 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        Dodaj Wspomnienie
                    </button>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-2 border-velvet-gold/10 border-t-velvet-gold rounded-full animate-spin" />
                        <span className="text-[10px] uppercase tracking-[0.4em] text-velvet-gold/40 font-black">Otwieranie Kroniki...</span>
                    </div>
                ) : entries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in fill-mode-forwards opacity-0">
                        {entries.map((entry) => (
                            <DiaryCard 
                                key={entry.id}
                                title={entry.title}
                                imagePath={entry.image_path}
                                eventDate={entry.event_date}
                                onClick={() => setSelectedEntry(entry)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="v-card p-20 flex flex-col items-center justify-center text-center border-dashed border-velvet-gold/20 bg-velvet-gold/[0.02]">
                        <div className="p-8 rounded-full bg-velvet-gold/5 mb-8">
                            <Compass className="text-velvet-gold/30" size={64} />
                        </div>
                        <h2 className="text-2xl font-heading text-velvet-gold/60 uppercase tracking-[0.2em] mb-4">Pusty Pamiętnik</h2>
                        <p className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed font-light">
                            Wasza historia dopiero się pisze. Dodajcie pierwsze wspólne zdjęcie i opiszcie tę wyjątkową chwilę.
                        </p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="v-button-outline-gold px-12 py-5"
                        >
                            Stwórz Pierwszy Wpis
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {coupleId && (
                <AddDiaryEntryModal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    onSuccess={() => fetchEntries(coupleId)}
                    coupleId={coupleId}
                />
            )}

            {selectedEntry && (
                <DiaryDetailView 
                    entry={selectedEntry} 
                    onClose={() => setSelectedEntry(null)} 
                />
            )}
        </DashboardLayout>
    )
}
