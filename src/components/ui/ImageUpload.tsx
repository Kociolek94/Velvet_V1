'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { uploadMedia } from '@/lib/actions/media'
import Badge from './Badge'

interface ImageUploadProps {
    onUploadComplete: (url: string) => void
    label?: string
    defaultValue?: string
}

export default function ImageUpload({ onUploadComplete, label = "Dodaj Zdjęcie", defaultValue }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null)
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 1. Create local preview
        const localUrl = URL.createObjectURL(file)
        setPreview(localUrl)
        setUploading(true)
        setStatus('idle')

        // 2. Upload to storage via Server Action
        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const { url } = await uploadMedia(formData)
            onUploadComplete(url)
            setStatus('success')
        } catch (error) {
            console.error('Upload failed:', error)
            setStatus('error')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
        setStatus('idle')
        if (fileInputRef.current) fileInputRef.current.value = ''
        onUploadComplete('')
    }

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-velvet-cream/40 px-1">
                    {label}
                </label>
            )}
            
            <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 min-h-[160px] flex items-center justify-center bg-black/40 ${
                    preview 
                    ? 'border-velvet-gold/20' 
                    : 'border-white/5 hover:border-velvet-gold/30'
                }`}
            >
                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div 
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            
                            <button 
                                onClick={removeImage}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-red-500/80 transition-colors z-20 group/remove"
                            >
                                <X size={18} className="text-white group-hover/remove:scale-110 transition-transform" />
                            </button>

                            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                {uploading ? (
                                    <Badge variant="gold" className="bg-black/40 backdrop-blur-md animate-pulse">
                                        <Loader2 size={12} className="animate-spin" />
                                        PROCESOWANIE...
                                    </Badge>
                                ) : status === 'success' ? (
                                    <Badge variant="green" className="bg-emerald-500/20 backdrop-blur-md">
                                        <CheckCircle2 size={12} />
                                        GOTOWE
                                    </Badge>
                                ) : (
                                    <Badge variant="default" className="bg-black/40 backdrop-blur-md">
                                        ZMIEŃ ZDJĘCIE
                                    </Badge>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="placeholder"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-4 p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-velvet-gold/5 border border-velvet-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <Upload className="text-velvet-gold/40 group-hover:text-velvet-gold transition-colors" size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-white uppercase tracking-widest font-black">Wgraj Inspirację</p>
                                <p className="text-[9px] text-velvet-cream/20 uppercase tracking-[0.2em]">JPG, PNG, WEBP (MAX 5MB)</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    )
}
