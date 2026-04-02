'use client'

import { useState, useEffect, useMemo } from 'react'
import RelationshipChart from '@/components/RelationshipChart'
import DashboardLayout from '@/components/DashboardLayout'
import { getDashboardStats, DashboardStats } from '@/lib/dashboard'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { useCompletion } from '@ai-sdk/react'
import { getRelationshipContext } from '@/lib/actions/getRelationshipContext'
import { getLatestAnalysis, saveAnalysis } from '@/lib/actions/aiAnalyses'
import { 
    Heart, MessageCircle, Sparkles, Zap, Clock, 
    TrendingUp, Activity, ShieldAlert, Target, 
    ArrowRight, Loader2, Calendar, LayoutGrid,
    Search, Bell, Quote, MessageSquare, Brain, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { isAfter, subDays, startOfDay } from 'date-fns'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import SparksWidget from '@/components/SparksWidget'

export default function DashboardPage() {
    const { userId, coupleId, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [names, setNames] = useState({ me: 'Ty', partner: 'Partner' })
    const [hasData, setHasData] = useState(false)
    const [recentNotes, setRecentNotes] = useState<any[]>([])
    const [loadingContext, setLoadingContext] = useState(false)

    const { complete, completion, isLoading, setCompletion } = useCompletion({
        api: '/api/chat',
        streamProtocol: 'text',
        onFinish: async (_prompt: string, completion: string) => {
            if (coupleId && completion) {
                try {
                    await saveAnalysis(coupleId, completion)
                } catch (error) {
                    console.error('Błąd zapisu analizy:', error)
                }
            }
        }
    })

    const parsedAnalysis = useMemo(() => {
        if (!completion) return null
        
        const sections = completion.split(/#?\s*(Refleksja|Zadanie):?/i)
        let refleksja = ""
        let zadanie = ""
        
        for (let i = 1; i < sections.length; i += 2) {
            const title = sections[i].toLowerCase()
            const content = sections[i + 1]?.trim()
            if (title.includes('refleksja')) refleksja = content
            if (title.includes('zadanie')) zadanie = content
        }
        
        if (!refleksja && !zadanie) refleksja = completion
        
        return { refleksja, zadanie }
    }, [completion])

    const supabase = createClient()

    useEffect(() => {
        async function loadDashboardData() {
            if (!coupleId || !userId) {
                if (!authLoading) setLoading(false)
                return
            }

            try {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, display_name')
                    .eq('couple_id', coupleId)

                if (profiles) {
                    const myProfile = profiles.find(p => p.id === userId)
                    const partnerProfile = profiles.find(p => p.id !== userId)
                    setNames({
                        me: myProfile?.display_name || 'Ty',
                        partner: partnerProfile?.display_name || 'Partner'
                    })
                }

                const dashboardStats = await getDashboardStats(coupleId, userId)
                setStats(dashboardStats)

                const { data: metrics } = await supabase
                    .from('daily_metrics')
                    .select('*')
                    .eq('couple_id', coupleId)
                    .order('created_at', { ascending: false })
                    .limit(20)

                if (!metrics || metrics.length === 0) {
                    setHasData(false)
                } else {
                    setHasData(true)
                    const subjects = [
                        { key: 'closeness', label: 'Bliskość' },
                        { key: 'communication', label: 'Komunikacja' },
                        { key: 'support', label: 'Wsparcie' },
                        { key: 'intimacy', label: 'Intymność' },
                        { key: 'time_together', label: 'Czas' }
                    ]

                    const myMetrics = metrics.filter(m => m.user_id === userId)
                    const partnerMetrics = metrics.filter(m => m.user_id !== userId)

                    const newChartData = subjects.map(s => {
                        const myAvg = myMetrics.length ? myMetrics.reduce((sum, m) => sum + (m[s.key as keyof typeof m] as number), 0) / myMetrics.length : 5
                        const partnerAvg = partnerMetrics.length ? partnerMetrics.reduce((sum, m) => sum + (m[s.key as keyof typeof m] as number), 0) / partnerMetrics.length : 5

                        return {
                            subject: s.label,
                            A: Math.round(myAvg * 10) / 10,
                            B: Math.round(partnerAvg * 10) / 10,
                            fullMark: 10
                        }
                    })
                    setChartData(newChartData)

                    const yesterdayStart = startOfDay(subDays(new Date(), 1))
                    const latestNotesMap = new Map()
                    
                    metrics.forEach(m => {
                        if (m.note && m.note.trim() !== '' && isAfter(new Date(m.created_at), yesterdayStart)) {
                            if (!latestNotesMap.has(m.user_id)) {
                                latestNotesMap.set(m.user_id, {
                                    id: m.id,
                                    note: m.note,
                                    userName: m.user_id === userId ? names.me : names.partner,
                                    isMe: m.user_id === userId,
                                    date: m.created_at
                                })
                            }
                        }
                    })
                    setRecentNotes(Array.from(latestNotesMap.values()))
                }

                const latest = await getLatestAnalysis(coupleId)
                if (latest) {
                    const today = new Date().toISOString().split('T')[0]
                    const analysisDate = new Date(latest.created_at).toISOString().split('T')[0]
                    if (today === analysisDate) {
                        setCompletion(latest.content)
                    }
                }
            } catch (err) {
                console.error('Error loading dashboard:', err)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [coupleId, userId, authLoading, supabase, setCompletion, names.me, names.partner])

    const handleStartAnalysis = async () => {
        if (!coupleId) return
        setLoadingContext(true)
        setCompletion('')
        try {
            const context = await getRelationshipContext()
            const prompt = `Oto dane o relacji pary:\n${JSON.stringify(context, null, 2)}\n\nPrzeprowadź analizę. ODPOWIEDZ W FORMACIE:\nRefleksja: [krótka, luksusowa analiza psychologiczna]\nZadanie: [jedno konkretne zadanie na dziś]`
            await complete(prompt)
        } catch (error) {
            console.error('Błąd generowania analizy:', error)
        } finally {
            setLoadingContext(false)
        }
    }

    const isDataLoading = authLoading || loading

    if (isDataLoading) {
        return (
            <div className="min-h-screen bg-[#0A0E14] flex flex-col items-center justify-center gap-8">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-full border border-velvet-gold/10 animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-velvet-gold animate-pulse" size={24} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <span className="text-velvet-gold tracking-[0.8em] font-heading text-[10px] uppercase pl-[0.8em] animate-pulse">Synchronizacja Serca</span>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-velvet-gold/20 to-transparent" />
                </div>
            </div>
        )
    }

    if (!hasData) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-20 px-6">
                    <Card className="p-16 flex flex-col items-center justify-center text-center space-y-10 border-dashed border-white/5 bg-white/[0.01]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-velvet-gold blur-3xl opacity-10 animate-pulse" />
                            <div className="w-28 h-28 rounded-[2.5rem] bg-velvet-gold/5 flex items-center justify-center border border-velvet-gold/10 relative z-10">
                                <Activity className="text-velvet-gold/40" size={48} />
                            </div>
                        </div>
                        <div className="max-w-md space-y-4">
                            <h2 className="text-3xl font-heading text-white uppercase tracking-widest leading-tight">Czas na pierwszą refleksję</h2>
                            <p className="text-velvet-cream/40 text-sm leading-relaxed uppercase tracking-[0.1em]">
                                Velvet potrzebuje wspólnych danych, aby wygenerować Waszą Kartę Radarową i przeanalizować kondycję związku.
                            </p>
                        </div>
                        <Button variant="gold" size="lg" className="px-16" asChild>
                            <Link href="/dashboard/check-in">
                                <Zap className="mr-2" size={16} />
                                Zacznij Daily Check-in
                            </Link>
                        </Button>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6 pb-24 px-6 pt-8">
                
                {/* 1. TOP ROW: KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Harmonia */}
                    <Card variant="bento" padding="md" className="flex items-center gap-6 h-28 relative overflow-hidden group">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="4" />
                                <motion.circle 
                                    cx="32" cy="32" r="28" fill="transparent" stroke="#D4AF37" strokeWidth="4" 
                                    strokeDasharray={175.9} 
                                    initial={{ strokeDashoffset: 175.9 }}
                                    animate={{ strokeDashoffset: 175.9 - (175.9 * (stats?.syncPercentage || 0)) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-velvet-gold">
                                {stats?.syncPercentage}%
                            </div>
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-velvet-gold/60 block mb-1">Harmonia</span>
                            <div className="text-xl font-heading text-white">Zsynchronizowani</div>
                        </div>
                        <Activity className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-velvet-gold/5 transition-colors" size={80} />
                    </Card>

                    {/* Streak */}
                    <Card variant="bento" padding="md" className="flex items-center gap-6 h-28 relative overflow-hidden group border-orange-500/10">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-orange-500/10 blur-xl animate-pulse" />
                            <Zap className="text-orange-500 relative z-10" size={32} />
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500/60 block mb-1">Passa Dni</span>
                            <div className="text-xl font-heading text-white">{stats?.streak} Dni Razem</div>
                        </div>
                        <Zap className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-orange-500/5 transition-colors" size={80} />
                    </Card>

                    {/* VP Wallet */}
                    <Card variant="bento" padding="md" className="flex items-center gap-6 h-28 relative overflow-hidden group">
                        <div className="w-16 h-16 rounded-2xl bg-velvet-gold/5 border border-velvet-gold/20 flex items-center justify-center">
                            <div className="absolute inset-0 bg-velvet-gold/5 blur-lg" />
                            <Sparkles className="text-velvet-gold" size={32} />
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-velvet-gold/60 block mb-1">Portfel VP</span>
                            <div className="text-xl font-heading text-white">{stats?.vpBalance} VP</div>
                        </div>
                        <Sparkles className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-velvet-gold/5 transition-colors" size={80} />
                    </Card>
                </div>

                {/* 2. MAIN BENTO GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* RELATIONAL ANALYSIS */}
                    <div className="lg:col-span-8">
                        <Card variant="bento" padding="none" className="h-full flex flex-col md:flex-row overflow-hidden group">
                            {/* Left: Radar Chart */}
                            <div className="md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-black/20">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-velvet-gold mb-2">Relational Radar</h3>
                                    <p className="text-[8px] text-velvet-cream/30 uppercase tracking-widest">7-dniowa kondycja</p>
                                </div>
                                <div className="flex-1 flex items-center justify-center py-4 max-h-60 scale-75 md:scale-90">
                                    <RelationshipChart data={chartData} userName={names.me} partnerName={names.partner} />
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-velvet-gold" />
                                        <span className="text-[8px] text-white/40 uppercase font-bold">{names.me}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white/20" />
                                        <span className="text-[8px] text-white/40 uppercase font-bold">{names.partner}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: AI Insight */}
                            <div className="md:w-7/12 p-8 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="text-velvet-gold" size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Velvet Insight</span>
                                    </div>
                                    <Badge variant="gold" size="sm" className="text-[8px] px-2">LIVE</Badge>
                                </div>

                                <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar max-h-[280px]">
                                    {(isLoading || loadingContext) ? (
                                        <div className="flex flex-col gap-4 animate-pulse pt-4">
                                            <div className="h-4 bg-white/5 rounded w-full" />
                                            <div className="h-4 bg-white/5 rounded w-3/4" />
                                            <div className="h-20 bg-white/5 rounded w-full mt-4" />
                                        </div>
                                    ) : (completion) ? (
                                        <>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-velvet-gold/60">
                                                    <Brain size={14} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Refleksja</span>
                                                </div>
                                                <p className="text-xs text-velvet-cream/80 leading-relaxed font-light italic">
                                                    {parsedAnalysis?.refleksja || "Przetwarzanie wglądu..."}
                                                </p>
                                            </div>

                                            {parsedAnalysis?.zadanie && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-emerald-500/60">
                                                        <Target size={14} />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Zadanie</span>
                                                    </div>
                                                    <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl group-hover:bg-emerald-500/[0.05] transition-colors">
                                                        <p className="text-xs text-white/90 font-medium">
                                                            {parsedAnalysis.zadanie}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                                            <Brain size={32} className="text-velvet-gold/20" />
                                            <p className="text-[10px] uppercase tracking-widest">Gotowi na dzisiejszą analizę?</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleStartAnalysis}
                                        disabled={isLoading || loadingContext}
                                        className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2 bg-white/[0.02]"
                                    >
                                        {isLoading || loadingContext ? <Loader2 className="animate-spin" size={14} /> : <><RefreshCw size={12} /> {completion ? 'Odśwież Wgląd' : 'Rozpocznij Analizę'}</>}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* SIDE PANEL */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card variant="bento" padding="md" className="flex-1 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="text-red-500" size={18} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Safe Space Status</h3>
                                </div>
                                <Link href="/dashboard/safe-space">
                                    <ArrowRight size={14} className="text-white/20 hover:text-velvet-gold transition-colors" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                    <span className="text-lg font-heading text-white">{stats?.safeSpaceStatus.urgent}</span>
                                    <span className="text-[7px] text-red-500/60 uppercase font-black tracking-widest">Urgent</span>
                                </div>
                                <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    <span className="text-lg font-heading text-white">{stats?.safeSpaceStatus.open}</span>
                                    <span className="text-[7px] text-orange-500/60 uppercase font-black tracking-widest">Open</span>
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-lg font-heading text-white">{stats?.safeSpaceStatus.resolved}</span>
                                    <span className="text-[7px] text-emerald-500/60 uppercase font-black tracking-widest">Solved</span>
                                </div>
                            </div>
                        </Card>

                        <Card variant="bento" padding="md" className="flex-1 flex flex-col gap-6 bg-gradient-to-br from-[#0A0E14] via-[#0A0E14] to-velvet-gold/[0.03]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-velvet-gold" size={18} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Ostatnie Okruchy</h3>
                                </div>
                                <Link href="/dashboard/sparks">
                                    <ArrowRight size={14} className="text-white/20 hover:text-velvet-gold transition-colors" />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {stats?.recentSparks.map((spark, idx) => (
                                    <motion.div 
                                        key={spark.id}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col gap-1 relative group/spark"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-velvet-gold/40 uppercase tracking-widest">{spark.sender_name}</span>
                                            <span className="text-[7px] text-white/20 uppercase font-bold">{new Date(spark.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[10px] text-white/70 line-clamp-1 italic">"{spark.content}"</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 3. BOTTOM ROW: ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card variant="bento" padding="md" className="group h-32 flex flex-col justify-between overflow-hidden relative">
                        <div className="flex items-center gap-3 relative z-10">
                            <Target className="text-velvet-gold/40 group-hover:text-velvet-gold transition-colors" size={18} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Next Milestone</h3>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-velvet-cream/60 mb-2 truncate">{stats?.nearestGoal}</p>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-velvet-gold w-[60%] rounded-full shadow-[0_0_10px_#D4AF37]" />
                            </div>
                        </div>
                        <Target className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-velvet-gold/5 transition-colors" size={100} />
                    </Card>

                    <Card variant="bento" padding="md" className="group h-32 flex flex-col justify-between overflow-hidden relative border-dashed border-white/10 hover:border-white/20">
                        <div className="flex items-center gap-3 relative z-10">
                            <Clock className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" size={18} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Daily Habit</h3>
                        </div>
                        <div className="relative z-10">
                            <Link href="/dashboard/check-in" className="inline-flex items-center gap-2 group/btn">
                                <span className="text-sm font-heading text-white">Wykonaj Check-in</span>
                                <ArrowRight size={14} className="text-emerald-500 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <Calendar className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-emerald-500/5 transition-colors" size={100} />
                    </Card>

                    <Button 
                        asChild
                        variant="ghost" 
                        className="p-0 h-auto rounded-2xl group active:scale-[0.98] transition-transform"
                    >
                        <Link href="/dashboard/activity-deck">
                            <Card variant="bento" padding="md" className="w-full h-32 flex flex-col justify-between overflow-hidden relative border-velvet-gold/20 bg-gradient-to-br from-[#0A0E14] to-velvet-gold/[0.05]">
                                <div className="flex items-center gap-3 relative z-10">
                                    <Sparkles className="text-velvet-gold/60" size={18} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Activity Pick</h3>
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                    <span className="text-sm font-heading text-velvet-gold">Losuj Wspólnie</span>
                                    <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                                </div>
                                <LayoutGrid className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-velvet-gold/10 transition-colors" size={100} />
                            </Card>
                        </Link>
                    </Button>
                </div>

                <div className="pt-12 text-center">
                    <p className="text-[10px] text-velvet-cream/20 uppercase tracking-[0.5em] font-black">
                        Velvet Relationship OS v2.1 • Always Synchronized
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
}
