'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import BucketListCard from "@/components/BucketListCard"
import AddDreamModal from "@/components/AddDreamModal"
import { Plus, Compass, Filter } from "lucide-react"

interface BucketListItem {
    id: string
    title: string
    category: 'jej' | 'jego' | 'wspólne'
    is_completed: boolean
    description?: string
    estimated_date?: string
    couple_id: string
}

export default function BucketListPage() {
    const [dreams, setDreams] = useState<BucketListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState<'wszystkie' | 'jej' | 'jego' | 'wspólne'>('wszystkie')

    const supabase = createClient()

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
                fetchDreams(profile.couple_id)

                // Realtime subscription
                const channel = supabase
                    .channel('bucket_list_changes')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'bucket_list', filter: `couple_id=eq.${profile.couple_id}` },
                        (payload) => {
                            if (payload.eventType === 'INSERT') {
                                setDreams(prev => [payload.new as BucketListItem, ...prev])
                            } else if (payload.eventType === 'UPDATE') {
                                setDreams(prev => prev.map(d => d.id === payload.new.id ? payload.new as BucketListItem : d))
                            } else if (payload.eventType === 'DELETE') {
                                setDreams(prev => prev.filter(d => d.id !== payload.old.id))
                            }
                        }
                    )
                    .subscribe()

                return () => {
                    supabase.removeChannel(channel)
                }
            }
        }
        init()
    }, [supabase])

    const fetchDreams = async (cid: string) => {
        setLoading(true)
        const { data } = await supabase
            .from('bucket_list')
            .select('*')
            .eq('couple_id', cid)
            .order('created_at', { ascending: false })

        setDreams(data || [])
        setLoading(false)
    }

    const handleAddDream = async (dream: { title: string, category: string, description: string, estimated_date?: string }) => {
        if (!coupleId) return

        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from('bucket_list')
            .insert([{
                ...dream,
                couple_id: coupleId,
                created_by: user?.id,
                is_completed: false
            }])

        if (error) {
            console.error('Error adding dream:', error)
            alert('Wystąpił błąd podczas dodawania marzenia.')
        }
    }

    const toggleDream = async (id: string, completed: boolean) => {
        const { error } = await supabase
            .from('bucket_list')
            .update({ is_completed: completed })
            .eq('id', id)

        if (error) {
            console.error('Error updating dream:', error)
        }
    }

    const filteredDreams = dreams.filter(dream =>
        filter === 'wszystkie' ? true : dream.category === filter
    )

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Compass className="text-velvet-gold animate-pulse" size={24} />
                            <h1 className="text-3xl font-heading text-velvet-gold uppercase tracking-[0.2em]">Tablica Marzeń</h1>
                        </div>
                        <p className="text-gray-500 text-sm tracking-wide">Wasza wspólna przyszłość zapisana w marzeniach.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="v-button-burgundy self-start md:self-center group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        Dodaj Marzenie
                    </button>
                </div>

                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    <div className="flex items-center gap-2 mr-2 text-gray-500 py-2">
                        <Filter size={14} className="text-velvet-gold/50" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Filtruj:</span>
                    </div>
                    {(['wszystkie', 'jej', 'jego', 'wspólne'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${filter === cat
                                    ? 'bg-velvet-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-2 border-velvet-gold/20 border-t-velvet-gold rounded-full animate-spin mb-4" />
                        <p className="text-velvet-gold/50 text-[10px] uppercase tracking-widest font-bold">Otwieranie Twoich marzeń...</p>
                    </div>
                ) : filteredDreams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredDreams.map((dream) => (
                            <BucketListCard
                                key={dream.id}
                                item={dream}
                                onToggle={toggleDream}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="v-card p-12 flex flex-col items-center justify-center text-center opacity-80 border-dashed border-velvet-gold/20">
                        <div className="bg-velvet-gold/5 p-6 rounded-full mb-6">
                            <Compass className="text-velvet-gold/30" size={48} />
                        </div>
                        <h2 className="text-lg font-heading text-velvet-gold/60 uppercase tracking-widest mb-2">Tablica jest pusta</h2>
                        <p className="text-gray-600 text-sm max-w-xs mb-8">Zacznijcie planować swoje wspólne pizeżycia. Dodajcie pierwsze marzenie!</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="v-button-outline-gold"
                        >
                            Dodaj pierwsze marzenie
                        </button>
                    </div>
                )}
            </div>

            <AddDreamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDream}
            />
        </DashboardLayout>
    )
}
