'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import QuizCard from "@/components/QuizCard"
import MatchAnimation from "@/components/MatchAnimation"
import { Trophy, Gamepad2, Sparkles, ChevronRight, LayoutGrid } from "lucide-react"

interface Question {
    id: string
    question_text: string
    options: string[]
    category: string
}

interface QuizAnswer {
    id: string
    question_id: string
    user_a_id: string
    user_a_answer: string | null
    user_b_id: string | null
    user_b_answer: string | null
    is_match: boolean
}

export default function GamesPage() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentAnswer, setCurrentAnswer] = useState<QuizAnswer | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [showMatch, setShowMatch] = useState(false)
    
    const supabase = createClient()

    const fetchCurrentState = useCallback(async (qId: string, cid: string) => {
        const { data, error } = await supabase
            .from('quiz_answers')
            .select('*')
            .eq('couple_id', cid)
            .eq('question_id', qId)
            .maybeSingle()
        
        if (error) console.error('Error fetching quiz answer state:', error)
        setCurrentAnswer(data)
    }, [supabase])

    useEffect(() => {
        async function init() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('couple_id')
                .eq('id', user.id)
                .single()

            if (profile?.couple_id) {
                setCoupleId(profile.couple_id)

                // Fetch Questions
                const { data: qData } = await supabase
                    .from('questions')
                    .select('*')
                    .order('created_at', { ascending: true })
                
                if (qData) {
                    setQuestions(qData)
                    if (qData.length > 0) {
                        await fetchCurrentState(qData[0].id, profile.couple_id)
                    }
                }
            }
            setLoading(false)
        }
        init()
    }, [supabase, fetchCurrentState])

    // Subscription for Realtime
    useEffect(() => {
        if (!coupleId || !questions[currentIndex]) return

        const channel = supabase
            .channel(`quiz_${questions[currentIndex].id}`)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'quiz_answers', 
                    filter: `question_id=eq.${questions[currentIndex].id}` 
                },
                (payload) => {
                    const newAnswer = payload.new as QuizAnswer
                    setCurrentAnswer(newAnswer)
                    
                    // Trigger Match Animation
                    if (newAnswer.user_a_answer && newAnswer.user_b_answer && newAnswer.user_a_answer === newAnswer.user_b_answer) {
                        setShowMatch(true)
                        setTimeout(() => setShowMatch(false), 4000)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, coupleId, currentIndex, questions])

    const handleAnswer = async (answer: string) => {
        if (!userId || !coupleId || !questions[currentIndex]) return
        setSubmitting(true)

        const qId = questions[currentIndex].id
        
        try {
            if (!currentAnswer) {
                // First person answering
                const { error } = await supabase
                    .from('quiz_answers')
                    .insert([{
                        couple_id: coupleId,
                        question_id: qId,
                        user_a_id: userId,
                        user_a_answer: answer
                    }])
                if (error) throw error
            } else if (currentAnswer.user_a_id !== userId && !currentAnswer.user_b_answer) {
                // Second person answering
                const isMatch = currentAnswer.user_a_answer === answer
                const { error } = await supabase
                    .from('quiz_answers')
                    .update({
                        user_b_id: userId,
                        user_b_answer: answer,
                        is_match: isMatch
                    })
                    .eq('id', currentAnswer.id)
                if (error) throw error
            }
        } catch (error) {
            console.error('Error submitting answer:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1
            setCurrentIndex(nextIdx)
            fetchCurrentState(questions[nextIdx].id, coupleId!)
        }
    }

    const myAnswerValue = currentAnswer 
        ? (currentAnswer.user_a_id === userId ? currentAnswer.user_a_answer : currentAnswer.user_b_answer)
        : null
    
    const partnerAnswerValue = currentAnswer
        ? (currentAnswer.user_a_id !== userId ? currentAnswer.user_a_answer : currentAnswer.user_b_answer)
        : null

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-velvet-gold">
                            <Gamepad2 size={24} className="animate-pulse" />
                            <h1 className="text-4xl font-heading uppercase tracking-[0.2em] leading-none">Velvet Games</h1>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="w-8 h-[1px] bg-velvet-gold/30" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-medium italic">Quiz: Jak dobrze mnie znasz?</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <div className="w-12 h-12 rounded-full bg-velvet-gold/10 border-2 border-velvet-gold flex items-center justify-center text-velvet-gold font-bold">1</div>
                            <div className="w-12 h-12 rounded-full bg-velvet-burgundy/10 border-2 border-velvet-burgundy flex items-center justify-center text-velvet-burgundy font-bold">2</div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-velvet-cream/40 font-bold">Pora na Wasz pojedynek</span>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-4 gap-4">
                    {questions.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-700 ${
                                idx === currentIndex 
                                ? 'bg-velvet-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                : idx < currentIndex 
                                ? 'bg-velvet-gold/20' 
                                : 'bg-white/5'
                            }`}
                        />
                    ))}
                </div>

                {/* Main Game Stage */}
                <div className="relative min-h-[600px] flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-6">
                            <LayoutGrid size={48} className="text-velvet-gold/20 animate-spin" />
                            <span className="text-[11px] uppercase tracking-[0.5em] text-velvet-gold/40 font-black">Tasowanie pytań...</span>
                        </div>
                    ) : questions.length > 0 ? (
                        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <QuizCard 
                                question={questions[currentIndex]}
                                onAnswer={handleAnswer}
                                myAnswer={myAnswerValue}
                                partnerAnswer={partnerAnswerValue}
                                loading={submitting}
                            />

                            {/* Control Footer */}
                            {(myAnswerValue && partnerAnswerValue) && currentIndex < questions.length - 1 && (
                                <div className="mt-12 flex justify-center">
                                    <button 
                                        onClick={nextQuestion}
                                        className="group v-button-burgundy px-16 py-6 rounded-full flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span className="text-xs font-bold uppercase tracking-[0.3em]">Następne Pytanie</span>
                                        <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="v-card p-20 text-center opacity-40">
                            <Sparkles size={48} className="mx-auto mb-6" />
                            <p className="text-xs uppercase tracking-widest leading-relaxed">Wszystkie gry zostały ukończone. <br/> Wróć tu wkrótce po nowe wyzwania!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Match Animation Overlay */}
            {showMatch && <MatchAnimation />}
        </DashboardLayout>
    )
}
