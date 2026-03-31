'use client'

import { Check, Plane, Sparkles, Heart, ShoppingBag, TrendingUp, Utensils, Home, Compass, Calendar } from 'lucide-react'
import { BucketListItem } from '@/types/bucket-list'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'

interface BucketListCardProps {
    item: BucketListItem
    onToggle: (id: string, completed: boolean) => void
    onOpen: (item: BucketListItem) => void
}

export default function BucketListCard({ item, onToggle, onOpen }: BucketListCardProps) {
    const categoryIcons: Record<string, any> = {
        travel: Plane,
        experience: Sparkles,
        intimacy: Heart,
        material: ShoppingBag,
        growth: TrendingUp,
        food: Utensils,
        home: Home
    }

    const CatIcon = categoryIcons[item.activity_category || ''] || Compass

    const ownerVariant = (owner: string) => {
        if (owner === 'jej') return 'red'
        if (owner === 'jego') return 'cream'
        return 'gold'
    }

    return (
        <Card 
            variant="dark"
            padding="none"
            hoverEffect={!item.is_completed}
            onClick={() => onOpen(item)}
            className={`group h-full flex flex-col overflow-hidden transition-all duration-700 ${item.is_completed ? 'opacity-60 saturate-[0.2]' : ''}`}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                {item.image_url ? (
                    <Image 
                        src={item.image_url} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                ) : (
                    <div className="absolute inset-0 bg-velvet-gold/5 flex items-center justify-center">
                        <CatIcon size={48} className="text-velvet-gold/20" />
                    </div>
                )}
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant={ownerVariant(item.owner_type)} size="xs">
                        {item.owner_type}
                    </Badge>
                    <Badge variant="default" size="xs" dot>
                        {item.activity_category}
                    </Badge>
                </div>

                <div className="absolute top-4 right-4">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggle(item.id, !item.is_completed)
                        }}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 backdrop-blur-md ${item.is_completed
                                ? 'bg-velvet-gold border-velvet-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                : 'border-white/20 bg-black/40 text-transparent hover:border-velvet-gold hover:text-velvet-gold/40'
                            }`}
                    >
                        <Check size={20} strokeWidth={3} className={item.is_completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} />
                    </button>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-xl font-heading leading-tight transition-all duration-500 ${item.is_completed ? 'line-through text-velvet-cream/30' : 'text-velvet-gold'}`}>
                        {item.title}
                    </h3>
                    <div className="flex gap-0.5 ml-3 pt-1">
                        {[...Array(4)].map((_, i) => (
                            <span key={i} className={`text-[10px] font-black ${i < (item.budget_level || 0) ? 'text-velvet-gold' : 'text-white/10'}`}>
                                $
                            </span>
                        ))}
                    </div>
                </div>

                {item.description && (
                    <p className="text-velvet-cream/40 text-[11px] uppercase tracking-widest line-clamp-2 mb-6 font-bold leading-relaxed">
                        {item.description}
                    </p>
                )}

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-black italic">
                    <div className="flex items-center gap-2 text-velvet-cream/30">
                        {item.estimated_date && (
                            <>
                                <Calendar size={12} />
                                <span>{new Date(item.estimated_date).toLocaleDateString('pl-PL')}</span>
                            </>
                        )}
                    </div>
                    
                    {item.is_completed ? (
                        <div className="flex items-center gap-2 text-velvet-gold">
                            <Sparkles size={12} className="animate-pulse" />
                            <span>Zrealizowane</span>
                        </div>
                    ) : (
                        <span className="text-velvet-cream/10 group-hover:text-velvet-gold transition-colors duration-500 font-black">Sczegóły marzenia</span>
                    )}
                </div>
            </div>
        </Card>
    )
}
