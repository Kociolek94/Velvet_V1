'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Image as ImageIcon, Upload, Loader2, Sparkles, ChevronRight, ChevronLeft, Calendar, Pen } from 'lucide-react'
import DiaryTemplateSelector, { TemplateType } from './DiaryTemplateSelector'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { createDiaryEntry } from '@/lib/actions/diary'
import { DiaryContent } from '@/types/diary'

interface AddDiaryEntryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    coupleId: string
}

export default function AddDiaryEntryModal({ isOpen, onClose, onSuccess, coupleId }: AddDiaryEntryModalProps) {
    const [step, setStep] = useState(1)
    const [template, setTemplate] = useState<TemplateType>('daily')
    const [title, setTitle] = useState('')
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // Dynamic fields state
    const [templateData, setTemplateData] = useState<Record<string, any>>({})

    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    useEffect(() => {
        const getAuth = async () => {
             const { data: { user } } = await supabase.auth.getUser()
             if (user) setUserId(user.id)
        }
        getAuth()
    }, [supabase])

    if (!isOpen) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const updateField = (key: string, value: string) => {
        setTemplateData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !userId) return

        setUploading(true)
        try {
            // 1. Upload Image (Optional)
            let fileName: string | null = null
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                fileName = `${coupleId}/${Date.now()}.${fileExt}`
                
                const { error: uploadError } = await supabase.storage
                    .from('diary_media')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError
            }

            // 2. Prepare JSON Content
            const structuredContent: DiaryContent = {
                fields: templateData,
                perspectives: {},
            }

            // 3. Create Diary Entry using Server Action
            await createDiaryEntry({
                couple_id: coupleId,
                created_by: userId,
                title,
                template_type: template,
                content: structuredContent as any, // Cast to any for the DB Json field
                image_path: fileName,
                event_date: eventDate
            })

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
        setStep(1)
        setTitle('')
        setTemplateData({})
        setEventDate(new Date().toISOString().split('T')[0])
        setImageFile(null)
        setImagePreview(null)
    }

    const renderDynamicFields = () => {
        switch (template) {
            case 'origin':
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                         <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Wspólna Wizja (Nasza Historia)</label>
                            <textarea 
                                value={templateData.shared_vision || ''}
                                onChange={(e) => updateField('shared_vision', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none h-40 resize-none"
                                placeholder="Opiszcie tutaj Waszą wspólną wizję tych początków..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Twoje pierwsze wrażenie</label>
                                <textarea 
                                    value={templateData.impression_self || ''}
                                    onChange={(e) => updateField('impression_self', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 resize-none"
                                    placeholder="Co poczułeś/aś w tej pierwszej sekundzie?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Pierwsze wrażenie (Partner)</label>
                                <textarea 
                                    disabled
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sm text-velvet-cream opacity-50 h-32 resize-none"
                                    placeholder="Czekam na wspomnienia Partnera..."
                                />
                            </div>
                        </div>
                    </div>
                )
            case 'adventure':
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Nasza wspólna historia</label>
                            <textarea 
                                value={templateData.shared_vision || ''}
                                onChange={(e) => updateField('shared_vision', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 resize-none"
                                placeholder="Podsumowanie Waszej przygody..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Top 3 Momenty</label>
                            <textarea 
                                value={templateData.top_moments || ''}
                                onChange={(e) => updateField('top_moments', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none h-24"
                                placeholder="1. ..., 2. ..., 3. ..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Wpadka</label>
                                <input 
                                    value={templateData.fail || ''}
                                    onChange={(e) => updateField('fail', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Lokalny smak</label>
                                <input 
                                    value={templateData.taste || ''}
                                    onChange={(e) => updateField('taste', e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">
                        <label className="text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">Wspólna Wizja / Wspomnienie</label>
                        <textarea 
                            value={templateData.shared_vision || ''}
                            onChange={(e) => updateField('shared_vision', e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 resize-none"
                            placeholder="Zacznijcie tworzyć Waszą historię..."
                        />
                    </div>
                )
        }
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            title="Dodaj Wspomnienie"
            width="md"
        >
            <div className="flex flex-col max-h-[80vh]">
                {/* Steps Indicator */}
                <div className="px-8 py-2 flex items-center gap-2">
                    <p className="text-[10px] text-velvet-gold/40 uppercase tracking-widest font-black">
                        Krok {step} z 2: {step === 1 ? 'Wybierz Rodzaj' : 'Szczegóły'}
                    </p>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    {step === 1 ? (
                        <div className="space-y-8 py-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-velvet-cream">Co chcecie zachować?</h3>
                                <p className="text-[10px] text-velvet-cream/30 italic">Wybierz wzorzec, który najlepiej pasuje do tej chwili.</p>
                            </div>
                            <DiaryTemplateSelector 
                                selected={template} 
                                onSelect={(t) => {
                                    setTemplate(t)
                                    setStep(2)
                                }} 
                            />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
                             {/* Image Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative h-64 border-2 border-dashed rounded-[2rem] overflow-hidden cursor-pointer transition-all ${
                                    imagePreview ? 'border-velvet-gold/40' : 'border-white/5 hover:border-velvet-gold/20'
                                } group`}
                            >
                                {imagePreview ? (
                                    <div className="relative h-full group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="text-white" size={32} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-velvet-cream/30 gap-4">
                                        <div className="p-4 rounded-full bg-white/5 text-velvet-gold/40">
                                            <Upload size={32} />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">Dodaj wspólne zdjęcie (Opcjonalnie)</span>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">
                                        <Pen size={12} /> Tytuł Wspomnienia
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Np. Pod zachodzącym słońcem..."
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-velvet-cream focus:border-velvet-gold/60 outline-none transition-all placeholder:text-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-velvet-gold/60 font-black">
                                        <Calendar size={12} /> Data Wydarzenia
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-velvet-cream focus:border-velvet-gold/60 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Fields Section */}
                            <div className="pt-4 border-t border-white/5">
                                {renderDynamicFields()}
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-velvet-dark-alt/80 backdrop-blur-md py-4">
                                <Button 
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="px-8"
                                >
                                    <ChevronLeft size={16} />
                                    Wróć
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={uploading || !title}
                                    variant="burgundy"
                                    isLoading={uploading}
                                    className="flex-1 h-14"
                                >
                                    <Sparkles size={18} className="text-velvet-gold" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Zachowaj na Zawsze</span>
                                    <ChevronRight size={16} className="text-velvet-gold" />
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    )
}
