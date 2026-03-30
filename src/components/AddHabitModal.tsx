'use client'

import { useState } from 'react'
import { X, Activity } from 'lucide-react'

interface AddHabitModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (title: string) => void
}

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
    const [title, setTitle] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd(title)
        setTitle('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-velvet-dark-alt border border-velvet-gold/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Activity className="text-velvet-gold" size={20} />
                        <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Nowy Nawyk</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">
                            Nazwa wspólnego nawyku
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Np. Wieczorne czytanie, Trening..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="v-button-burgundy w-full uppercase tracking-widest text-[11px]">
                            Utwórz Nawyk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
