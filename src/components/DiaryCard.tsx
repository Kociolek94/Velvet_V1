'use client'

import { Calendar } from 'lucide-react'

interface DiaryCardProps {
    title: string
    imagePath: string
    eventDate: string
    onClick: () => void
}

export default function DiaryCard({ title, imagePath, eventDate, onClick }: DiaryCardProps) {
    const PUBLIC_STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/diary_media/`
    const imageUrl = imagePath.startsWith('http') ? imagePath : `${PUBLIC_STORAGE_URL}${imagePath}`

    return (
        <div 
            onClick={onClick}
            className="v-card group relative h-80 overflow-hidden cursor-pointer hover:border-velvet-gold/40 transition-all duration-500"
        >
            {/* Background Image */}
            <img 
                src={imageUrl} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 text-velvet-gold/60 text-[10px] uppercase tracking-[0.2em] mb-2">
                    <Calendar size={12} />
                    <span>{new Date(eventDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-heading text-velvet-gold uppercase tracking-widest leading-tight group-hover:text-white transition-colors">
                    {title}
                </h3>
                
                {/* Visual Indicator */}
                <div className="w-0 group-hover:w-16 h-[1px] bg-velvet-gold mt-4 transition-all duration-700 delay-100" />
            </div>
        </div>
    )
}
