'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import VPDisplay from "@/components/VPDisplay"
import VoucherCard from "@/components/VoucherCard"
import AddVoucherModal from "@/components/AddVoucherModal"
import { ShoppingBag, Heart, Plus, Sparkles, CheckCircle2 } from "lucide-react"

interface Voucher {
    id: string
    creator_id: string
    couple_id: string
    title: string
    description?: string
    cost_vp: number
    status: 'available' | 'purchased' | 'used'
    buyer_id?: string
}

export default function PrizesPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [balance, setBalance] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setUserId(user.id)

        // 1. Fetch Wallet
        const { data: wallet } = await supabase
            .from('vp_wallets')
            .select('balance, couple_id')
            .eq('user_id', user.id)
            .single()

        if (wallet) {
            setBalance(wallet.balance)
            setCoupleId(wallet.couple_id)

            // 2. Fetch Vouchers for the couple
            const { data: vData } = await supabase
                .from('vouchers')
                .select('*')
                .eq('couple_id', wallet.couple_id)
                .order('created_at', { ascending: false })

            if (vData) setVouchers(vData)
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchData()

        // Realtime integration
        const channel = supabase
            .channel('vp_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'vp_wallets' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'vouchers' },
                () => fetchData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchData])

    const handleBuy = async (vId: string, cost: number) => {
        if (!userId) return

        const { data, error } = await supabase.rpc('buy_voucher', {
            v_id: vId,
            b_id: userId
        })

        if (error) {
            console.error('Error buying voucher:', error)
            alert('Wystąpił błąd transakcji.')
        } else if (data.success) {
            setSuccessMessage(data.message)
            setTimeout(() => setSuccessMessage(null), 3000)
        } else {
            alert(data.message)
        }
    }

    const handleDelete = async (vId: string) => {
        const { error } = await supabase
            .from('vouchers')
            .delete()
            .eq('id', vId)
            .eq('creator_id', userId)

        if (error) console.error('Error deleting voucher:', error)
    }

    const marketplaceVouchers = vouchers.filter(v => v.creator_id !== userId)
    const myVouchers = vouchers.filter(v => v.creator_id === userId)

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-velvet-gold">
                            <Sparkles size={24} className="animate-pulse" />
                            <h1 className="text-4xl font-heading uppercase tracking-[0.2em] leading-none">Rynek Voucherów</h1>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="w-8 h-[1px] bg-velvet-gold/30" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-medium">Inwestuj w Wasze wspólne chwile</p>
                        </div>
                    </div>
                </div>

                {/* Balance Display */}
                <VPDisplay balance={balance} isLoading={loading} />

                {/* Success Alert */}
                {successMessage && (
                    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-velvet-gold px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center gap-4 border border-white/20">
                            <div className="p-2 bg-black/10 rounded-full">
                                <CheckCircle2 className="text-black" size={20} />
                            </div>
                            <span className="text-black font-heading text-lg uppercase tracking-widest">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Sections Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    
                    {/* Marketplace (Purchasable from Partner) */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-velvet-gold/10">
                                <ShoppingBag className="text-velvet-gold" size={20} />
                            </div>
                            <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Dostępne od partnera</h2>
                            <div className="flex-1 h-[1px] bg-velvet-gold/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {marketplaceVouchers.length > 0 ? (
                                marketplaceVouchers.map((v) => (
                                    <VoucherCard 
                                        key={v.id} 
                                        voucher={v} 
                                        currentUserId={userId!} 
                                        onBuy={handleBuy} 
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-12 px-8 rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                                    <ShoppingBag size={48} className="mb-4" />
                                    <p className="text-xs uppercase tracking-widest leading-relaxed">Partner nie wystawił jeszcze żadnych ofert.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Marketplace (Created by me) */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-velvet-burgundy/10">
                                    <Heart className="text-velvet-burgundy" size={20} />
                                </div>
                                <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Moje oferty dla partnera</h2>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="p-3 rounded-2xl bg-white/5 text-velvet-gold hover:bg-velvet-gold/10 transition-all group"
                            >
                                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myVouchers.length > 0 ? (
                                myVouchers.map((v) => (
                                    <VoucherCard 
                                        key={v.id} 
                                        voucher={v} 
                                        currentUserId={userId!} 
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-12 px-8 rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                                    <Heart size={48} className="mb-4" />
                                    <p className="text-xs uppercase tracking-widest leading-relaxed">Nie wystawiłeś jeszcze żadnych własnych voucherów.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {coupleId && userId && (
                <AddVoucherModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={fetchData}
                    coupleId={coupleId}
                    userId={userId}
                />
            )}
        </DashboardLayout>
    )
}
