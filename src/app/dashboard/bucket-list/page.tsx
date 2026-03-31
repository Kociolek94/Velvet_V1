'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import BucketListCard from "@/components/BucketListCard"
import AddBucketListItemModal from "@/components/AddBucketListItemModal"
import BucketListDetailView from "@/components/BucketListDetailView"
import { Plus, Compass, Filter, Sparkles, Plane, ShoppingBag, TrendingUp, Utensils, Home, Heart, Loader2 } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { useBucketList } from '@/hooks/useBucketList'
import { BucketListItem } from '@/types/bucket-list'
import { toggleBucketListItemStatus } from '@/lib/actions/bucket_list'
import Button from '@/components/ui/Button'

interface CategoryFilterItemProps {
    active: boolean
    label: string
    icon: string
    onClick: () => void
}

function CategoryFilterItem({ active, label, icon, onClick }: CategoryFilterItemProps) {
    const Icons: Record<string, any> = { Compass, Plane, Sparkles, Heart, ShoppingBag, TrendingUp, Utensils, Home }
    const Icon = Icons[icon] || Compass

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-3 group transition-all min-w-[80px] ${active ? 'scale-110' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
        >
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${active 
                ? 'bg-velvet-gold/20 border-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] text-velvet-gold' 
                : 'bg-white/5 border-white/10 text-velvet-cream group-hover:border-velvet-gold/30'
            }`}>
                <Icon size={ active ? 24 : 20} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] font-black transition-colors ${active ? 'text-velvet-gold' : 'text-velvet-cream/40'}`}>
                {label}
            </span>
        </button>
    )
}

export default function BucketListPage() {
    const { userId, coupleId, loading } = useAuth()
    const { items: dreams, loading: loadingItems, refetch } = useBucketList(coupleId)
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedDream, setSelectedDream] = useState<BucketListItem | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [ownerFilter, setOwnerFilter] = useState<'wszystkie' | 'jej' | 'jego' | 'wspólne'>('wszystkie')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const toggleDream = async (id: string, completed: boolean) => {
        try {
            await toggleBucketListItemStatus(id, completed)
            // Realtime will handle update if useBucketList is configured for it, 
            // but we can also optimistically update or refetch
            refetch()
        } catch (err) {
            console.error('Error toggling dream:', err)
        }
    }

    const handleOpenDream = (dream: BucketListItem) => {
        setSelectedDream(dream)
        setIsDetailModalOpen(true)
    }

    const suggestRandomDream = () => {
        const uncompleted = dreams.filter(d => !d.is_completed)
        if (uncompleted.length === 0) {
            alert("Wszystkie marzenia zrealizowane! Czas dodać nowe.")
            return
        }
        const random = uncompleted[Math.floor(Math.random() * uncompleted.length)]
        handleOpenDream(random)
    }

    const filteredDreams = useMemo(() => {
        return dreams.filter(dream => {
            const matchesOwner = ownerFilter === 'wszystkie' ? true : dream.owner_type === ownerFilter
            const matchesCategory = categoryFilter === 'all' ? true : dream.activity_category === categoryFilter
            return matchesOwner && matchesCategory
        })
    }, [dreams, ownerFilter, categoryFilter])

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-velvet-gold/10 rounded-2xl text-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <Compass size={28} className="animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-heading text-velvet-gold uppercase tracking-[0.2em] leading-none pt-2">Tablica Marzeń</h1>
                        </div>
                        <p className="text-velvet-cream/40 text-[10px] uppercase tracking-[0.4em] font-black italic max-w-md leading-relaxed">
                            Wasza wspólna przyszłość zapisana w marzeniach i przeżyciach.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={suggestRandomDream}
                            className="h-14 group"
                        >
                            <Sparkles size={18} className="text-velvet-gold animate-pulse mr-3" />
                            <span className="uppercase tracking-widest font-black text-[10px]">Zasugeruj coś</span>
                        </Button>
                        <Button
                            variant="burgundy"
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-14 group"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 mr-3" />
                            <span className="uppercase tracking-widest font-black text-[10px]">Dodaj Marzenie</span>
                        </Button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-10 mb-16">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 mr-4 text-velvet-gold/40">
                            <Filter size={14} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Dla kogo:</span>
                        </div>
                        {(['wszystkie', 'jej', 'jego', 'wspólne'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setOwnerFilter(cat)}
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${ownerFilter === cat
                                        ? 'bg-velvet-gold text-black shadow-[0_0_25px_rgba(212,175,55,0.3)] scale-105'
                                        : 'bg-white/5 text-velvet-cream/30 hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative py-4 overflow-x-auto no-scrollbar border-y border-white/5">
                        <div className="flex items-center gap-10 pb-2 min-w-max">
                            <CategoryFilterItem active={categoryFilter === 'all'} label="Wszystkie" icon="Compass" onClick={() => setCategoryFilter('all')} />
                            <CategoryFilterItem active={categoryFilter === 'travel'} label="Podróże" icon="Plane" onClick={() => setCategoryFilter('travel')} />
                            <CategoryFilterItem active={categoryFilter === 'experience'} label="Przeżycia" icon="Sparkles" onClick={() => setCategoryFilter('experience')} />
                            <CategoryFilterItem active={categoryFilter === 'intimacy'} label="Bliskość" icon="Heart" onClick={() => setCategoryFilter('intimacy')} />
                            <CategoryFilterItem active={categoryFilter === 'material'} label="Rzeczy" icon="ShoppingBag" onClick={() => setCategoryFilter('material')} />
                            <CategoryFilterItem active={categoryFilter === 'growth'} label="Rozwój" icon="TrendingUp" onClick={() => setCategoryFilter('growth')} />
                            <CategoryFilterItem active={categoryFilter === 'food'} label="Smaki" icon="Utensils" onClick={() => setCategoryFilter('food')} />
                            <CategoryFilterItem active={categoryFilter === 'home'} label="Dom" icon="Home" onClick={() => setCategoryFilter('home')} />
                        </div>
                    </div>
                </div>

                {/* Grid Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-30">
                        <Loader2 size={32} className="text-velvet-gold animate-spin" />
                        <p className="text-velvet-gold text-[9px] uppercase tracking-[0.5em] font-black italic">Otwieranie skarbca marzeń...</p>
                    </div>
                ) : filteredDreams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {filteredDreams.map((dream) => (
                            <BucketListCard
                                key={dream.id}
                                item={dream}
                                onToggle={toggleDream}
                                onOpen={handleOpenDream}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[4rem] p-24 flex flex-col items-center justify-center text-center group hover:border-velvet-gold/20 transition-all duration-1000">
                        <div className="bg-velvet-gold/5 p-10 rounded-full mb-8 relative">
                            <Compass className="text-velvet-gold/20 group-hover:rotate-45 transition-transform duration-1000" size={64} />
                            <div className="absolute inset-0 bg-velvet-gold/10 blur-[3rem] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-2xl font-heading text-velvet-gold/40 uppercase tracking-[0.2em] mb-4">Pusta Tablica</h2>
                        <p className="text-velvet-cream/20 text-[10px] uppercase tracking-[0.3em] font-black italic max-w-xs mb-10 leading-relaxed pr-2">
                            Wasza wspólna podróż czeka na pierwszy wpis. Co chcecie razem przeżyć?
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-12"
                        >
                            Dodaj pierwsze marzenie
                        </Button>
                    </div>
                )}
            </div>

                {coupleId && (
                    <AddBucketListItemModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        coupleId={coupleId}
                        onSuccess={refetch}
                    />
                )}

                {selectedDream && (
                    <BucketListDetailView
                        isOpen={isDetailModalOpen}
                        onClose={() => setIsDetailModalOpen(false)}
                        item={selectedDream}
                        userId={userId || ''}
                        onSuccess={refetch}
                    />
                )}
        </DashboardLayout>
    )
}
