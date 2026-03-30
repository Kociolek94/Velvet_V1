'use client'

import { Coins, TrendingUp } from 'lucide-react'

interface VPDisplayProps {
    balance: number
    isLoading?: boolean
}

export default function VPDisplay({ balance, isLoading }: VPDisplayProps) {
    return (
        <div className="relative group overflow-hidden bg-velvet-dark-alt border border-velvet-gold/20 rounded-[3rem] p-10 shadow-2xl transition-all duration-500 hover:border-velvet-gold/40">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-velvet-gold/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-velvet-gold/10 transition-colors" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-velvet-gold/60">
                        <div className="p-2 bg-velvet-gold/10 rounded-xl">
                            <TrendingUp size={16} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">Twój Portfel Premium</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        {isLoading ? (
                            <div className="h-16 w-32 bg-white/5 animate-pulse rounded-2xl" />
                        ) : (
                            <h2 className="text-6xl md:text-8xl font-heading text-velvet-gold uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                {balance.toLocaleString()}
                            </h2>
                        )}
                        <span className="text-2xl font-heading text-velvet-gold/40 uppercase tracking-widest">VP</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-velvet-gold/10 to-transparent border border-velvet-gold/20 shadow-inner group-hover:scale-105 transition-transform duration-700">
                        <Coins className="text-velvet-gold animate-[bounce_3s_infinite]" size={48} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-velvet-cream text-sm font-medium">Status: VIP Elite</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                            Zbieraj punkty za wspólne nawyki <br />i cele z tablicy marzeń.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Action text */}
            <div className="mt-8 flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-bold text-velvet-gold/40">
                <div className="w-12 h-[1px] bg-velvet-gold/20" />
                <span>Zapracuj na nagrody partnera</span>
            </div>
        </div>
    )
}
