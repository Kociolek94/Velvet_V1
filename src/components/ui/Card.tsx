import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'burgundy' | 'outline' | 'dark' | 'bento'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    hoverEffect?: boolean
}

export default function Card({
    children,
    variant = 'glass',
    padding = 'md',
    hoverEffect = true,
    className = '',
    ...props
}: CardProps) {
    const baseStyles = 'v-card transition-all duration-700 relative overflow-hidden backdrop-blur-2xl'
    
    const variants = {
        glass: 'bg-white/[0.03] border border-white/5 shadow-card shadow-black/40',
        burgundy: 'bg-velvet-burgundy/10 border border-velvet-burgundy/20 shadow-premium',
        outline: 'bg-transparent border border-white/10',
        dark: 'bg-[#050709] border border-white/5',
        bento: 'bg-[#0A0E14] border border-[#4A0E0E] shadow-card hover:shadow-[0_0_20px_rgba(212,175,55,0.08)]'
    }

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-8',
        lg: 'p-12',
        xl: 'p-16'
    }

    const hoverStyles = hoverEffect ? 'hover:shadow-gold/5 hover:-translate-y-1 hover:border-white/10' : ''

    return (
        <div 
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
