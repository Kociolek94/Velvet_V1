'use client'

import { Clock, DollarSign, Sparkles, Heart, Coffee, Zap, Info } from 'lucide-react'
import { ActivityDeckItem } from '@/types/activity'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'

interface ActivityCardProps {
    activity: ActivityDeckItem
    variant?: 'compact' | 'full'
    onClick?: () => void
}

export default function ActivityCard({ activity, variant = 'full', onClick }: ActivityCardProps) {
    const getVibeConfig = (vibe: string | null) => {
        switch (vibe) {
            case 'relax': return { icon: Coffee, color: 'text-blue-400', label: 'Relaks', variant: 'cream' as const }
            case 'adrenaline': return { icon: Zap, color: 'text-orange-400', label: 'Adrenalina', variant: 'red' as const }
            case 'romance': return { icon: Heart, color: 'text-velvet-gold', label: 'Romans', variant: 'gold' as const }
            default: return { icon: Sparkles, color: 'text-gray-400', label: 'Inne', variant: 'default' as const }
        }
    }

    const vibe = getVibeConfig(activity.vibe)
    const VibeIcon = vibe.icon

    if (variant === 'compact') {
        return (
            <Card 
                variant="dark"
                padding="sm"
                hoverEffect
                onClick={onClick}
                className="group cursor-pointer border-white/5 hover:border-velvet-gold/30 transition-all duration-700"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl bg-white/5 ${vibe.color}`}>
                        <VibeIcon size={16} />
                    </div>
                    <div className="flex gap-0.5 text-velvet-gold/40 pt-1">
                        {[...Array(4)].map((_, i) => (
                            <span key={i} className={`text-[8px] font-black ${i < (activity.cost_level || 0) ? 'text-velvet-gold' : 'text-white/5'}`}>$</span>
                        ))}
                    </div>
                </div>

                <h3 className="text-xs font-heading text-white mb-2 group-hover:text-velvet-gold transition-colors duration-500 line-clamp-1 uppercase tracking-widest">
                    {activity.title}
                </h3>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[8px] text-velvet-cream/40 font-black uppercase tracking-widest">
                        <Clock size={12} className="opacity-40" />
                        <span>{activity.duration} MIN</span>
                    </div>
                    <Badge variant={vibe.variant} size="xs">{vibe.label}</Badge>
                </div>
            </Card>
        )
    }

    return (
        <motion.div
            initial={{ rotateY: -15, scale: 0.9, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-sm mx-auto aspect-[3/4]"
        >
            <Card 
                variant="dark"
                padding="none"
                onClick={onClick}
                className="h-full relative overflow-hidden group shadow-2xl rounded-[3rem] border-white/10 cursor-pointer"
            >
                {/* Image Background Support */}
                {activity.image_url ? (
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={activity.image_url} 
                            alt={activity.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-velvet-dark via-velvet-dark/40 to-transparent" />
                        <div className="absolute inset-0 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-1000" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D0A0A] via-[#1A0505] to-[#0A0E14]">
                        <div className="absolute -top-32 -left-32 w-80 h-80 bg-velvet-gold/10 blur-[8rem] rounded-full animate-pulse" />
                        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-velvet-burgundy/20 blur-[8rem] rounded-full" />
                        {/* Overlay Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                    </div>
                )}
                
                <div className="relative h-full flex flex-col items-center text-center justify-between z-10 p-10">
                    {/* Header: Cost & Time */}
                    <div className="w-full flex justify-between items-center px-2">
                        <div className="flex items-center gap-2 text-velvet-gold bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/5">
                            <Clock size={14} className={activity.image_url ? "" : "animate-pulse"} />
                            <span className="text-[10px] font-black tracking-[0.2em]">{activity.duration} MIN</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/5">
                            {[...Array(4)].map((_, i) => (
                                <span key={i} className={`text-[12px] font-black ${i < (activity.cost_level || 0) ? 'text-velvet-gold' : 'text-white/5'}`}>$</span>
                            ))}
                        </div>
                    </div>

                    {/* Main Content: Icon & Title */}
                    <div className="flex flex-col items-center gap-8 py-4 w-full">
                        {!activity.image_url && (
                            <motion.div 
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-velvet-gold/20 to-transparent flex items-center justify-center border border-velvet-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
                            >
                                <VibeIcon size={40} className={vibe.color} />
                            </motion.div>
                        )}
                        
                        <div className="space-y-6 w-full">
                            <h2 className={`font-heading text-white leading-tight uppercase tracking-[0.2em] transition-all duration-700 ${activity.image_url ? 'text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]' : 'text-3xl'}`}>
                                {activity.title}
                            </h2>
                            
                            {activity.description ? (
                                <p className={`text-[11px] leading-relaxed italic font-light px-4 line-clamp-4 transition-colors duration-700 ${activity.image_url ? 'text-white/80 drop-shadow-md' : 'text-velvet-cream/40'}`}>
                                    "{activity.description}"
                                </p>
                            ) : (
                                <div className="h-4 w-12 bg-white/5 mx-auto rounded-full" />
                            )}
                        </div>
                    </div>

                    {/* Footer: Vibe Badge */}
                    <div className="w-full space-y-8 flex flex-col items-center">
                        <div className="flex flex-col items-center gap-3">
                            <span className={`text-[8px] uppercase tracking-[0.5em] font-black transition-colors ${activity.image_url ? 'text-white/40' : 'text-velvet-gold/40'}`}>Atmosfera</span>
                            <Badge variant={vibe.variant} size="sm" dot className="px-6 py-2 bg-black/40 backdrop-blur-md">{vibe.label}</Badge>
                        </div>
                        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-velvet-gold/20 to-transparent" />
                    </div>
                </div>

                {/* Shine Animation Effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 ease-in-out" />
            </Card>
        </motion.div>
    )
}
