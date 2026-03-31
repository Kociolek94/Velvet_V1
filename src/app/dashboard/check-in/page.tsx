'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Sparkles, Calendar, ArrowRight, CheckCircle2, Zap, Heart, MessageCircle, HandHelping, Flame, Clock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const METRICS = [
    { id: 'closeness', label: 'Bliskość', icon: Heart, description: 'Jak blisko partnera czułeś/aś się dzisiaj?' },
    { id: 'communication', label: 'Komunikacja', icon: MessageCircle, description: 'Czy czułeś/aś się wysłuchany/a i zrozumiany/a?' },
    { id: 'support', label: 'Wsparcie', icon: HandHelping, description: 'Czy partner był dla Ciebie oparciem?' },
    { id: 'intimacy', label: 'Intymność', icon: Flame, description: 'Satysfakcja z fizycznej i emocjonalnej bliskości.' },
    { id: 'time_together', label: 'Czas', icon: Clock, description: 'Jakość wspólnie spędzonego czasu.' }
]

const DESC_LABELS: Record<string, Record<string, string>> = {
    closeness: { '1-2': 'Kryzys / Mur', '3-4': 'Dystans', '5-6': 'Poprawnie', '7-8': 'Bliskość', '9-10': 'Głęboka więź' },
    communication: { '1-2': 'Brak kontaktu', '3-4': 'Napięcie', '5-6': 'Zrozumienie', '7-8': 'Dobra rozmowa', '9-10': 'Idealny flow' },
    support: { '1-2': 'Osamotnienie', '3-4': 'Brak wsparcia', '5-6': 'Dobra pomoc', '7-8': 'Solidarność', '9-10': 'Jedność' },
    intimacy: { '1-2': 'Chłód', '3-4': 'Niedosyt', '5-6': 'Czułość', '7-8': 'Namiętność', '9-10': 'Ekstaza' },
    time_together: { '1-2': 'Osobno', '3-4': 'W biegu', '5-6': 'Ok', '7-8': 'Cenne chwile', '9-10': 'Magiczny czas' }
}

function getRangeLabel(metricId: string, val: number) {
    const range = val <= 2 ? '1-2' : val <= 4 ? '3-4' : val <= 6 ? '5-6' : val <= 8 ? '7-8' : '9-10'
    return DESC_LABELS[metricId][range] || 'Neutralnie'
}

export default function DailyCheckInPage() {
    const [metrics, setMetrics] = useState<Record<string, number>>({
        closeness: 5,
        communication: 5,
        support: 5,
        intimacy: 5,
        time_together: 5
    })
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(true)
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkToday() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const today = new Date().toISOString().split('T')[0]
                const { data } = await supabase
                    .from('daily_metrics')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('created_at', today)
                    .maybeSingle()

                if (data) setAlreadySubmitted(true)
            } catch (err) {
                console.error('Error checking today:', err)
            } finally {
                setLoading(false)
            }
        }
        checkToday()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Brak autoryzacji')

            const { data: profile } = await supabase.from('profiles').select('couple_id').eq('id', user.id).single()
            if (!profile?.couple_id) throw new Error('Musisz być w parze.')

            const { error: insertError } = await supabase
                .from('daily_metrics')
                .insert([{
                    couple_id: profile.couple_id,
                    user_id: user.id,
                    ...metrics,
                    note
                }])

            if (insertError) throw insertError

            setAlreadySubmitted(true)
            setTimeout(() => router.push('/dashboard'), 2000)
        } catch (err: any) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E14] flex flex-col items-center justify-center gap-6">
                <Loader2 size={40} className="text-velvet-gold animate-spin opacity-30" />
                <div className="animate-pulse text-velvet-gold tracking-[0.8em] font-heading text-sm uppercase pl-[0.8em]">Velvet</div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-10 px-4">

                <div className="mb-16 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-[1px] bg-velvet-gold/30" />
                        <Calendar className="text-velvet-gold" size={20} />
                        <div className="w-12 h-[1px] bg-velvet-gold/30" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-velvet-gold font-heading mb-3 tracking-tight">
                        Codzienny <span className="text-velvet-cream italic font-light">Raport</span>
                    </h1>
                    <p className="text-velvet-cream/40 text-[10px] uppercase tracking-[0.4em]">Zatrzymaj się i poczuj partnera</p>
                </div>

                {alreadySubmitted ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="v-card p-16 text-center bg-gradient-to-b from-[#0D121A] to-[#0A0E14] border-velvet-gold/20"
                    >
                        <div className="w-20 h-20 bg-velvet-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="text-velvet-gold" size={40} />
                        </div>
                        <h3 className="text-3xl font-heading text-velvet-gold mb-4 uppercase tracking-wider">Doceniamy</h3>
                        <p className="text-velvet-cream/60 leading-relaxed max-w-sm mx-auto mb-10 italic">
                            Twoja dzisiejsza uważność została zapisana. Velvet Confidant przeanalizuje dane.
                        </p>
                        <button onClick={() => router.push('/dashboard')} className="v-button-outline-gold px-12 py-4">
                            Powrót do Statusu Relacji
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in">
                        <div className="v-card p-8 md:p-12 space-y-16 bg-[#0D121A]/80 backdrop-blur-xl">
                            {METRICS.map(metric => {
                                const val = metrics[metric.id]
                                const label = getRangeLabel(metric.id, val)
                                
                                return (
                                    <div key={metric.id} className="group relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-velvet-gold/10 transition-all duration-500 border border-white/5">
                                                    <metric.icon size={20} className="text-velvet-gold" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{metric.label}</h4>
                                                    <AnimatePresence mode="wait">
                                                        <motion.p 
                                                            key={label}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className="text-velvet-gold font-bold text-sm tracking-widest mt-1"
                                                        >
                                                            {label}
                                                        </motion.p>
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            <div className="text-xs font-black text-gray-700 tracking-widest pb-1 border-b border-white/5">
                                                {val}/10
                                            </div>
                                        </div>

                                        {/* Liquid Slider */}
                                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-velvet-burgundy to-velvet-gold"
                                                initial={false}
                                                animate={{ width: `${val * 10}%` }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                value={val}
                                                onChange={(e) => setMetrics({ ...metrics, [metric.id]: parseInt(e.target.value) })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                        </div>
                                        
                                        {/* Reference ticks */}
                                        <div className="flex justify-between mt-4 px-1 opacity-20 group-hover:opacity-40 transition-opacity">
                                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                <span key={n} className="text-[8px] font-bold text-white">{n}</span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Notes Section */}
                            <div className="pt-10 border-t border-white/5">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-velvet-gold mb-6 block">
                                    Chcesz coś dodać? <span className="opacity-40 italic font-normal tracking-normal">(opcjonalnie)</span>
                                </label>
                                <div className="v-card-burgundy shadow-inner">
                                    <textarea 
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Opisz krótko, co wpłynęło dziś na Twoje oceny..."
                                        className="w-full bg-transparent p-8 text-sm text-velvet-cream/70 focus:outline-none min-h-[150px] resize-none leading-relaxed placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="v-button-burgundy min-w-[320px] flex items-center justify-center gap-6 py-7 group shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-velvet-gold/0 via-white/5 to-velvet-gold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Zap size={20} className="text-velvet-gold group-hover:scale-125 transition-transform" />
                                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white">
                                    {submitting ? 'Zapisywanie...' : 'Zatwierdź Raport'}
                                </span>
                            </button>
                        </div>

                        {error && (
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500 text-[10px] uppercase font-black tracking-widest animate-shake">
                                {error}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </DashboardLayout>
    )
}
