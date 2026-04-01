'use client'

import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, ChevronRight } from 'lucide-react'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-velvet-burgundy/10 rounded-full blur-[150px] -z-10 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-velvet-gold/5 rounded-full blur-[120px] -z-10" />

            <div className="z-10 max-w-5xl w-full flex flex-col items-center">

                <header className="mb-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-forwards relative group">
                    <div className="flex flex-col items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-[-40px] bg-velvet-gold/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <img 
                                src="/Velvet.png" 
                                alt="Velvet Logo" 
                                className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 transition-transform duration-1000 group-hover:scale-110 drop-shadow-gold" 
                            />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-light text-velvet-gold tracking-[0.5em] uppercase font-heading">
                                Velvet!
                            </h1>
                            <p className="text-velvet-cream/40 text-[10px] md:text-xs uppercase tracking-[1em] font-black">
                                Ekskluzywny Ekosystem Dla Waszej Relacji
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl p-4">
                    <Link href="/dashboard" className="v-card p-10 group hover:border-velvet-gold/40 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="bg-velvet-gold/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                            <Heart className="text-velvet-gold" size={32} />
                        </div>
                        <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest mb-4">Wejdź do Świata</h2>
                        <p className="text-velvet-cream/40 text-[11px] leading-relaxed max-w-[200px]">Twój prywatny dashboard, wykresy harmonii i wspólny Safe Space.</p>
                        <div className="mt-8 flex items-center gap-2 text-velvet-gold/60 group-hover:text-velvet-gold transition-colors font-bold uppercase tracking-widest text-[10px]">
                            <span>Otwórz</span>
                            <ChevronRight size={14} />
                        </div>
                    </Link>

                    <Link href="/dashboard/check-in" className="v-card p-10 group hover:border-velvet-gold/40 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="bg-velvet-burgundy/20 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-velvet-gold" size={32} />
                        </div>
                        <h2 className="text-xl font-heading text-velvet-gold uppercase tracking-widest mb-4">Daily Check-in</h2>
                        <p className="text-velvet-cream/40 text-[11px] leading-relaxed max-w-[200px]">Zadbaj o bliskość dzisiaj. Poświęć minutę na szczere metryki.</p>
                        <div className="mt-8 flex items-center gap-2 text-velvet-gold/60 group-hover:text-velvet-gold transition-colors font-bold uppercase tracking-widest text-[10px]">
                            <span>Rozpocznij</span>
                            <ChevronRight size={14} />
                        </div>
                    </Link>
                </div>

                <footer className="mt-20 flex gap-12 text-velvet-cream/20 text-[10px] uppercase tracking-[0.4em] font-bold">
                    <Link href="/login" className="hover:text-velvet-gold transition-colors">Logowanie</Link>
                    <Link href="/register" className="hover:text-velvet-gold transition-colors">Dołącz do Velvet!</Link>
                </footer>

            </div>
        </main>
    );
}
