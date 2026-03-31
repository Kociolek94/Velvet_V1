'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Sparkles } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import { createBucketListItem } from '@/lib/actions/bucket_list'
import { BucketListInsert } from '@/types/bucket-list'

interface AddBucketListItemModalProps {
    isOpen: boolean
    onClose: () => void
    coupleId: string
    onSuccess?: () => void
}

export default function AddBucketListItemModal({ isOpen, onClose, coupleId, onSuccess }: AddBucketListItemModalProps) {
    const [title, setTitle] = useState('')
    const [ownerType, setOwnerType] = useState<'jej' | 'jego' | 'wspólne'>('wspólne')
    const [activityCategory, setActivityCategory] = useState('experience')
    const [budgetLevel, setBudgetLevel] = useState(1)
    const [vibe, setVibe] = useState('romance')
    const [description, setDescription] = useState('')
    const [estimatedDate, setEstimatedDate] = useState('')
    
    const [imageUrl, setImageUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const newItem: BucketListInsert = {
                title,
                owner_type: ownerType,
                activity_category: activityCategory,
                budget_level: budgetLevel,
                vibe,
                description,
                estimated_date: estimatedDate || null,
                couple_id: coupleId,
                image_url: imageUrl || null,
                is_completed: false
            }

            await createBucketListItem(newItem)
            
            // Reset form
            setTitle('')
            setOwnerType('wspólne')
            setActivityCategory('experience')
            setBudgetLevel(1)
            setVibe('romance')
            setDescription('')
            setEstimatedDate('')
            setImageUrl('')
            
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating bucket list item:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Nowe Marzenie"
            width="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                {/* Image Upload Area */}
                <ImageUpload 
                    onUploadComplete={setImageUrl} 
                    label="Inspiracja dla waszego marzenia" 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                Co chcecie przeżyć?
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Np. Noc pod gwiazdami w Saharze"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-velvet-cream placeholder:text-velvet-cream/10 focus:border-velvet-gold/30 outline-none transition-all font-heading"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                Dla kogo?
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['jej', 'jego', 'wspólne'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setOwnerType(type)}
                                        className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${ownerType === type
                                                ? 'bg-velvet-gold text-black border-velvet-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                                : 'bg-white/5 text-velvet-cream/30 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                    Kategoria
                                </label>
                                <select 
                                    value={activityCategory}
                                    onChange={(e) => setActivityCategory(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs text-velvet-cream focus:border-velvet-gold/30 outline-none transition-all appearance-none uppercase tracking-widest font-bold"
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
                                <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                    Budżet (1-4)
                                </label>
                                <div className="flex gap-2 h-[52px]">
                                    {[1, 2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setBudgetLevel(num)}
                                            className={`flex-1 rounded-xl border text-[14px] font-black transition-all duration-500 ${budgetLevel >= num
                                                ? 'bg-velvet-gold/20 text-velvet-gold border-velvet-gold'
                                                : 'bg-white/5 text-velvet-cream/10 border-white/5'
                                            }`}
                                        >
                                            $
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                Opis (opcjonalnie)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Dodaj kilka słów o tym marzeniu..."
                                rows={5}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[13px] text-velvet-cream placeholder:text-velvet-cream/10 focus:border-velvet-gold/30 outline-none transition-all resize-none leading-relaxed font-light"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.4em] text-velvet-gold mb-3 font-black italic">
                                Planowany Termin
                            </label>
                            <input
                                type="date"
                                value={estimatedDate}
                                onChange={(e) => setEstimatedDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs text-velvet-cream focus:border-velvet-gold/30 outline-none transition-all [color-scheme:dark] uppercase tracking-widest font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        variant="burgundy"
                        className="w-full h-16 group"
                        disabled={isSubmitting || !title.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span className="ml-3 uppercase tracking-widest font-black">Planowanie przyszłości...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                <span className="ml-3 uppercase tracking-widest font-black">Zapisz Marzenie</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
