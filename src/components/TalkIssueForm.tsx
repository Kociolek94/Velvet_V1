'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    MessageCircle,
    Calendar,
    ShieldAlert,
    VolumeX,
    Send,
    AlertCircle,
    Clock
} from 'lucide-react'
import VelvetDateTimePicker from './VelvetDateTimePicker'

type Priority = 'red' | 'yellow' | 'green'

export default function TalkIssueForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        title: '',
        priority: 'green' as Priority,
        needs_quiet_space: false,
        scheduled_at: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                    type: 'talk',
                    status: 'new',
                    priority: formData.priority,
                    needs_quiet_space: formData.needs_quiet_space,
                    scheduled_at: formData.scheduled_at || null,
                    content: { title: formData.title }
                }])

            if (insertError) throw insertError

            router.push('/dashboard/issues')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto v-card p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 text-center">
                <h2 className="text-2xl font-heading text-velvet-gold uppercase tracking-widest mb-2">Zaplanuj Rozmowę</h2>
                <p className="text-[10px] text-velvet-cream/30 uppercase tracking-[0.4em]">Skupienie i wspólny czas</p>
            </div>

            <div className="space-y-8">
                {/* Topic Input */}
                <div className="space-y-3">
                    <label className="text-[10px] text-velvet-gold uppercase tracking-widest font-bold ml-2">Temat Rozmowy</label>
                    <div className="relative group">
                        <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-velvet-cream/20 group-focus-within:text-velvet-gold transition-colors" size={20} />
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="O czym chcesz porozmawiać?"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-velvet-cream placeholder:text-white/10 focus:border-velvet-gold/30 focus:outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Priority Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] text-velvet-gold uppercase tracking-widest font-bold ml-2">Intensywność Tematu</label>
                    <div className="grid grid-cols-3 gap-4">
                        {(['red', 'yellow', 'green'] as Priority[]).map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setFormData({ ...formData, priority: p })}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${formData.priority === p
                                        ? p === 'red' ? 'bg-red-500/20 border-red-500 text-red-500' :
                                            p === 'yellow' ? 'bg-amber-500/20 border-amber-500 text-amber-500' :
                                                'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                        : 'bg-white/5 border-white/5 text-velvet-cream/20 hover:border-white/10'
                                    }`}
                            >
                                <ShieldAlert size={20} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">
                                    {p === 'red' ? 'Trudny' : p === 'yellow' ? 'Ważny' : 'Lekki'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Time Picker */}
                    <div className="space-y-3">
                        <label className="text-[10px] text-velvet-gold uppercase tracking-widest font-bold ml-2">Proponowany Termin</label>
                        <div className="relative group">
                            <VelvetDateTimePicker 
                                value={formData.scheduled_at}
                                onChange={(iso) => setFormData({ ...formData, scheduled_at: iso })}
                                placeholder="Kliknij, aby wybrać termin..."
                            />
                        </div>
                    </div>

                    {/* Quiet Space Checkbox */}
                    <div className="space-y-3">
                        <label className="text-[10px] text-velvet-gold uppercase tracking-widest font-bold ml-2">Wymagania</label>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, needs_quiet_space: !formData.needs_quiet_space })}
                            className={`w-full h-[58px] rounded-2xl border flex items-center justify-between px-6 transition-all duration-300 ${formData.needs_quiet_space
                                    ? 'bg-velvet-gold/10 border-velvet-gold/40 text-velvet-gold'
                                    : 'bg-white/5 border-white/5 text-velvet-cream/20 hover:border-white/10'
                                }`}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">Spokojna przestrzeń</span>
                            <VolumeX size={18} className={formData.needs_quiet_space ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] uppercase font-bold tracking-widest">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/5">
                <button
                    type="submit"
                    disabled={loading || !formData.title}
                    className="w-full v-button-gold py-5 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-30"
                >
                    <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.3em]">
                        {loading ? 'Planowanie...' : 'Wyślij Propozycję Rozmowy'}
                    </span>
                    {!loading && <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
            </div>
        </form>
    )
}
