'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Gift, Heart, MessageCircle, Plus, Loader2 } from 'lucide-react'
import { createPartnerNotification } from '@/lib/actions/notifications'

interface AddWishItemModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coupleId: string
    userId: string
}

export default function AddWishItemModal({ isOpen, onClose, onSuccess, coupleId, userId }: AddWishItemModalProps) {
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<'Prezent' | 'Gest' | 'Słowo'>('Prezent')
    const [isSecret, setIsSecret] = useState(false)
    const [loading, setLoading] = useState(false)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('wishlists')
                .insert({
                    title,
                    link,
                    description,
                    category,
                    is_secret: isSecret,
                    user_id: userId,
                    couple_id: coupleId,
                    status: 'open'
                })

            if (error) throw error

            // Notify partner (only if not a secret)
            if (!isSecret) {
                try {
                    await createPartnerNotification({
                        type: 'wish',
                        title: 'Ktoś ma małe życzenie...',
                        content: `Partner dodał nowe życzenie: "${title}". Sprawdź, co sprawiłoby mu radość!`,
                        link: '/dashboard/wishlist',
                        coupleId: coupleId,
                        senderId: userId
                    })
                } catch (notifyError) {
                    console.error('Failed to send wishlist notification:', notifyError)
                }
            }

            onSuccess()
            onClose()
            resetForm()
        } catch (error) {
            console.error('Error adding wish item:', error)
            alert('Coś poszło nie tak przy dodawaniu życzenia.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setLink('')
        setDescription('')
        setCategory('Prezent')
        setIsSecret(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="v-card-burgundy w-full max-w-md animate-fade-in relative">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-velvet-gold transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-velvet-gold/10 flex items-center justify-center shadow-gold">
                            <Heart size={20} className="text-velvet-gold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Nowe Życzenie</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Co sprawiłoby Ci radość?</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 mb-2 block">
                                Nazwa życzenia
                            </label>
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-velvet-gold/40 transition-colors"
                                placeholder="Np. Wspólny masaż, nowa biografia..."
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 mb-2 block">
                                Kategoria
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'Prezent', icon: Gift, label: 'Prezent' },
                                    { id: 'Gest', icon: Heart, label: 'Gest' },
                                    { id: 'Słowo', icon: MessageCircle, label: 'Słowo' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setCategory(item.id as any)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                            category === item.id 
                                            ? 'bg-velvet-gold/10 border-velvet-gold/40 text-velvet-gold shadow-gold' 
                                            : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/10'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <span className="text-[8px] uppercase tracking-widest font-black">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Link & Description */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 mb-2 block">
                                    Link (opcjonalnie)
                                </label>
                                <input 
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-velvet-gold/40 transition-colors"
                                    placeholder="Wklej URL inspiracji..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 mb-2 block">
                                    Opis / Uwagi
                                </label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-velvet-gold/40 transition-colors resize-none"
                                    placeholder="Dodaj szczegóły, rozmiar lub kontekst..."
                                />
                            </div>
                        </div>

                        {/* Secret Toggle */}
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pomysł na Surprise?</span>
                            <button
                                type="button"
                                onClick={() => setIsSecret(!isSecret)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isSecret ? 'bg-velvet-gold' : 'bg-gray-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${isSecret ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        <button
                            disabled={loading || !title}
                            className="v-button-burgundy w-full mt-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Plus size={18} />
                                    <span>Dodaj do Listy</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
