'use client'

import { createClient } from '@/utils/supabase/client'
import { Check } from 'lucide-react'

interface BucketListItem {
    id: string
    title: string
    category: 'jej' | 'jego' | 'wspólne'
    is_completed: boolean
    description?: string
    estimated_date?: string
}

interface BucketListCardProps {
    item: BucketListItem
    onToggle: (id: string, completed: boolean) => void
}

export default function BucketListCard({ item, onToggle }: BucketListCardProps) {
    const categoryColors = {
        jej: 'bg-pink-900/30 text-pink-200 border-pink-500/30',
        jego: 'bg-blue-900/30 text-blue-200 border-blue-500/30',
        wspólne: 'bg-velvet-gold/10 text-velvet-gold border-velvet-gold/30'
    }

    return (
        <div className={`v-card-gold-border p-5 flex flex-col justify-between h-full group hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all ${item.is_completed ? 'opacity-60' : ''}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryColors[item.category]}`}>
                        {item.category}
                    </span>
                    <button
                        onClick={() => onToggle(item.id, !item.is_completed)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${item.is_completed
                                ? 'bg-velvet-gold border-velvet-gold text-black'
                                : 'border-velvet-gold/30 bg-black/40 text-transparent hover:border-velvet-gold'
                            }`}
                    >
                        <Check size={14} strokeWidth={3} className={item.is_completed ? 'block' : 'group-hover:block group-hover:text-velvet-gold/40'} />
                    </button>
                </div>

                <h3 className={`text-lg font-semibold leading-tight mb-2 ${item.is_completed ? 'line-through text-gray-500' : 'text-velvet-gold'}`}>
                    {item.title}
                </h3>

                {item.description && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {item.description}
                    </p>
                )}
            </div>

            {(item.estimated_date || item.is_completed) && (
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500">
                    <span>{item.estimated_date ? new Date(item.estimated_date).toLocaleDateString('pl-PL') : ''}</span>
                    {item.is_completed && <span className="text-velvet-gold font-bold">Zrealizowane</span>}
                </div>
            )}
        </div>
    )
}
