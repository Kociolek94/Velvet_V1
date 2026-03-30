'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const METRICS = [
    { id: 'closeness', label: 'Bliskość', description: 'Jak blisko partnera czułeś/aś się dzisiaj?' },
    { id: 'communication', label: 'Komunikacja', description: 'Czy czułeś/aś się wysłuchany/a i zrozumiany/a?' },
    { id: 'support', label: 'Wsparcie', description: 'Czy partner był dla Ciebie oparciem?' },
    { id: 'intimacy', label: 'Intymność', description: 'Poziom satysfakcji z fizycznej i emocjonalnej bliskości.' },
    { id: 'time_together', label: 'Czas', description: 'Jakość wspólnie spędzonego czasu.' }
]

export default function DailyCheckInForm() {
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

            if (!profile?.couple_id) throw new Error('Musisz być w parze, aby wysłać metryki.')

            const { error: insertError } = await supabase
                .from('daily_metrics')
                .insert([{
                    couple_id: profile.couple_id,
                    user_id: user.id,
                    ...metrics
                }])

            if (insertError) {
                if (insertError.code === '23505') throw new Error('Dzisiejszy check-in został już wysłany.')
                throw insertError
            }

            setAlreadySubmitted(true)
            setTimeout(() => router.push('/dashboard/issues'), 1500)
        } catch (err: any) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    if (loading) return <div className="text-velvet-gold animate-pulse">Ładowanie...</div>

    if (alreadySubmitted) {
        return (
            <div className="text-center p-8 bg-velvet-dark/50 border border-velvet-gold/20 rounded-3xl">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Check-in wykonany!</h3>
                <p className="text-gray-400 text-sm">Dziękujemy za dbanie o swoją relację dzisiaj. Wróć jutro!</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl p-8 bg-velvet-dark/50 border border-velvet-burgundy/30 rounded-3xl backdrop-blur-xl shadow-2xl space-y-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-velvet-gold uppercase tracking-widest">Codzienne Potrzeby</h2>
                <p className="text-gray-500 text-xs mt-2 italic">Poświęć minutę, aby ocenić dzisiejszą jakość Waszej relacji.</p>
            </div>

            <div className="space-y-12">
                {METRICS.map(metric => (
                    <div key={metric.id} className="relative">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label className="text-white font-bold text-sm block">{metric.label}</label>
                                <p className="text-[10px] text-gray-500 max-w-[200px]">{metric.description}</p>
                            </div>
                            <span className="text-2xl font-mono font-bold text-velvet-gold bg-velvet-gold/5 w-12 h-12 flex items-center justify-center rounded-lg border border-velvet-gold/20">
                                {metrics[metric.id]}
                            </span>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={metrics[metric.id]}
                            onChange={(e) => setMetrics({ ...metrics, [metric.id]: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-velvet-burgundy 
                range-thumb:w-6 range-thumb:h-6 range-thumb:bg-velvet-gold range-thumb:border-2 range-thumb:border-black"
                        />
                        {/* Range markers */}
                        <div className="flex justify-between px-1 mt-2 text-[8px] text-gray-600 font-bold uppercase tracking-tighter">
                            <span>Niski</span>
                            <span>Średni</span>
                            <span>Wysoki</span>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-velvet-burgundy text-white font-bold rounded-2xl hover:bg-opacity-80 transition-all border border-velvet-gold/30 uppercase tracking-[0.2em] text-xs shadow-lg mt-12 disabled:opacity-50"
            >
                {submitting ? 'Zapisywanie...' : 'Zapisz Check-in'}
            </button>

            {error && (
                <p className="text-red-500 text-xs text-center p-3 bg-red-500/5 border border-red-500/20 rounded-lg">{error}</p>
            )}
        </form>
    )
}
