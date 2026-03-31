'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import WishlistCard from "@/components/WishlistCard"
import AddWishItemModal from "@/components/AddWishItemModal"
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Heart, Plus, Users, Search, Loader2 } from "lucide-react"
import { WishlistItem } from '@/types/wishlist'

export default function WishlistPage() {
    const [activeTab, setActiveTab] = useState<'mine' | 'partner'>('mine')
    const [myWishes, setMyWishes] = useState<WishlistItem[]>([])
    const [partnerWishes, setPartnerWishes] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [reservingId, setReservingId] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('couple_id')
                .eq('id', user.id)
                .single()

            if (profile?.couple_id) {
                setCoupleId(profile.couple_id)
                
                // Fetch All Wishlist Items for the couple
                const { data: wishes } = await supabase
                    .from('wishlists')
                    .select('*')
                    .eq('couple_id', profile.couple_id)
                    .order('created_at', { ascending: false })

                if (wishes) {
                    setMyWishes(wishes.filter(w => w.user_id === user.id))
                    // Partner wishes (excluding secrets from partner)
                    setPartnerWishes(wishes.filter(w => w.user_id !== user.id && !w.is_secret))
                }
            }
        } catch (error) {
            console.error('Error fetching wishlist data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReserve = async (id: string) => {
        setReservingId(id)
        try {
            const { error } = await supabase
                .from('wishlists')
                .update({ status: 'in_progress' })
                .eq('id', id)

            if (error) throw error
            await fetchData() // Refresh data
        } catch (error) {
            console.error('Error reserving item:', error)
        } finally {
            setReservingId(null)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-velvet-gold/10 rounded-2xl flex items-center justify-center shadow-gold">
                            <Gift size={24} className="text-velvet-gold" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading tracking-widest uppercase text-velvet-gold">Lista Życzeń</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Dzielcie się marzeniami i inspiracjami</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="v-button-burgundy self-start"
                    >
                        <Plus size={18} />
                        <span>Dodaj Życzenie</span>
                    </button>
                </div>

                {/* Tabs Multi-Switcher */}
                <div className="relative flex p-1 bg-black/20 rounded-2xl border border-white/5 max-w-sm">
                    <motion.div
                        className="absolute inset-y-1 bg-velvet-gold/10 rounded-xl border border-velvet-gold/20"
                        initial={false}
                        animate={{ 
                            left: activeTab === 'mine' ? '4px' : '50%',
                            width: 'calc(50% - 4px)' 
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button
                        onClick={() => setActiveTab('mine')}
                        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                            activeTab === 'mine' ? 'text-velvet-gold' : 'text-gray-500'
                        }`}
                    >
                        <Heart size={14} />
                        Moje Życzenia
                    </button>
                    <button
                        onClick={() => setActiveTab('partner')}
                        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                            activeTab === 'partner' ? 'text-velvet-gold' : 'text-gray-500'
                        }`}
                    >
                        <Users size={14} />
                        Na Partnera
                    </button>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={40} className="text-velvet-gold animate-spin opacity-30" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-velvet-gold animate-pulse">Synchronizacja Pragnień...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {activeTab === 'mine' ? (
                                myWishes.length > 0 ? (
                                    myWishes.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            layout
                                        >
                                            <WishlistCard item={item} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState 
                                        icon={<Heart size={32} />}
                                        title="Twoja lista jest pusta"
                                        description="Dodaj coś, co sprawiłoby Ci radość. Partner będzie mógł to zobaczyć i Cię zaskoczyć."
                                        actionLabel="Dodaj pierwsze życzenie"
                                        onAction={() => setIsAddModalOpen(true)}
                                    />
                                )
                            ) : (
                                partnerWishes.length > 0 ? (
                                    partnerWishes.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            layout
                                        >
                                            <WishlistCard 
                                                item={item} 
                                                isPartner 
                                                onReserve={handleReserve}
                                                isReserving={reservingId === item.id}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState 
                                        icon={<Search size={32} />}
                                        title="Brak życzeń partnera"
                                        description="Partner nie dodał jeszcze żadnych pragnień lub wszystkie są ukryte. Zachęć go do podzielenia się inspiracjami!"
                                    />
                                )
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AddWishItemModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchData}
                coupleId={coupleId || ''}
                userId={userId || ''}
            />
        </DashboardLayout>
    )
}

function EmptyState({ icon, title, description, actionLabel, onAction }: any) {
    return (
        <div className="col-span-full py-16 flex flex-col items-center text-center gap-6 v-card-glass max-w-md mx-auto w-full">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-heading text-velvet-gold uppercase tracking-widest mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed px-8">{description}</p>
            </div>
            {actionLabel && (
                <button onClick={onAction} className="v-button-outline-gold">
                    <Plus size={16} />
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    )
}
