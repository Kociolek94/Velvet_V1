'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Sparkles, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'

const METRICS = [
    { id: 'closeness', label: 'Bliskość', description: 'Jak blisko partnera czułeś/aś się dzisiaj?' },
    { id: 'communication', label: 'Komunikacja', description: 'Czy czułeś/aś się wysłuchany/a i zrozumiany/a?' },
    { id: 'support', label: 'Wsparcie', description: 'Czy partner był dla Ciebie oparciem?' },
    { id: 'intimacy', label: 'Intymność', description: 'Satysfakcja z fizycznej i emocjonalnej bliskości.' },
    { id: 'time_together', label: 'Czas', description: 'Jakość wspólnie spędzonego czasu.' }
]

export default function DailyCheckInPage() {
    const [metrics, setMetrics] = useState<Record<string, number>>({
        closeness: 5,
        communication: 5,
        support: 5,
        intimacy: 5,
        time_together: 5
    })
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

                if (data) {
                    setAlreadySubmitted(true)
                }
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
                    ...metrics
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
                <div className="w-16 h-[1px] bg-velvet-gold/20 animate-expand" />
                <div className="animate-pulse text-velvet-gold tracking-[0.8em] font-heading text-sm uppercase pl-[0.8em]">Velvet</div>
                <div className="w-16 h-[1px] bg-velvet-gold/20 animate-expand" />
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-10">

                {/* Header Container */}
                <div className="mb-16 text-center">
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        {/* Removed redundant logo on desktop sidebar layout */}
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-[1px] bg-velvet-gold/30" />
                        <Calendar className="text-velvet-gold" size={20} />
                        <div className="w-12 h-[1px] bg-velvet-gold/30" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-velvet-gold font-heading mb-3 tracking-tight">
                        Daily <span className="text-velvet-cream italic font-light">Check-in</span>
                    </h1>
                    <p className="text-velvet-cream/40 text-sm tracking-widest uppercase">Zatrzymaj się na chwilę dla Waszej relacji</p>
                </div>

                {alreadySubmitted ? (
                    <div className="v-card p-16 text-center animate-fade-in bg-gradient-to-b from-[#0D121A] to-[#0A0E14] border-velvet-gold/20">
                        <div className="w-20 h-20 bg-velvet-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="text-velvet-gold" size={40} />
                        </div>
                        <h3 className="text-3xl font-heading text-velvet-gold mb-4 uppercase tracking-wider">Doceniamy</h3>
                        <p className="text-velvet-cream/60 leading-relaxed max-w-sm mx-auto mb-10">
                            Twoja dzisiejsza uważność została zapisana. Velvet Confidant przeanalizuje dane dla Twojej partnerki.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="v-button-outline-gold px-12 py-4 text-[10px] uppercase tracking-[0.3em]"
                        >
                            Powrót do Dashboardu
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                        <div className="v-card p-8 md:p-12 space-y-12 bg-[#0D121A]/50 backdrop-blur-md">
                            {METRICS.map(metric => (
                                <div key={metric.id} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="text-velvet-gold text-sm uppercase tracking-[0.2em] font-bold">{metric.label}</h4>
                                            <p className="text-velvet-cream/30 text-[11px] font-light">{metric.description}</p>
                                        </div>
                                        <div className="text-3xl font-bold font-mono text-velvet-gold bg-velvet-gold/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-velvet-gold/10 shadow-inner">
                                            {metrics[metric.id]}
                                        </div>
                                    </div>

                                    <div className="relative pt-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            value={metrics[metric.id]}
                                            onChange={(e) => setMetrics({ ...metrics, [metric.id]: parseInt(e.target.value) })}
                                            className="v-range w-full"
                                        />
                                        <div className="flex justify-between mt-4 px-1">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                <span key={n} className={`text-[9px] font-bold transition-colors ${metrics[metric.id] === n ? 'text-velvet-gold' : 'text-white/10'}`}>
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="v-button-burgundy min-w-[300px] flex items-center justify-center gap-4 py-6 group"
                            >
                                <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-velvet-gold">
                                    {submitting ? 'Zapisywanie...' : 'Zatwierdź Raport'}
                                </span>
                                <ArrowRight className="text-velvet-gold group-hover:translate-x-2 transition-transform" size={20} />
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-500 text-[10px] uppercase font-bold tracking-widest animate-shake">
                                {error}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </DashboardLayout>
    )
}

