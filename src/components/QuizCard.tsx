'use client'

import { useState } from 'react'
import { Check, Loader2, Sparkles, AlertCircle, TrendingUp } from 'lucide-react'

interface QuizCardProps {
    question: {
        id: string
        question_text: string
        options: string[]
        category: string
    }
    onAnswer: (answer: string) => void
    partnerAnswer: string | null
    myAnswer: string | null
    loading?: boolean
}

export default function QuizCard({ question, onAnswer, partnerAnswer, myAnswer, loading }: QuizCardProps) {
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
    
    // Derived states
    const hasBothAnswered = partnerAnswer !== null && myAnswer !== null
    const isWaitingForPartner = myAnswer !== null && partnerAnswer === null
    const isMatch = hasBothAnswered && myAnswer === partnerAnswer

    const handleChoiceClick = (choice: string) => {
        if (myAnswer) return
        setSelectedChoice(choice)
        onAnswer(choice)
    }

    return (
        <div className="v-card-gold-border p-12 space-y-12 bg-velvet-dark-alt relative overflow-hidden group">
            
            {/* Background Texture/Gradient */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={120} className="text-velvet-gold rotate-12" />
            </div>

            {/* Question Header */}
            <div className="text-center space-y-6 relative">
                <div className="inline-block px-4 py-1 rounded-full border border-velvet-gold/20 bg-velvet-gold/5 mb-4">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-velvet-gold italic">{question.category}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading text-velvet-gold uppercase tracking-tighter leading-tight max-w-2xl mx-auto">
                    {question.question_text}
                </h2>
                <div className="w-12 h-[1px] bg-velvet-gold/30 mx-auto" />
            </div>

            {/* Choices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {question.options.map((option, idx) => {
                    const isMyChoice = myAnswer === option || selectedChoice === option
                    const isPartnerChoice = partnerAnswer === option
                    const showResult = hasBothAnswered

                    return (
                        <button
                            key={idx}
                            disabled={!!myAnswer || loading}
                            onClick={() => handleChoiceClick(option)}
                            className={`relative p-8 rounded-3xl border text-left transition-all duration-500 overflow-hidden group/btn 
                                ${isMyChoice 
                                    ? 'bg-velvet-gold border-velvet-gold text-black shadow-[0_0_30px_rgba(212,175,55,0.2)]' 
                                    : 'bg-white/5 border-white/10 text-velvet-cream hover:border-velvet-gold/30 hover:bg-white/[0.08]'
                                }
                                ${showResult && !isMyChoice && !isPartnerChoice ? 'opacity-20' : ''}
                                ${showResult && isPartnerChoice && !isMyChoice ? 'border-dashed border-velvet-gold animate-pulse' : ''}
                            `}
                        >
                            <span className="text-lg font-light tracking-wide">{option}</span>
                            
                            {/* Indicators */}
                            {showResult && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {isMyChoice && <span className="bg-black/10 px-2 py-0.5 rounded-full text-[8px] font-black text-black uppercase tracking-widest">Ty</span>}
                                    {isPartnerChoice && <span className="bg-velvet-burgundy/20 px-2 py-0.5 rounded-full text-[8px] font-black text-velvet-burgundy uppercase tracking-widest animate-bounce">On/Ona</span>}
                                </div>
                            )}

                            {/* Simple visual flourish */}
                            {!hasBothAnswered && !myAnswer && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Status Footer */}
            <div className="pt-8 border-t border-white/5 relative">
                {isWaitingForPartner ? (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-velvet-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-velvet-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-velvet-gold rounded-full animate-bounce" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-velvet-gold/60">Czekam na partnera...</p>
                    </div>
                ) : hasBothAnswered ? (
                    <div className="text-center space-y-6">
                        {isMatch ? (
                            <div className="space-y-2 animate-in zoom-in-90 duration-500">
                                <div className="p-3 bg-velvet-gold/10 rounded-full inline-block mb-2">
                                    <Sparkles size={24} className="text-velvet-gold" />
                                </div>
                                <h3 className="text-2xl font-heading text-velvet-gold uppercase tracking-[0.2em] shadow-gold">Match!</h3>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-velvet-cream/40 font-bold italic">To samo serce, ta sama myśl</p>
                            </div>
                        ) : (
                            <div className="space-y-2 opacity-60">
                                <div className="p-3 bg-white/5 rounded-full inline-block mb-2">
                                    <AlertCircle size={24} className="text-gray-500" />
                                </div>
                                <h3 className="text-xl font-heading text-gray-500 uppercase tracking-[0.2em]">Różnica zdań</h3>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-velvet-cream/40 font-bold italic">Przeciwieństwa się przyciągają</p>
                            </div>
                        )}
                        <button 
                            onClick={() => window.location.reload()} // Simplified next question
                            className="v-button-outline px-12 py-5 text-[10px] uppercase font-black"
                        >
                            Następne wyzwanie
                        </button>
                    </div>
                ) : (
                    <div className="text-center opacity-20">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black">Wybierz swoją odpowiedź powyżej</p>
                    </div>
                )}
            </div>
            
            {/* Animated Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
                    <Loader2 size={48} className="text-velvet-gold animate-spin" />
                </div>
            )}
        </div>
    )
}
