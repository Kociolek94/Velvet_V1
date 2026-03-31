'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddDreamModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (dream: { 
        title: string, 
        owner_type: string, 
        description: string, 
        estimated_date?: string,
        activity_category: string,
        budget_level: number,
        vibe: string
    }) => void
}

export default function AddDreamModal({ isOpen, onClose, onAdd }: AddDreamModalProps) {
    const [title, setTitle] = useState('')
    const [ownerType, setOwnerType] = useState('wspólne')
    const [activityCategory, setActivityCategory] = useState('experience')
    const [budgetLevel, setBudgetLevel] = useState(1)
    const [vibe, setVibe] = useState('romance')
    const [description, setDescription] = useState('')
    const [estimatedDate, setEstimatedDate] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd({ 
            title, 
            owner_type: ownerType, 
            description, 
            estimated_date: estimatedDate || undefined,
            activity_category: activityCategory,
            budget_level: budgetLevel,
            vibe
        })
        setTitle('')
        setOwnerType('wspólne')
        setActivityCategory('experience')
        setBudgetLevel(1)
        setVibe('romance')
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
                                    onClick={() => setOwnerType(cat)}
                                    className={`py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${ownerType === cat
                                            ? 'bg-velvet-gold text-black border-velvet-gold'
                                            : 'bg-black/20 text-gray-500 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                                Kategoria
                            </label>
                            <select 
                                value={activityCategory}
                                onChange={(e) => setActivityCategory(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all appearance-none"
                            >
                                <option value="travel">Podróże</option>
                                <option value="experience">Przeżycia</option>
                                <option value="intimacy">Bliskość</option>
                                <option value="material">Rzeczy</option>
                                <option value="growth">Rozwój</option>
                                <option value="food">Smaki</option>
                                <option value="home">Dom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                                Vibe
                            </label>
                            <div className="flex gap-2 h-[46px]">
                                {[
                                    { id: 'relax', label: 'R' },
                                    { id: 'romance', label: 'L' },
                                    { id: 'adrenaline', label: 'A' }
                                ].map((v) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        title={v.id}
                                        onClick={() => setVibe(v.id)}
                                        className={`flex-1 rounded-lg border text-[11px] font-bold uppercase transition-all ${vibe === v.id
                                            ? 'bg-velvet-gold text-black border-velvet-gold'
                                            : 'bg-black/20 text-gray-500 border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Budżet (1-4)
                        </label>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setBudgetLevel(num)}
                                    className={`flex-1 h-10 rounded-lg border text-[14px] font-bold transition-all ${budgetLevel >= num
                                        ? 'bg-velvet-gold/20 text-velvet-gold border-velvet-gold'
                                        : 'bg-black/20 text-gray-700 border-white/5'
                                    }`}
                                >
                                    $
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
