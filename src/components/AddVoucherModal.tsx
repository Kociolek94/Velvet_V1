'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Gift, Sparkles, Loader2 } from 'lucide-react'

interface AddVoucherModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coupleId: string
    userId: string
}

export default function AddVoucherModal({ isOpen, onClose, onSuccess, coupleId, userId }: AddVoucherModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [costVp, setCostVp] = useState(300)
    const [loading, setLoading] = useState(false)
    
    const supabase = createClient()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || costVp < 1) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('vouchers')
                .insert([{
                    couple_id: coupleId,
                    creator_id: userId,
                    title,
                    description,
                    cost_vp: costVp,
                    status: 'available'
                }])

            if (error) throw error

            onSuccess()
            onClose()
            resetForm()
        } catch (error) {
            console.error('Error adding voucher:', error)
            alert('Wystąpił błąd podczas dodawania vouchera.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setCostVp(300)
    }

    const commonPrices = [100, 300, 500, 1000]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-velvet-dark-alt border border-velvet-gold/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-velvet-gold/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <Gift className="text-velvet-gold" size={20} />
                        <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Nowy Voucher</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-black">Co oferujesz partnerowi?</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Np. Wieczór z ulubionym filmem"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-black">Opisz tę nagrodę (opcjonalnie)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Wybierasz film, ja robię popcorn..."
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700 resize-none font-light leading-relaxed text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-black">Cena (Velvet Points)</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {commonPrices.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setCostVp(p)}
                                    className={`px-6 py-2 rounded-xl text-xs font-heading tracking-widest transition-all ${
                                        costVp === p 
                                        ? 'bg-velvet-gold text-black border-velvet-gold' 
                                        : 'bg-white/5 text-velvet-gold/40 border border-white/10 hover:border-velvet-gold/30'
                                    }`}
                                >
                                    {p} VP
                                </button>
                            ))}
                        </div>
                        <input 
                            type="number" 
                            required
                            min="1"
                            value={costVp}
                            onChange={(e) => setCostVp(parseInt(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all font-heading tracking-widest"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !title || costVp < 1}
                        className={`v-button-burgundy w-full py-5 rounded-2xl flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin text-velvet-gold" />
                        ) : (
                            <>
                                <Sparkles size={18} className="text-velvet-gold" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Opublikuj Ofertę</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
