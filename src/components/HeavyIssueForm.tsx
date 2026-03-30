'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    ChevronRight,
    ChevronLeft,
    Check,
    AlertCircle,
    MessageSquare,
    Heart,
    Shield,
    Sparkles,
    Wind,
    Send
} from 'lucide-react'

const STEPS = [
    { title: 'Fakt', icon: MessageSquare, description: 'Co się wydarzyło?' },
    { title: 'Emocje', icon: Heart, description: 'Co poczułeś/aś?' },
    { title: 'Wtedy', icon: Shield, description: 'Czego potrzebowałeś/aś?' },
    { title: 'Przyszłość', icon: Sparkles, description: 'Jak partner może pomóc?' },
    { title: 'Teraz', icon: Wind, description: 'Czego potrzebujesz teraz?' },
]

const EMOTIONS = ['samotność', 'złość', 'smutek', 'lekceważenie', 'lęk', 'bezsilność', 'rozczarowanie']

export default function HeavyIssueForm() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        fact: '',
        emotions: [] as string[],
        need_then: '',
        future_help: '',
        need_now: ''
    })

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const toggleEmotion = (emotion: string) => {
        setFormData(prev => ({
            ...prev,
            emotions: prev.emotions.includes(emotion)
                ? prev.emotions.filter(e => e !== emotion)
                : [...prev.emotions, emotion]
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Nie jesteś zalogowany.')

            const { data: profile } = await supabase
                .from('profiles')
                .select('couple_id')
                .eq('id', user.id)
                .single()

            if (!profile?.couple_id) throw new Error('Nie masz jeszcze aktywnej pary.')

            const { error: insertError } = await supabase
                .from('issues')
                .insert([{
                    couple_id: profile.couple_id,
                    author_id: user.id,
                    type: 'heavy',
                    status: 'new',
                    content: formData
                }])

            if (insertError) throw insertError

            router.push('/dashboard/issues')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <textarea
                            value={formData.fact}
                            onChange={e => setFormData({ ...formData, fact: e.target.value })}
                            placeholder="Opisz obiektywnie sytuację, która miała miejsce..."
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-velvet-cream placeholder:text-white/10 focus:border-velvet-gold/30 focus:outline-none transition-all resize-none font-light leading-relaxed"
                        />
                    </div>
                )
            case 2:
                return (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-8 duration-500">
                        {EMOTIONS.map(emotion => (
                            <button
                                key={emotion}
                                onClick={() => toggleEmotion(emotion)}
                                className={`p-4 rounded-xl border text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${formData.emotions.includes(emotion)
                                        ? 'bg-velvet-gold/20 border-velvet-gold/50 text-velvet-gold'
                                        : 'bg-white/5 border-white/5 text-velvet-cream/40 hover:border-white/20'
                                    }`}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <textarea
                            value={formData.need_then}
                            onChange={e => setFormData({ ...formData, need_then: e.target.value })}
                            placeholder="Czego zabrakło Ci w tamtym momencie? Podziel się swoją potrzebą..."
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-velvet-cream placeholder:text-white/10 focus:border-velvet-gold/30 focus:outline-none transition-all resize-none font-light leading-relaxed"
                        />
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <textarea
                            value={formData.future_help}
                            onChange={e => setFormData({ ...formData, future_help: e.target.value })}
                            placeholder="Jak partner może zareagować następnym razem, byś czuł/a się bezpiecznie?"
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-velvet-cream placeholder:text-white/10 focus:border-velvet-gold/30 focus:outline-none transition-all resize-none font-light leading-relaxed"
                        />
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <textarea
                            value={formData.need_now}
                            onChange={e => setFormData({ ...formData, need_now: e.target.value })}
                            placeholder="Przytulenie, chwila rozmowy, a może po prostu spokój? Czego potrzebujesz w tej sekundzie?"
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-velvet-cream placeholder:text-white/10 focus:border-velvet-gold/30 focus:outline-none transition-all resize-none font-light leading-relaxed"
                        />
                    </div>
                )
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-12 px-2">
                {STEPS.map((s, i) => {
                    const number = i + 1
                    const isActive = step === number
                    const isCompleted = step > number
                    const Icon = s.icon

                    return (
                        <div key={s.title} className="flex flex-col items-center gap-3 group relative">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-velvet-gold text-velvet-dark shadow-gold scale-110' :
                                    isCompleted ? 'bg-velvet-gold/20 text-velvet-gold' :
                                        'bg-white/5 text-velvet-cream/20'
                                }`}>
                                {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                            </div>
                            <span className={`text-[8px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${isActive ? 'text-velvet-gold' : 'text-velvet-cream/20'
                                }`}>
                                {s.title}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div className="absolute top-5 left-12 w-8 h-[1px] bg-white/5 hidden md:block" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Form Card */}
            <div className="v-card p-10 relative overflow-hidden">
                <div className="mb-8">
                    <h2 className="text-2xl font-heading text-velvet-gold uppercase tracking-widest mb-2">
                        {STEPS[step - 1].description}
                    </h2>
                    <p className="text-[10px] text-velvet-cream/30 uppercase tracking-[0.4em]">Krok {step} z 5</p>
                </div>

                {renderStep()}

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] uppercase font-bold tracking-widest">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="mt-10 pt-8 border-t border-white/5 flex justify-between gap-4">
                    <button
                        onClick={prevStep}
                        className={`v-button-outline px-8 py-4 flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronLeft size={18} />
                        <span>Wstecz</span>
                    </button>

                    {step < 5 ? (
                        <button
                            onClick={nextStep}
                            disabled={step === 1 && !formData.fact || step === 2 && formData.emotions.length === 0}
                            className="v-button-gold px-10 py-4 flex items-center gap-2 group disabled:opacity-30 disabled:grayscale transition-all"
                        >
                            <span>Dalej</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.need_now}
                            className="v-button-burgundy px-12 py-4 flex items-center gap-3 group relative overflow-hidden"
                        >
                            <span className="relative z-10">{loading ? 'Wysyłanie...' : 'Wyślij Zgłoszenie'}</span>
                            {!loading && <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
