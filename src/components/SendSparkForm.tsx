'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendSpark } from '@/lib/actions/sparks'
import Button from './ui/Button'

export default function SendSparkForm() {
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || submitting) return

        setSubmitting(true)
        setError(null)

        try {
            await sendSpark(content)
            setContent('')
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd podczas wysyłania iskry')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8">
            <div className="relative group">
                {/* Glow Background */}
                <div className="absolute inset-[-4px] bg-gradient-to-r from-velvet-burgundy/20 to-velvet-gold/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                
                <div className="relative v-card-burgundy !p-0 overflow-hidden bg-black/40 backdrop-blur-3xl border-white/5 group-hover:border-velvet-gold/20 transition-all duration-700">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Napisz krótki okruch miłości dla Twojego partnera..."
                        className="w-full bg-transparent p-10 text-xl md:text-2xl font-light italic text-velvet-cream placeholder:text-velvet-cream/20 focus:outline-none min-h-[180px] resize-none leading-relaxed transition-all"
                        disabled={submitting}
                        maxLength={280}
                    />
                    
                    <div className="flex justify-between items-center p-8 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-4">
                            <Sparkles className="text-velvet-gold/40 animate-pulse" size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-velvet-cream/10">+50 VP ZA OKRUCH</span>
                        </div>
                        
                        <Button
                            type="submit"
                            variant="gold"
                            disabled={!content.trim() || submitting}
                            className="rounded-2xl px-10 h-[54px] shadow-gold group/btn overflow-hidden relative"
                        >
                            <AnimatePresence mode="wait">
                                {submitting ? (
                                    <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Loader2 className="animate-spin" size={18} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                                        <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Wyślij Iskrę</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-center gap-3 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-500"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Okruch został rozpalony!</span>
                    </motion.div>
                )}
                {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] uppercase font-bold tracking-widest text-center mt-4">
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </form>
    )
}
