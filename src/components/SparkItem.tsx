'use client'

import { motion } from 'framer-motion'
import { Sparkles, Quote } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface SparkItemProps {
    content: string
    date: string
    isPartner?: boolean
}

export default function SparkItem({ content, date, isPartner = false }: SparkItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${
                isPartner 
                ? 'bg-velvet-gold/5 border-velvet-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]' 
                : 'bg-velvet-burgundy/5 border-velvet-burgundy/10 shadow-[0_0_20px_rgba(158,43,43,0.05)]'
            }`}
        >
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br ${
                isPartner ? 'from-velvet-gold/10 to-transparent' : 'from-velvet-burgundy/5 to-transparent'
            }`} />
            
            {/* Top Accent Icon */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-xl border ${
                    isPartner ? 'bg-velvet-gold/10 border-velvet-gold/20' : 'bg-white/5 border-white/10'
                }`}>
                    <Sparkles size={18} className={isPartner ? 'text-velvet-gold' : 'text-velvet-burgundy'} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-velvet-cream/20">
                    {format(new Date(date), 'd MMMM HH:mm', { locale: pl })}
                </span>
            </div>

            {/* Content with Large Quote */}
            <div className="relative z-10">
                <Quote 
                    size={48} 
                    className={`absolute -top-4 -left-2 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 ${
                        isPartner ? 'text-velvet-gold' : 'text-white'
                    }`} 
                />
                <p className="text-lg md:text-xl font-medium text-velvet-cream/90 leading-relaxed italic relative pl-4">
                    {content}
                </p>
            </div>

            {/* Footer Accent */}
            <div className="mt-8 flex items-center gap-2 relative z-10">
                <div className={`w-1 h-1 rounded-full ${isPartner ? 'bg-velvet-gold' : 'bg-velvet-burgundy'}`} />
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${
                    isPartner ? 'text-velvet-gold/60' : 'text-velvet-burgundy/60'
                }`}>
                    {isPartner ? 'Okruch od Partnera' : 'Twój Okruch'}
                </span>
            </div>
        </motion.div>
    )
}
