'use client'

import { Flame, User, Users } from 'lucide-react'

interface HabitItemProps {
    id: string
    title: string
    streak: number
    isCompletedMe: boolean
    isCompletedPartner: boolean
    onToggle: (habitId: string, completed: boolean) => void
    partnerName?: string
}

export default function HabitItem({
    id,
    title,
    streak,
    isCompletedMe,
    isCompletedPartner,
    onToggle,
    partnerName = 'Partner'
}: HabitItemProps) {
    return (
        <div className="v-card-gold-border p-4 md:p-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-velvet-gold/[0.02] transition-all">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                    <Flame
                        size={24}
                        className={streak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-700'}
                        fill={streak > 0 ? 'currentColor' : 'none'}
                    />
                    <span className={`text-[10px] font-bold mt-1 ${streak > 0 ? 'text-orange-500' : 'text-gray-700'}`}>
                        {streak} DNI
                    </span>
                </div>

                <h3 className="text-lg font-heading text-velvet-gold uppercase tracking-wider">{title}</h3>
            </div>

            <div className="flex items-center gap-8 md:gap-12 px-4">
                {/* My Checkbox */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Ja</span>
                    <button
                        onClick={() => onToggle(id, !isCompletedMe)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompletedMe
                                ? 'bg-velvet-gold border-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] text-black'
                                : 'border-velvet-gold/20 bg-black/40 text-transparent hover:border-velvet-gold/40'
                            }`}
                    >
                        <User size={20} strokeWidth={isCompletedMe ? 3 : 2} className={isCompletedMe ? 'block' : 'group-hover:block group-hover:text-velvet-gold/20'} />
                    </button>
                </div>

                {/* Partner Checkbox */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold truncate max-w-[60px] text-center">
                        {partnerName}
                    </span>
                    <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${isCompletedPartner
                                ? 'bg-velvet-gold border-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] text-black'
                                : 'border-velvet-gold/10 bg-black/20 text-transparent'
                            }`}
                    >
                        <Users size={20} strokeWidth={isCompletedPartner ? 3 : 2} className={isCompletedPartner ? 'block' : ''} />
                    </div>
                </div>
            </div>
        </div>
    )
}
