'use client'

import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout"
import ActivityCard from "@/components/ActivityCard"
import AddActivityModal from "@/components/AddActivityModal"
import { useAuth } from '@/hooks/useAuth'
import { useActivityDeck } from '@/hooks/useActivityDeck'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, LayoutGrid, RotateCcw, Plus, Loader2, Search, SlidersHorizontal } from "lucide-react"
import { ActivityDeckItem } from '@/types/activity'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ActivityDeckPage() {
    const { userId, coupleId, loading: authLoading } = useAuth()
    const { activities, loading: activitiesLoading, shuffle } = useActivityDeck(coupleId)
    
    const [viewMode, setViewMode] = useState<'shuffle' | 'browse'>('shuffle')
    const [currentActivity, setCurrentActivity] = useState<ActivityDeckItem | null>(null)
    const [shuffling, setShuffling] = useState(false)
    const [showFlash, setShowFlash] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Set initial random activity when activities load
    useEffect(() => {
        if (activities.length > 0 && !currentActivity) {
            setCurrentActivity(activities[Math.floor(Math.random() * activities.length)])
        }
    }, [activities, currentActivity])

    const handleShuffle = () => {
        if (activities.length === 0) return
        setShuffling(true)
        
        // Simulating a shuffle animation
        setTimeout(() => {
            const nextActivity = shuffle()
            if (nextActivity) {
                setCurrentActivity(nextActivity)
                setShuffling(false)
                setShowFlash(true)
                setTimeout(() => setShowFlash(false), 800)
            }
        }, 800)
    }

    const filteredActivities = useMemo(() => {
        return activities.filter(a => 
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [activities, searchQuery])

    const loading = authLoading || activitiesLoading

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-24 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[1px] bg-velvet-gold/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-velvet-gold/60">Talia Marzeń</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading tracking-widest uppercase text-white">Co Dzisiaj?</h1>
                        <p className="text-[11px] text-velvet-cream/40 uppercase tracking-[0.2em] max-w-md leading-relaxed">
                            Odkryjcie na nowo waszą bliskość z wylosowaną kartą aktywności lub stwórzcie własną inspirację.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Switcher */}
                        <div className="p-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 flex gap-1 h-[54px] items-center px-1">
                            <button
                                onClick={() => setViewMode('shuffle')}
                                className={`px-6 h-full rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest font-black transition-all duration-500 ${
                                    viewMode === 'shuffle' ? 'bg-velvet-gold/10 text-velvet-gold border border-velvet-gold/20' : 'text-velvet-cream/20 hover:text-velvet-cream/40'
                                }`}
                            >
                                <RotateCcw size={14} className={viewMode === 'shuffle' ? 'animate-spin-slow' : ''} />
                                Losuj
                            </button>
                            <button
                                onClick={() => setViewMode('browse')}
                                className={`px-6 h-full rounded-xl flex items-center gap-2 text-[10px] uppercase tracking-widest font-black transition-all duration-500 ${
                                    viewMode === 'browse' ? 'bg-velvet-gold/10 text-velvet-gold border border-velvet-gold/20' : 'text-velvet-cream/20 hover:text-velvet-cream/40'
                                }`}
                            >
                                <LayoutGrid size={14} />
                                Lista
                            </button>
                        </div>

                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            variant="gold"
                            size="icon"
                            className="w-[54px] h-[54px] rounded-2xl"
                        >
                            <Plus size={24} />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-velvet-gold blur-2xl opacity-20 animate-pulse" />
                                <Loader2 size={48} className="text-velvet-gold animate-spin relative z-10" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-velvet-gold font-black animate-pulse">Tasowanie Kart...</span>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-velvet-cream/20">Przygotowujemy waszą przygodę</span>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {viewMode === 'shuffle' ? (
                                <motion.div
                                    key="shuffle"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center gap-16 py-4"
                                >
                                    {activities.length > 0 ? (
                                        <>
                                            <div className="relative">
                                                {/* Background Glow */}
                                                <AnimatePresence>
                                                    {showFlash && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 0.6, scale: 1.5 }}
                                                            exit={{ opacity: 0, scale: 2 }}
                                                            className="absolute inset-0 bg-velvet-gold filter blur-[80px] rounded-full z-0 pointer-events-none"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                <div className={shuffling ? 'animate-shuffle perspective-1000' : ''}>
                                                    {currentActivity && (
                                                        <ActivityCard activity={currentActivity} variant="full" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-6">
                                                <Button
                                                    onClick={handleShuffle}
                                                    disabled={shuffling}
                                                    variant="burgundy"
                                                    className="px-16 py-6 rounded-[2rem] shadow-[0_20px_50px_rgba(74,14,14,0.3)] group overflow-hidden"
                                                >
                                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-velvet-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                                    <RotateCcw size={20} className={`mr-3 ${shuffling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                                                    <span className="text-sm font-black uppercase tracking-[0.2em]">Losuj Kolejną</span>
                                                </Button>
                                                
                                                <p className="text-[9px] text-velvet-cream/20 uppercase tracking-[0.4em] font-black">
                                                    Kliknij, aby poczuć dreszczyk emocji
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center max-w-sm mx-auto space-y-8">
                                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                                <Sparkles size={40} className="text-velvet-cream/10" />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-heading text-white uppercase tracking-widest leading-tight">Wasza Talia Jest Pusta</h3>
                                                <p className="text-xs text-velvet-cream/40 uppercase tracking-widest leading-relaxed">
                                                    Dodajcie pierwsze aktywności, aby móc korzystać z losowania.
                                                </p>
                                            </div>
                                            <Button onClick={() => setIsAddModalOpen(true)} variant="gold" className="rounded-full px-10">
                                                Dodaj Pierwszą Kartę
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="browse"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    className="space-y-12"
                                >
                                    {/* Sub-Header & Filters */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                                        <div className="relative flex-1 max-w-md group">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-velvet-cream/20 group-focus-within:text-velvet-gold transition-colors" size={18} />
                                            <input 
                                                type="text"
                                                placeholder="SZUKAJ W TALII..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs uppercase tracking-widest font-black text-white placeholder:text-white/10 focus:outline-none focus:border-velvet-gold/40 transition-all duration-500 shadow-sm"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                                            <SlidersHorizontal size={14} className="text-velvet-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-velvet-cream/60">
                                                {activities.length} KART W TALII
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <AnimatePresence mode="popLayout">
                                            {filteredActivities.map((activity) => (
                                                <motion.div
                                                    key={activity.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                >
                                                    <ActivityCard 
                                                        activity={activity} 
                                                        variant="compact" 
                                                        onClick={() => {
                                                            setCurrentActivity(activity)
                                                            setViewMode('shuffle')
                                                        }}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    
                                    {filteredActivities.length === 0 && (
                                        <div className="text-center py-40 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5 max-w-2xl mx-auto space-y-6">
                                            <div className="w-20 h-20 bg-white/[0.03] rounded-full mx-auto flex items-center justify-center">
                                                <Search size={32} className="text-velvet-cream/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-heading text-white uppercase tracking-widest">Nie znaleźliśmy takiej karty</h3>
                                                <p className="text-[10px] text-velvet-cream/40 uppercase tracking-widest">Spróbuj wpisać coś innego lub dodaj nową aktywność.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {coupleId && (
                <AddActivityModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    coupleId={coupleId}
                    onSuccess={() => {}}
                />
            )}
        </DashboardLayout>
    )
}
