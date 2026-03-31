'use client'

import { useState } from 'react'
import { createActivity } from '@/lib/actions/activity_deck'
import { Sparkles, Clock, DollarSign, Heart, Zap, Plus, Info } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import { ActivityInsert } from '@/types/activity'

interface AddActivityModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coupleId: string
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, coupleId }: AddActivityModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [vibe, setVibe] = useState<'relax' | 'adrenaline' | 'romance'>('romance')
    const [duration, setDuration] = useState(60)
    const [costLevel, setCostLevel] = useState(1)
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newActivity: ActivityInsert = {
                title,
                description: description || null,
                vibe: vibe as 'relax' | 'adrenaline' | 'romance',
                duration,
                cost_level: costLevel,
                couple_id: coupleId,
                is_completed: false,
                image_url: imageUrl || null
            }

            await createActivity(newActivity)
            onSuccess()
            onClose()
            resetForm()
        } catch (error) {
            console.error('Error adding activity:', error)
            alert('Coś poszło nie tak przy dodawaniu aktywności.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setVibe('romance')
        setDuration(60)
        setCostLevel(1)
        setImageUrl('')
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Nowy Pomysł"
            width="md"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-velvet-gold/10 flex items-center justify-center shadow-gold">
                    <Sparkles size={20} className="text-velvet-gold" />
                </div>
                <div>
                    <h2 className="text-lg font-heading text-velvet-gold uppercase tracking_widest">Talia Marzeń</h2>
                    <p className="text-[10px] text-velvet-cream/40 uppercase tracking_widest mt-1">Dodaj inspirację do wspólnej talii</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                {/* Image Upload - New Section */}
                <ImageUpload 
                    onUploadComplete={setImageUrl} 
                    label="Inspiracja Wizualna (Opcjonalnie)" 
                />

                {/* Title */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1">
                        Co macie ochotę zrobić?
                    </label>
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-velvet-gold/40 transition-all duration-500"
                        placeholder="Np. Wieczór z winem i winylami..."
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1">
                        Szczegóły (opcjonalnie)
                    </label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-velvet-gold/40 transition-all duration-500 min-h-[100px] resize-none"
                        placeholder="Opisz wasz pomysł..."
                    />
                </div>

                {/* Vibe Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1">
                        Atmosfera (Vibe)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'relax', icon: Heart, label: 'Relaks' },
                            { id: 'romance', icon: Sparkles, label: 'Romans' },
                            { id: 'adrenaline', icon: Zap, label: 'Akcja' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setVibe(item.id as any)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${
                                    vibe === item.id 
                                    ? 'bg-velvet-gold/10 border-velvet-gold/40 text-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                                    : 'bg-black/40 border-white/5 text-velvet-cream/20 hover:border-white/20'
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="text-[8px] uppercase tracking-widest font-black">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Duration Slider */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1 flex justify-between">
                            Czas: <span>{duration} min</span>
                        </label>
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                            <Clock size={16} className="text-velvet-gold/40" />
                            <input 
                                type="range" min="15" max="300" step="15"
                                title="Czas trwania"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="v-range flex-1"
                            />
                        </div>
                    </div>

                    {/* Cost Level */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1">
                            Budżet
                        </label>
                        <div className="flex justify-between items-center bg-black/40 p-1 rounded-2xl border border-white/5 h-[50px]">
                            {[1, 2, 3, 4].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setCostLevel(level)}
                                    className={`flex-1 h-full rounded-xl transition-all duration-500 flex justify-center items-center gap-0.5 ${
                                        costLevel === level 
                                        ? 'bg-velvet-gold/20 text-velvet-gold shadow-sm' 
                                        : 'text-velvet-cream/10 hover:text-velvet-cream/30'
                                    }`}
                                >
                                    {[...Array(level)].map((_, i) => (
                                        <DollarSign key={i} size={12} strokeWidth={3} />
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="burgundy"
                        className="w-full py-6 rounded-[1.5rem]"
                        isLoading={loading}
                        disabled={!title}
                    >
                        <Plus size={18} className="mr-2" />
                        Dodaj do Talii
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
