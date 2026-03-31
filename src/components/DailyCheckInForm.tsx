'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, HandHelping, Flame, Clock, Plus, Loader2, CheckCircle2, Zap } from 'lucide-react'

const METRICS = [
    { id: 'closeness', label: 'Bliskość', icon: Heart, description: 'Jak blisko partnera czułeś/aś się dzisiaj?' },
    { id: 'communication', label: 'Komunikacja', icon: MessageCircle, description: 'Czy czułeś/aś się wysłuchany/a i zrozumiany/a?' },
    { id: 'support', label: 'Wsparcie', icon: HandHelping, description: 'Czy partner był dla Ciebie oparciem?' },
    { id: 'intimacy', label: 'Intymność', icon: Flame, description: 'Poziom satysfakcji z fizycznej i emocjonalnej bliskości.' },
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
    return DESC_LABELS[metricId][range]
}

export default function DailyCheckInForm() {
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
            setLoading(false)
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

            const { data: profile } = await supabase
                .from('profiles')
                .select('couple_id')
                .eq('id', user.id)
                .single()

            const { error: insertError } = await supabase
                .from('daily_metrics')
                .insert([{
                    couple_id: profile?.couple_id,
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-velvet-gold animate-spin opacity-30" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-velvet-gold animate-pulse">Ładowanie stanu...</span>
        </div>
    )

    if (alreadySubmitted) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 v-card-burgundy max-w-md mx-auto"
            >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 mx-auto mb-8">
                    <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-heading text-white mb-4 uppercase tracking-widest">Check-in wykonany</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">„Relacja to nie coś, co znajdziesz, ale coś, co powoli budujesz.”</p>
                <div className="h-1 w-24 bg-velvet-gold/20 mx-auto rounded-full" />
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-12 pb-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-heading text-velvet-gold uppercase tracking-[0.3em] mb-4">Codzienne Potrzeby</h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em]">Zatrzymaj się i poczuj partnera</p>
            </div>

            <div className="space-y-16">
                {METRICS.map(metric => {
                    const val = metrics[metric.id]
                    const label = getRangeLabel(metric.id, val)
                    // Gradient based on value (Burgundy to Gold)
                    const progressColor = `hsl(${20 + val * 3}, 60%, ${30 + val * 2}%)`

                    return (
                        <div key={metric.id} className="relative group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-velvet-gold/10 transition-all duration-500 border border-white/5">
                                        <metric.icon size={20} className="text-velvet-gold" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-white block mb-1">
                                            {metric.label}
                                        </label>
                                        <motion.p 
                                            key={`${metric.id}-${label}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-velvet-gold font-bold text-sm tracking-widest h-5"
                                        >
                                            {label}
                                        </motion.p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-700 tracking-widest">
                                    {val}/10
                                </span>
                            </div>

                            {/* Liquid Slider Container */}
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
                        </div>
                    )
                })}
            </div>

            {/* Notes Section with Soft Gold Branding */}
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-velvet-gold mb-4 block ml-4">
                    Chcesz coś dodać? <span className="opacity-40 italic">(opcjonalnie)</span>
                </label>
                <div className="v-card-burgundy p-2">
                     <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Opisz krótko, co wpłynęło dziś na Twoje oceny..."
                        className="w-full bg-transparent p-6 text-sm text-gray-300 focus:outline-none min-h-[120px] resize-none leading-relaxed"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-6 bg-velvet-burgundy text-white font-bold rounded-3xl group shadow-2xl relative overflow-hidden disabled:opacity-50"
            >
                <div className="relative z-10 flex items-center justify-center gap-4">
                    {submitting ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <>
                            <Zap size={20} className="text-velvet-gold group-hover:scale-125 transition-transform" />
                            <span className="text-[12px] uppercase tracking-[0.4em] font-black">Zapisz mój stan</span>
                        </>
                    )}
                </div>
            </button>

            {error && (
                <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20 shadow-lg shadow-red-500/5 mt-8"
                >
                    {error}
                </motion.p>
            )}
        </form>
    )
}
