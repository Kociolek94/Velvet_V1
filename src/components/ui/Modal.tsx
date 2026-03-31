'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showClose?: boolean
    animate?: boolean
    noScroll?: boolean
}

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    width = 'md',
    showClose = true,
    animate = true,
    noScroll = false
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const widths = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-7xl'
    }

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Content Container */}
            <div 
                ref={modalRef}
                className={`relative w-full ${widths[width]} bg-[#050709] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700
                    ${animate ? (isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8') : ''}
                `}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-gradient-to-b from-white/[0.02] to-transparent">
                        <h2 className="text-velvet-gold text-sm uppercase tracking-[0.4em] font-black">{title}</h2>
                        {showClose && (
                            <button 
                                onClick={onClose}
                                className="p-2 text-velvet-cream/40 hover:text-velvet-gold hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={`p-8 ${noScroll ? 'overflow-hidden' : 'max-h-[85vh] overflow-y-auto custom-scrollbar'}`}>
                    {children}
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
