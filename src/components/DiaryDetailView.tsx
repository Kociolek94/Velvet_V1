'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Quote, Heart, PenTool, Save, Sparkles, Trophy, Compass, Book, Camera, Upload, Maximize2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { DiaryEntry, DiaryUpdate, DiaryContent } from '@/types/diary'
import { updateDiaryEntry } from '@/lib/actions/diary'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'

interface DiaryDetailViewProps {
    entry: DiaryEntry
    onClose: () => void
}

export default function DiaryDetailView({ entry, onClose }: DiaryDetailViewProps) {
    const [userId, setUserId] = useState<string | null>(null)
    const [myPerspective, setMyPerspective] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isImageFullscreen, setIsImageFullscreen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // Shared fields editing
    const [isEditingFields, setIsEditingFields] = useState(false)
    const [editedFields, setEditedFields] = useState<Record<string, any>>((entry.content as unknown as DiaryContent)?.fields || {})
    
    const supabase = createClient()

    const PUBLIC_STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/diary_media/`
    const imageUrl = entry.image_path ? (entry.image_path.startsWith('http') ? entry.image_path : `${PUBLIC_STORAGE_URL}${entry.image_path}`) : null

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            }
        }
        init()
    }, [supabase])

    // Keep state in sync with props for Realtime updates
    useEffect(() => {
        if (userId) {
            const content = entry.content as unknown as DiaryContent
            const perspectives = content?.perspectives || {}
            setMyPerspective(perspectives[userId] || '')
        }
        
        if (!isEditingFields) {
            const content = entry.content as unknown as DiaryContent
            setEditedFields(content?.fields || {})
        }
    }, [entry.content, userId, isEditingFields])

    const handleSavePerspective = async () => {
        if (!userId) return
        setIsSaving(true)
        try {
            const content = entry.content as unknown as DiaryContent
            const newPerspectives = {
                ...(content?.perspectives || {}),
                [userId]: myPerspective
            }
            const newContent = {
                ...content,
                perspectives: newPerspectives
            }

            await updateDiaryEntry(entry.id, { content: newContent as any })
        } catch (err) {
            console.error('Error saving perspective:', err)
            alert('Błąd podczas zapisywania wspomnienia.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveSharedFields = async () => {
        setIsSaving(true)
        try {
            const content = entry.content as unknown as DiaryContent
            const newContent = {
                ...content,
                fields: editedFields
            }

            await updateDiaryEntry(entry.id, { content: newContent as any })
            setIsEditingFields(false)
        } catch (err) {
            console.error('Error saving shared fields:', err)
            alert('Błąd podczas zapisywania historii.')
        } finally {
            setIsSaving(false)
        }
    }

    const updateSharedField = (key: string, value: string) => {
        setEditedFields((prev) => ({ ...prev, [key]: value }))
    }

    const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !userId) return
        
        setIsUploading(true)
        try {
            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${entry.couple_id || 'shared'}/${Date.now()}.${fileExt}`
            
            const { error: uploadError } = await supabase.storage
                .from('diary_media')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            await updateDiaryEntry(entry.id, { image_path: fileName })
        } catch (err) {
            console.error('Error updating image:', err)
            alert('Błąd podczas aktualizacji zdjęcia.')
        } finally {
            setIsUploading(false)
        }
    }

    const renderTemplateInfo = () => {
        const entryContent = entry.content as unknown as DiaryContent
        const fields = isEditingFields ? editedFields : (entryContent?.fields || {})
        
        switch (entry.template_type) {
            case 'origin':
                return (
                    <div className="space-y-6">
                        <Card variant="glass" className="bg-velvet-gold/5 border-velvet-gold/10">
                            <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Wspólna Wizja (Nasza Historia)</span>
                            {isEditingFields ? (
                                <textarea 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 mt-2"
                                    value={fields.shared_vision || ''}
                                    onChange={(e) => updateSharedField('shared_vision', e.target.value)}
                                />
                            ) : (
                                <p className="text-sm text-velvet-cream/70 font-light leading-relaxed mt-2">{fields.shared_vision || '...'}</p>
                            )}
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <span className="text-[8px] uppercase tracking-widest text-velvet-gold/60 font-bold">Pierwsze wrażenie autora</span>
                                <p className="text-sm text-velvet-cream/70 italic">"{fields.impression_self || '...'}"</p>
                            </div>
                        </div>
                    </div>
                )
            case 'adventure':
                return (
                    <div className="space-y-6">
                        <Card variant="glass" className="bg-velvet-gold/5 border-velvet-gold/10">
                            <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Nasza wspólna historia</span>
                            {isEditingFields ? (
                                <textarea 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 mt-2"
                                    value={fields.shared_vision || ''}
                                    onChange={(e) => updateSharedField('shared_vision', e.target.value)}
                                />
                            ) : (
                                <p className="text-sm text-velvet-cream/70 font-light leading-relaxed mt-2">{fields.shared_vision || '...'}</p>
                            )}
                        </Card>
                        <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div>
                                <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Top 3 Momenty</span>
                                {isEditingFields ? (
                                    <textarea 
                                        className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none h-20 mt-1"
                                        value={fields.top_moments || ''}
                                        onChange={(e) => updateSharedField('top_moments', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-sm text-velvet-cream/70 font-light mt-1">{fields.top_moments || '...'}</p>
                                )}
                            </div>
                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Wpadka</span>
                                    {isEditingFields ? (
                                        <input 
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none mt-1"
                                            value={fields.fail || ''}
                                            onChange={(e) => updateSharedField('fail', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-sm text-velvet-cream/70 mt-1">{fields.fail || '...'}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Smak</span>
                                    {isEditingFields ? (
                                        <input 
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none mt-1"
                                            value={fields.taste || ''}
                                            onChange={(e) => updateSharedField('taste', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-sm text-velvet-cream/70 mt-1">{fields.taste || '...'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return (
                    <Card variant="glass" className="bg-velvet-gold/5 border-velvet-gold/10">
                         <span className="text-[8px] uppercase tracking-widest text-velvet-gold font-bold">Wspólna Wizja / Wspomnienie</span>
                         {isEditingFields ? (
                                <textarea 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-velvet-cream focus:border-velvet-gold/40 outline-none h-32 mt-2"
                                    value={fields.shared_vision || fields.notes || fields.legacy_text || ''}
                                    onChange={(e) => updateSharedField('shared_vision', e.target.value)}
                                />
                            ) : (
                                <p className="text-sm text-velvet-cream/70 font-light leading-relaxed mt-2">{fields.shared_vision || fields.notes || entryContent?.legacy_text || '...'}</p>
                            )}
                    </Card>
                )
        }
    }

    const entryContent = entry.content as unknown as DiaryContent
    const partnerPerspective = userId ? Object.entries(entryContent?.perspectives || {}).find(([id]) => id !== userId)?.[1] as string : null

    return (
        <Modal 
            isOpen={true} 
            onClose={onClose}
            width="xl"
            showClose={false}
            noScroll={true}
        >
            <div className="relative flex flex-col md:flex-row -m-8 h-[90vh]">
                {/* Fixed Image Toggle Section */}
                <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden border-r border-white/5 bg-black group/sidebar">
                    {imageUrl ? (
                        <>
                            <img 
                                src={imageUrl} 
                                alt={entry.title} 
                                onClick={() => setIsImageFullscreen(true)}
                                className="w-full h-full object-cover scale-105 transition-transform duration-700 group-hover/sidebar:scale-110 cursor-zoom-in" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/sidebar:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 pointer-events-none">
                                <div className="p-4 rounded-full bg-white/10 backdrop-blur-md mb-8 border border-white/20">
                                    <Maximize2 size={24} className="text-white" />
                                </div>
                                <Button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        fileInputRef.current?.click()
                                    }}
                                    isLoading={isUploading}
                                    variant="outline"
                                    className="backdrop-blur-md pointer-events-auto"
                                >
                                    <Camera size={16} />
                                    <span>Zmień zdjęcie</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-velvet-dark-alt via-black to-velvet-dark-alt flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 blur-3xl bg-velvet-gold/10 rounded-full animate-pulse" />
                                {entry.template_type === 'origin' ? <Sparkles size={64} className="relative text-velvet-gold/10" /> : 
                                 entry.template_type === 'adventure' ? <Compass size={64} className="relative text-velvet-gold/10" /> : 
                                 entry.template_type === 'milestone' ? <Trophy size={64} className="relative text-velvet-gold/10" /> : <Book size={64} className="relative text-velvet-gold/10" />}
                            </div>
                            <Button 
                                onClick={() => fileInputRef.current?.click()}
                                isLoading={isUploading}
                                variant="outline"
                                className="backdrop-blur-md"
                            >
                                <Upload size={18} />
                                <span>Dodaj zdjęcie</span>
                            </Button>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpdate} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#0A0E14]">
                    <div className="sticky top-0 z-10 flex justify-end p-6 gap-3 bg-[#0A0E14]/80 backdrop-blur-md">
                        <Button 
                            onClick={() => isEditingFields ? handleSaveSharedFields() : setIsEditingFields(true)}
                            variant={isEditingFields ? "burgundy" : "outline"}
                            isLoading={isSaving}
                            className="group"
                        >
                            {isEditingFields ? (
                                <Save size={16} />
                            ) : (
                                <PenTool size={16} className="group-hover:scale-110 transition-transform" />
                            )}
                            <span>{isEditingFields ? "Zapisz wizję" : "Buduj wspólną wizję"}</span>
                        </Button>
                        <Button onClick={onClose} variant="ghost" className="p-3">
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="p-8 md:p-12 md:pt-0 space-y-12">
                        <div className="space-y-6">
                             <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-velvet-gold/10 text-velvet-gold">
                                    {entry.template_type === 'origin' ? <Sparkles size={24} /> : 
                                     entry.template_type === 'adventure' ? <Compass size={24} /> : 
                                     entry.template_type === 'milestone' ? <Trophy size={24} /> : <Book size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Calendar size={14} />
                                        <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">
                                            {entry.event_date ? new Date(entry.event_date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data nieustalona'}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-heading text-velvet-gold uppercase tracking-[0.1em] mt-2">
                                        {entry.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Template Data Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.5em] text-velvet-cream/30 font-black">Detale Wspomnienia</h4>
                            {renderTemplateInfo()}
                        </div>

                        {/* Perspectives Grid */}
                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] uppercase tracking-[0.5em] text-velvet-cream/30 font-black">Perspektywy Partnerów</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card padding="lg" className="bg-velvet-burgundy/5 border-velvet-burgundy/10 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <PenTool size={16} className="text-velvet-burgundy" />
                                            <span className="text-[10px] uppercase tracking-widest text-velvet-burgundy font-black">Moja Perspektywa</span>
                                        </div>
                                        <Button 
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleSavePerspective}
                                            isLoading={isSaving}
                                            className="text-velvet-burgundy hover:bg-velvet-burgundy/10"
                                        >
                                            <Save size={14} />
                                        </Button>
                                    </div>
                                    <textarea 
                                        value={myPerspective}
                                        onChange={(e) => setMyPerspective(e.target.value)}
                                        className="w-full bg-transparent text-velvet-cream/80 text-[13px] font-light leading-relaxed border-none focus:ring-0 p-0 resize-none h-32 custom-scrollbar"
                                        placeholder="Dodaj swoje unikalne spojrzenie na tę chwilę..."
                                    />
                                </Card>

                                <Card padding="lg" className="bg-white/5 border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Quote size={16} className="text-velvet-gold/40" />
                                        <span className="text-[10px] uppercase tracking-widest text-velvet-gold/40 font-black">Perspektywa Partnera</span>
                                    </div>
                                    <div className="text-velvet-cream/60 text-[13px] font-light leading-relaxed h-32 overflow-y-auto italic custom-scrollbar">
                                        {partnerPerspective || 'Czekam na Twoje wspomnienia...'}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox */}
            {isImageFullscreen && imageUrl && (
                <div 
                    className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12"
                    onClick={() => setIsImageFullscreen(false)}
                >
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" />
                    <button 
                        className="absolute top-8 right-8 z-10 p-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 transition-all group"
                        onClick={() => setIsImageFullscreen(false)}
                    >
                        <X size={32} className="group-hover:rotate-90 transition-transform" />
                    </button>
                    <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500">
                        <img 
                            src={imageUrl} 
                            alt={entry.title} 
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </Modal>
    )
}
