'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddDreamModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (dream: { title: string, category: string, description: string, estimated_date?: string }) => void
}

export default function AddDreamModal({ isOpen, onClose, onAdd }: AddDreamModalProps) {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('wspólne')
    const [description, setDescription] = useState('')
    const [estimatedDate, setEstimatedDate] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd({ title, category, description, estimated_date: estimatedDate || undefined })
        setTitle('')
        setCategory('wspólne')
        setDescription('')
        setEstimatedDate('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-velvet-dark-alt border border-velvet-gold/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Nowe Marzenie</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Tytuł Marzenia
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Np. Kolacja w Paryżu"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Dla kogo?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['jej', 'jego', 'wspólne'].map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${category === cat
                                            ? 'bg-velvet-gold text-black border-velvet-gold'
                                            : 'bg-black/20 text-gray-500 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Opis (opcjonalnie)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Opisz Twoje marzenie..."
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Przewidywana Data
                        </label>
                        <input
                            type="date"
                            value={estimatedDate}
                            onChange={(e) => setEstimatedDate(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all [color-scheme:dark]"
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="v-button-burgundy w-full">
                            Dodaj do Tablicy Marzeń
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
