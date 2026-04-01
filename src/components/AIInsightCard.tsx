'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, RefreshCcw } from 'lucide-react'
import { generateRelationshipInsight } from '@/lib/actions/velvet_engine'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function AIInsightCard() {
    const [insight, setInsight] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchInsight = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await generateRelationshipInsight()
            if ('error' in result) {
                setError(result.error as string)
            } else {
                setInsight(result.insight as string)
            }
        } catch (err) {
            setError('Błąd połączenia z Velvet Confidant')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInsight()
    }, [])

    return (
        <Card className="v-card-burgundy md:p-16 p-10 overflow-hidden relative group min-h-[400px]">
            {/* Animated Background Element */}
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-100 transition-transform duration-1000 pointer-events-none">
                <Sparkles size={200} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10 w-full">
                <div className="md:col-span-8 space-y-10 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-velvet-gold/20 flex items-center justify-center border border-velvet-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                <Sparkles className="text-velvet-gold" size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-velvet-gold/80">Velvet Confidant</h3>
                                <div className="h-[1px] w-20 bg-gradient-to-r from-velvet-gold/40 to-transparent" />
                            </div>
                        </div>
                        
                        {!loading && (
                            <button 
                                onClick={fetchInsight}
                                className="text-velvet-gold/40 hover:text-velvet-gold transition-colors p-2 rounded-full hover:bg-white/5"
                                title="Odśwież analizę"
                            >
                                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col justify-center py-4">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-4 w-full"
                                >
                                    <div className="h-8 bg-white/5 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-8 bg-white/5 rounded-full w-1/2 animate-pulse" />
                                </motion.div>
                            ) : error ? (
                                <motion.p 
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xl font-light text-red-400 italic"
                                >
                                    {error}
                                </motion.p>
                            ) : (
                                <motion.p 
                                    key="content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-xl md:text-3xl font-light text-white leading-relaxed italic font-serif w-full"
                                >
                                    "{insight}"
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <Badge variant="gold" className="bg-velvet-gold/10 border-velvet-gold/20 px-4 py-2">ANALIZA DYNAMIKI</Badge>
                        <Badge variant="cream" className="bg-white/5 border-white/10 px-4 py-2 text-white/40 uppercase tracking-widest text-[9px]">Głębokie Połączenie</Badge>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-6 md:border-l md:border-white/5">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-velvet-gold/20 flex items-center justify-center p-2 relative">
                        {loading ? (
                             <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-2 rounded-full bg-velvet-gold/10 blur-xl"
                             />
                        ) : (
                            <div className="absolute inset-2 rounded-full border border-velvet-gold/40 animate-pulse shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
                        )}
                        <Heart className={`${loading ? 'text-velvet-gold/20' : 'text-velvet-gold'}`} size={40} />
                    </div>
                    <div className="text-center space-y-2">
                        <span className="text-[10px] text-velvet-cream/40 uppercase tracking-[0.3em] font-black">Twoja Ścieżka</span>
                        <p className="text-xs text-white uppercase tracking-widest font-bold">Tryb: Velvet Confidant (Gemini)</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
