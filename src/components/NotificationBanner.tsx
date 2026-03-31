'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

interface NotificationBannerProps {
    message: string
    isOpen: boolean
    onClose: () => void
}

export default function NotificationBanner({ message, isOpen, onClose }: NotificationBannerProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in slide-in-from-top-8 duration-500">
            <div className="mx-4 bg-black/60 backdrop-blur-xl border border-velvet-gold/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(212,175,55,0.1)] flex items-center gap-4">
                <div className="p-2 bg-velvet-gold/10 rounded-xl">
                    <Sparkles className="text-velvet-gold" size={18} />
                </div>
                <p className="flex-1 text-velvet-cream/90 text-sm font-medium tracking-wide">
                    {message}
                </p>
                <button 
                    onClick={onClose}
                    className="p-1 text-velvet-cream/30 hover:text-velvet-gold transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
            {/* Ambient gold glow behind */}
            <div className="absolute inset-0 -z-10 bg-velvet-gold/5 blur-3xl rounded-full" />
        </div>
    )
}
