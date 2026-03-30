'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react'

interface AddDiaryEntryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coupleId: string
}

export default function AddDiaryEntryModal({ isOpen, onClose, onSuccess, coupleId }: AddDiaryEntryModalProps) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    if (!isOpen) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !imageFile) return

        setUploading(true)
        try {
            // 1. Upload Image
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${coupleId}/${Date.now()}.${fileExt}`
            
            const { error: uploadError } = await supabase.storage
                .from('diary_media')
                .upload(fileName, imageFile)

            if (uploadError) throw uploadError

            // 2. Create Diary Entry
            const { error: insertError } = await supabase
                .from('diary_entries')
                .insert([{
                    couple_id: coupleId,
                    title,
                    content,
                    image_path: fileName,
                    event_date: eventDate
                }])

            if (insertError) throw insertError

            onSuccess()
            onClose()
            resetForm()
        } catch (error) {
            console.error('Error adding diary entry:', error)
            alert('Wystąpił błąd podczas zapisywania wspomnienia.')
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setContent('')
        setEventDate(new Date().toISOString().split('T')[0])
        setImageFile(null)
        setImagePreview(null)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-velvet-dark-alt border border-velvet-gold/20 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-velvet-gold/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="text-velvet-gold" size={20} />
                        <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest">Nowe Wspomnienie</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                    
                    {/* Image Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative h-64 border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer transition-all ${
                            imagePreview ? 'border-velvet-gold/40' : 'border-white/10 hover:border-velvet-gold/20'
                        }`}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3">
                                <Upload size={32} />
                                <span className="text-[10px] uppercase tracking-widest font-black">Kliknij, aby dodać zdjęcie</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Tytuł</label>
                            <input 
                                type="text" 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Np. Nasze pierwsze wakacje"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700 font-medium"
                            />
                        </div>

                        {/* Date Input */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Data Wydarzenia</label>
                            <input 
                                type="date" 
                                required
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Content Input */}
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Twoje wspomnienie</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Zapisz tutaj tę wyjątkową chwilę..."
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all placeholder:text-gray-700 resize-none font-light leading-relaxed"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || !imageFile || !title}
                        className={`v-button-burgundy w-full py-5 rounded-2xl flex items-center justify-center gap-3 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={20} className="animate-spin text-velvet-gold" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Zapisywanie w chmurze...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} className="text-velvet-gold" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Zachowaj Wspomnienie</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

function Sparkles({ size, className }: { size: number, className?: string }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
}
