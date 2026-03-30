'use client'

import { ShoppingCart, CheckCircle, Clock, Trash2, Sparkles } from 'lucide-react'

interface VoucherCardProps {
    voucher: {
        id: string
        title: string
        description?: string
        cost_vp: number
        status: 'available' | 'purchased' | 'used'
        creator_id: string
    }
    currentUserId: string
    onBuy?: (id: string, cost: number) => void
    onDelete?: (id: string) => void
    onOpenModal?: (id: string) => void
}

export default function VoucherCard({ voucher, currentUserId, onBuy, onDelete, onOpenModal }: VoucherCardProps) {
    const isOwner = voucher.creator_id === currentUserId
    const isAvailable = voucher.status === 'available'
    const isPurchased = voucher.status === 'purchased'
    const isUsed = voucher.status === 'used'

    return (
        <div className={`v-card relative p-8 group transition-all duration-500 hover:border-velvet-gold/40 border-white/5 ${!isAvailable ? 'opacity-60' : ''}`}>
            
            {/* Corner Rank/Price */}
            <div className={`absolute top-0 right-0 p-3 bg-gradient-to-br from-velvet-gold/20 to-transparent border-l border-b border-velvet-gold/20 rounded-bl-3xl group-hover:bg-velvet-gold/30 transition-all`}>
                <span className="text-sm font-heading text-velvet-gold uppercase tracking-widest">{voucher.cost_vp} VP</span>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-heading text-velvet-gold uppercase tracking-widest leading-tight mb-2">
                        {voucher.title}
                    </h3>
                    <p className="text-gray-500 text-xs font-light leading-relaxed max-w-[80%] line-clamp-2">
                        {voucher.description || 'Kreatywna nagroda od partnera.'}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {isOwner ? (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-velvet-cream/40 flex items-center gap-2">
                                <Clock size={12} />
                                {isAvailable ? 'Twoja oferta' : isPurchased ? 'Sprzedano' : 'Zrealizowano'}
                            </span>
                            {isAvailable && onDelete && (
                                <button 
                                    onClick={() => onDelete(voucher.id)}
                                    className="p-2 rounded-xl bg-white/5 text-velvet-burgundy/40 hover:bg-velvet-burgundy/10 hover:text-velvet-burgundy transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            {isAvailable ? (
                                <button 
                                    onClick={() => onBuy?.(voucher.id, voucher.cost_vp)}
                                    className="v-button-burgundy w-full py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                >
                                    <ShoppingCart size={18} className="text-velvet-gold" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Kup voucher</span>
                                </button>
                            ) : isPurchased ? (
                                <div className="py-4 bg-velvet-gold/5 border border-velvet-gold/10 rounded-2xl flex items-center justify-center gap-3 text-velvet-gold/40">
                                    <CheckCircle size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Kupiono</span>
                                </div>
                            ) : (
                                <div className="py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-gray-600">
                                    <Sparkles size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Wykorzystano</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
