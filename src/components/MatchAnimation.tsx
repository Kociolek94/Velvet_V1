'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Heart } from 'lucide-react'

export default function MatchAnimation() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 3000)
        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Celebration Container */}
            <div className="relative animate-in zoom-in-50 fade-in duration-700 fill-mode-forwards text-center space-y-4">
                
                {/* Hearts Floating */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex gap-8">
                    {[1, 2, 3, 4, 5].map((h) => (
                        <Heart 
                            key={h} 
                            className={`text-velvet-gold fill-velvet-gold/40 animate-bounce`} 
                            style={{ animationDelay: `${h * 0.2}s`, height: '24px', width: '24px' }}
                        />
                    ))}
                </div>

                <div className="bg-velvet-gold/20 backdrop-blur-xl border-2 border-velvet-gold/40 px-16 py-10 rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.4)]">
                    <div className="inline-flex items-center justify-center p-6 bg-velvet-gold rounded-full mb-6">
                        <Sparkles size={48} className="text-black" />
                    </div>
                    <h2 className="text-7xl font-heading text-velvet-gold uppercase tracking-[0.2em] mb-2 drop-shadow-lg">Match!</h2>
                    <p className="text-velvet-cream text-sm uppercase tracking-[0.5em] font-medium italic opacity-80">
                        Zupełnie jakbyście <br/> czytali sobie w myślach
                    </p>
                </div>

                {/* Particle effect simulation (simplified with static divs anim) */}
                <div className="absolute inset-0 overflow-visible">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute bg-velvet-gold w-2 h-2 rounded-full animate-ping"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                                animationDelay: `${Math.random()}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
