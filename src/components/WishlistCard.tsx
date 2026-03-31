'use client'

import { Gift, Heart, MessageCircle, ExternalLink, CheckCircle2, Loader2, BookmarkCheck } from 'lucide-react'
import { WishlistItem } from '@/types/wishlist'

interface WishlistCardProps {
    item: WishlistItem
    isPartner?: boolean
    onReserve?: (id: string) => void
    isReserving?: boolean
}

export default function WishlistCard({ item, isPartner, onReserve, isReserving }: WishlistCardProps) {
    const getCategoryIcon = (category: string | null) => {
        switch (category?.toLowerCase()) {
            case 'prezent': return <Gift size={16} className="text-velvet-gold" />
            case 'gest': return <Heart size={16} className="text-pink-400" />
            case 'słowo': return <MessageCircle size={16} className="text-blue-400" />
            default: return <BookmarkCheck size={16} className="text-gray-400" />
        }
    }

    // Jeśli status jest 'in_progress' i to MOJA lista (nie partnera), udajemy że jest 'open'
    const displayStatus = (!isPartner && item.status === 'in_progress') ? 'open' : item.status

    return (
        <div className="v-card-burgundy p-6 flex flex-col justify-between h-full group hover:border-velvet-gold/30 transition-all">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                            {item.category || 'Inne'}
                        </span>
                    </div>

                    {displayStatus === 'in_progress' && isPartner && (
                        <div className="flex items-center gap-1.5 text-velvet-gold animate-pulse">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">W realizacji</span>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-heading text-white mb-2 group-hover:text-velvet-gold transition-colors">
                    {item.title}
                </h3>

                {item.description && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 italic">
                        {item.description}
                    </p>
                )}
            </div>

            <div className="mt-4 space-y-4">
                {item.link && (
                    <a 
                        href={item.link.startsWith('http') ? item.link : `https://${item.link}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] text-velvet-gold/60 hover:text-velvet-gold transition-colors font-bold uppercase tracking-widest"
                    >
                        <ExternalLink size={14} />
                        Zobacz inspirację
                    </a>
                )}

                {isPartner && item.status === 'open' && (
                    <button
                        onClick={() => onReserve?.(item.id)}
                        disabled={isReserving}
                        className="w-full v-button-burgundy py-3 text-[11px] h-auto flex items-center justify-center gap-2"
                    >
                        {isReserving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <>
                                <Heart size={14} />
                                <span>Zrealizuję to!</span>
                            </>
                        )}
                    </button>
                )}
                
                {isPartner && item.status === 'in_progress' && (
                    <div className="w-full py-3 border border-velvet-gold/20 rounded-xl flex items-center justify-center gap-2 bg-velvet-gold/5">
                        <CheckCircle2 size={14} className="text-velvet-gold" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-velvet-gold">Wybrane przez Ciebie</span>
                    </div>
                )}
            </div>
        </div>
    )
}
