import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'burgundy' | 'gold' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
    asChild?: boolean
}

export default function Button({
    children,
    variant = 'gold',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    asChild = false,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 font-bold uppercase tracking-[0.2em]'
    
    const variants = {
        burgundy: 'v-button-burgundy active:scale-[0.98]',
        gold: 'v-button-gold active:scale-[0.98]',
        outline: 'border border-velvet-gold/30 text-velvet-gold hover:bg-velvet-gold/10',
        ghost: 'text-velvet-cream/60 hover:text-velvet-gold hover:bg-white/5'
    }

    const sizes = {
        sm: 'px-4 py-2 text-[10px] rounded-lg h-9',
        md: 'px-8 py-4 text-[11px] rounded-xl h-14',
        lg: 'px-12 py-5 text-[12px] rounded-2xl h-18',
        icon: 'p-3 rounded-xl aspect-square'
    }

    const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<any>
        return React.cloneElement(child, {
            className: `${combinedStyles} ${child.props.className || ''}`,
            ...props
        })
    }

    return (
        <button
            className={combinedStyles}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            ) : children}
        </button>
    )
}
