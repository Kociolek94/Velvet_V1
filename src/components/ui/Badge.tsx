import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'red' | 'yellow' | 'green' | 'gold' | 'cream' | 'default'
    size?: 'xs' | 'sm'
    dot?: boolean
}

export default function Badge({
    children,
    variant = 'default',
    size = 'xs',
    dot = false,
    className = '',
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center gap-2 rounded-full border px-3 py-1 uppercase tracking-widest font-bold font-heading backdrop-blur-md'
    
    const variants = {
        red: 'bg-red-500/10 border-red-500/20 text-red-500',
        yellow: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        gold: 'bg-velvet-gold/10 border-velvet-gold/20 text-velvet-gold',
        cream: 'bg-velvet-cream/10 border-velvet-cream/20 text-velvet-cream',
        default: 'bg-white/5 border-white/10 text-velvet-cream/60'
    }

    const sizes = {
        xs: 'text-[8px]',
        sm: 'text-[10px]'
    }

    return (
        <div 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${variant === 'default' ? 'bg-velvet-gold' : 'bg-current'}`} />
            )}
            {children}
        </div>
    )
}
