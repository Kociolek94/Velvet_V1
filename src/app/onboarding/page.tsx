'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Heart, ShieldCheck, ChevronRight, LogOut, Loader2, AlertCircle, User, CheckCircle2 } from 'lucide-react'

export default function OnboardingPage() {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [step, setStep] = useState<'profile' | 'pairing'>('profile')
    const [displayName, setDisplayName] = useState('')
    const [pairingCode, setPairingCode] = useState('')
    const [generatedCode, setGeneratedCode] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile?.couple_id) {
                router.push('/dashboard')
            } else {
                setProfile(profile)
                if (profile?.display_name) {
                    setStep('pairing')
                }
                setLoading(false)
            }
        }
        getProfile()
    }, [supabase, router])

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!displayName.trim()) return
        setLoading(true)
        setError(null)

        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ display_name: displayName.trim() })
                .eq('id', profile.id)

            if (profileError) throw profileError

            setProfile({ ...profile, display_name: displayName.trim() })
            setStep('pairing')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const generateCode = async () => {
        setLoading(true)
        setError(null)

        // Generate random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        try {
            // 1. Create a new couple record
            const { data: couple, error: coupleError } = await supabase
                .from('couples')
                .insert([{ pairing_code: code }])
                .select()
                .single()

            if (coupleError) throw coupleError

            // 2. Assign current user to this couple
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ couple_id: couple.id })
                .eq('id', profile.id)

            if (profileError) throw profileError

            setGeneratedCode(code)
        } catch (err: any) {
            setError(err.message === 'Database error saving new row' ? 'Problem z bazą danych (RLS). Spróbuj ponownie lub skontaktuj się z adminem.' : err.message)
        } finally {
            setLoading(false)
        }
    }

    const joinCouple = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Find the couple by code
            const { data: couple, error: coupleError } = await supabase
                .from('couples')
                .select('id')
                .eq('pairing_code', pairingCode)
                .single()

            if (coupleError) throw new Error('Nieprawidłowy kod lub para nie istnieje.')

            // 2. Assign current user to this couple
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ couple_id: couple.id })
                .eq('id', profile.id)

            if (profileError) throw profileError

            setSuccess(true)
            setTimeout(() => router.push('/dashboard'), 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading && !generatedCode && !profile) {
        return (
            <div className="min-h-screen bg-velvet-dark flex flex-col items-center justify-center gap-4">
                <Loader2 className="text-velvet-gold animate-spin" size={32} />
                <span className="text-velvet-gold text-[10px] uppercase tracking-[0.5em] font-bold">Weryfikacja...</span>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-velvet-dark p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(74,14,14,0.15),_transparent_40%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05),_transparent_40%)] pointer-events-none" />

            <div className="w-full max-w-4xl z-10 flex flex-col items-center">

                <header className="mb-16 text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Sparkles className="text-velvet-gold" size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-velvet-gold font-heading mb-4 tracking-tight uppercase">
                        {step === 'profile' ? 'Witaj w' : 'Wasza'} <span className="text-velvet-cream italic font-light lowercase">{step === 'profile' ? 'Velvet' : 'Wspólna Podróż'}</span>
                    </h1>
                    <p className="text-velvet-cream/40 text-sm tracking-widest uppercase">
                        {step === 'profile' ? 'Jak mamy się do Ciebie zwracać?' : 'Zainicjuj parę lub dołącz do istniejącej'}
                    </p>
                </header>

                {step === 'profile' ? (
                    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="v-card p-10 flex flex-col items-center">
                            <div className="bg-velvet-gold/10 p-5 rounded-3xl mb-8">
                                <User className="text-velvet-gold" size={40} />
                            </div>

                            <form onSubmit={saveProfile} className="w-full space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-velvet-gold text-[10px] uppercase tracking-[0.4em] font-black text-center">Twoje Imię / Nick</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="np. N. Markowska"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-center text-xl text-white focus:border-velvet-gold/50 focus:outline-none transition-all placeholder:text-white/10"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !displayName.trim()}
                                    className="w-full v-button-gold py-5 shadow-2xl group"
                                >
                                    <span className="flex items-center justify-center gap-3 uppercase tracking-[0.3em] font-bold text-[11px]">
                                        Kontynuuj
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-in fade-in zoom-in-95 duration-700">
                        {/* Module 1: Generate Code */}
                        <div className="v-card p-10 flex flex-col items-center text-center group">
                            <div className="bg-velvet-gold/10 p-5 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Heart className="text-velvet-gold" size={32} />
                            </div>
                            <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest mb-4">Jestem Pierwszy</h2>
                            <p className="text-velvet-cream/40 text-[11px] leading-relaxed max-w-[240px] mb-10">Stwórz nowy ekosystem Velvet i wyślij unikalny kod swojemu partnerowi.</p>

                            {generatedCode ? (
                                <div className="w-full animate-in scale-in duration-500">
                                    <p className="text-[9px] text-velvet-cream/30 mb-3 uppercase tracking-widest font-bold">Twój Unikalny Kod</p>
                                    <div className="text-4xl font-mono font-bold text-white bg-black/40 p-6 border border-velvet-gold/20 rounded-2xl tracking-[0.6em] mb-6 shadow-inner ring-1 ring-white/5">
                                        {generatedCode}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-velvet-gold animate-pulse text-[10px] font-bold uppercase tracking-widest">
                                        <Loader2 size={12} className="animate-spin" />
                                        <span>Oczekiwanie na partnera...</span>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={generateCode}
                                    disabled={loading}
                                    className="w-full v-button-outline-gold py-5"
                                >
                                    Generuj Kod Pary
                                </button>
                            )}
                        </div>

                        {/* Module 2: Join Couple */}
                        <div className="v-card p-10 flex flex-col items-center text-center group">
                            <div className="bg-velvet-burgundy/20 p-5 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="text-velvet-gold" size={32} />
                            </div>
                            <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest mb-4">Mam już kod</h2>
                            <p className="text-velvet-cream/40 text-[11px] leading-relaxed max-w-[240px] mb-10">Wpisz 6-cyfrowy kod, aby natychmiast połączyć się ze swoją drugą połówką.</p>

                            <form onSubmit={joinCouple} className="w-full space-y-6">
                                <input
                                    type="text"
                                    value={pairingCode}
                                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                                    maxLength={6}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-center text-3xl font-mono tracking-[0.4em] text-white focus:border-velvet-gold/50 focus:outline-none transition-all placeholder:text-white/5"
                                    placeholder="000000"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading || pairingCode.length < 6 || success}
                                    className={`w-full v-button-burgundy py-5 group ${success ? 'bg-emerald-600 border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}
                                >
                                    <span className="text-[12px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                        {success ? (
                                            <>
                                                <CheckCircle2 size={18} />
                                                Połączono!
                                            </>
                                        ) : (
                                            <>
                                                Połącz z Partnerem
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-12 p-5 bg-velvet-burgundy/10 border border-velvet-burgundy/20 rounded-2xl flex items-center gap-4 text-velvet-gold text-[11px] uppercase font-bold tracking-widest animate-shake max-w-lg">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="mt-16 flex items-center gap-8 text-[10px] uppercase tracking-[0.4em] font-bold text-velvet-cream/20">
                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                        className="hover:text-velvet-gold transition-colors flex items-center gap-2"
                    >
                        <Loader2 size={14} className={loading ? 'animate-spin' : 'hidden'} />
                        <LogOut size={14} className={loading ? 'hidden' : ''} />
                        <span>Wyloguj Się</span>
                    </button>
                    {step === 'pairing' && !profile?.display_name && (
                        <button onClick={() => setStep('profile')} className="hover:text-velvet-gold transition-colors">
                            Wstecz
                        </button>
                    )}
                </div>

            </div>

            <style jsx global>{`
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    opacity: 0;
                    animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </main>
    )
}
