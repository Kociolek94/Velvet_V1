'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageCircle, Quote, X } from 'lucide-react'
import { getRecentSparks } from '@/lib/actions/sparks'
import Card from './ui/Card'

export default function SparksWidget() {
    const [sparks, setSparks] = useState<any[]>([])
    const [selectedSpark, setSelectedSpark] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRecentSparks()
                setSparks(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return (
        <Card className="p-10 flex flex-col items-center justify-center min-h-[140px] opacity-30">
            <Sparkles className="animate-spin-slow text-velvet-gold/20" size={24} />
        </Card>
    )

    if (sparks.length === 0) return null

    return (
        <Card 
            padding="none"
            className="group !overflow-visible relative border-dashed border-white/5 bg-white/[0.01] min-h-[180px] flex flex-col"
        >
            {/* Header + Content Container */}
            <div className="p-8 md:p-10 flex flex-col flex-1 !overflow-visible relative">
                
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Sparkles size={80} />
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center">
                            <Sparkles className="text-velvet-gold" size={14} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Dzisiejsze Iskry</h3>
                    </div>
                    <span className="text-[9px] text-velvet-cream/20 uppercase tracking-widest font-black">24H CYCLE</span>
                </div>

                {/* Dots Section - Increased padding and overflow visible */}
                <div className="relative flex-1 flex items-center gap-6 overflow-x-auto overflow-y-visible no-scrollbar py-12 px-4">
                    {sparks.map((spark, idx) => (
                        <motion.button
                            key={spark.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setSelectedSpark(spark)}
                            className="relative flex-shrink-0 z-10"
                        >
                            {/* Outer Glow */}
                            <motion.div 
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                                className="absolute inset-[-10px] bg-velvet-gold/40 rounded-full blur-[8px]"
                            />
                            {/* Core Point */}
                            <div className="w-3 h-3 rounded-full bg-velvet-gold border border-white/50 shadow-[0_0_10px_#D4AF37] relative z-10" />
                        </motion.button>
                    ))}
                    
                    {/* Visual Connector Line */}
                    <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
            <AnimatePresence>
                {selectedSpark && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSpark(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[70] px-4"
                        >
                            <div className="bg-[#121821] border border-velvet-gold/30 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button onClick={() => setSelectedSpark(null)} className="p-2 text-white/20 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="flex flex-col items-center text-center space-y-8 mt-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center">
                                        <Quote className="text-velvet-gold" size={24} />
                                    </div>
                                    <p className="text-xl md:text-2xl font-medium italic text-velvet-cream leading-relaxed">
                                        „{selectedSpark.content}”
                                    </p>
                                    <div className="w-12 h-[1px] bg-velvet-gold/20" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">OKRUH MIŁOŚCI</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Card>
    )
}
