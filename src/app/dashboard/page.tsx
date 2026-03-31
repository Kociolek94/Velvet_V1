'use client'

import { useState, useEffect, useMemo } from 'react'
import RelationshipChart from '@/components/RelationshipChart'
import DashboardLayout from '@/components/DashboardLayout'
import Sparkline from '@/components/Sparkline'
import { getDashboardStats, DashboardStats } from '@/lib/dashboard'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'
import { 
    Heart, MessageCircle, Sparkles, Zap, Clock, 
    TrendingUp, Activity, ShieldAlert, Target, 
    ArrowRight, Loader2, Calendar, LayoutGrid,
    Search, Bell
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function DashboardPage() {
    const { userId, coupleId, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [names, setNames] = useState({ me: 'Ty', partner: 'Partner' })
    const [hasData, setHasData] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        async function loadDashboardData() {
            if (!coupleId || !userId) {
                if (!authLoading) setLoading(false)
                return
            }

            try {
                // 1. Fetch profiles for names
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

                // 2. Load Stats
                const dashboardStats = await getDashboardStats(coupleId, userId)
                setStats(dashboardStats)

                // 3. Fetch metrics for Radar Chart
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
                }
            } catch (err) {
                console.error('Error loading dashboard:', err)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [coupleId, userId, authLoading, supabase])

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
            <div className="max-w-7xl mx-auto space-y-12 pb-24 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[1px] bg-velvet-gold/40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-velvet-gold/60">System Velvet v2.1</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-white uppercase">
                            Puls <span className="text-velvet-gold italic font-light lowercase">Waszego</span> Świata
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right space-y-1 pr-6 border-r border-white/10 hidden md:block">
                            <span className="text-[10px] text-velvet-cream/30 uppercase tracking-[0.3em] font-black block">Wspólna Harmonia</span>
                            <div className="flex items-center justify-end gap-2">
                                <Activity size={14} className="text-emerald-500" />
                                <span className="text-2xl font-heading text-white">{stats?.syncPercentage}%</span>
                            </div>
                        </div>
                        <Button variant="gold" className="rounded-2xl h-[54px] px-8 group shadow-gold-sm" asChild>
                            <Link href="/dashboard/check-in">
                                <Zap size={18} className="mr-3 group-hover:animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest">Aktualizuj Status</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    
                    {/* Radar Card - Left Column */}
                    <div className="lg:col-span-7 h-full">
                        <Card className="p-8 md:p-12 flex flex-col h-full min-h-[600px] group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Target size={120} />
                            </div>
                            
                            <div className="flex justify-between items-center mb-12 relative z-10">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-velvet-gold">Karta Radarowa</h3>
                                    <p className="text-[9px] text-velvet-cream/40 uppercase tracking-[0.2em]">Analiza z ostatnich 7 dni</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">SYNC: {stats?.syncPercentage}%</span>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center py-8">
                                <RelationshipChart data={chartData} userName={names.me} partnerName={names.partner} />
                            </div>

                            <div className="mt-12 space-y-4 relative z-10">
                                {stats?.perceptionGaps.filter(g => g.gap > 2).map((gap, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-red-500/[0.03] border border-red-500/10 rounded-2xl group/gap hover:bg-red-500/[0.05] transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                                                <ShieldAlert size={16} className="text-red-500" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] text-red-500/80 font-black uppercase tracking-widest block">Potencjał Konfliktu</span>
                                                <span className="text-xs text-white uppercase tracking-widest font-medium">Obszar: {gap.category}</span>
                                            </div>
                                        </div>
                                        <Badge variant="red" size="sm">LUKA {gap.gap.toFixed(1)}</Badge>
                                    </motion.div>
                                ))}
                                {stats?.perceptionGaps.filter(g => g.gap > 2).length === 0 && (
                                    <div className="flex items-center gap-4 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                            <Sparkles size={18} className="text-emerald-500" />
                                        </div>
                                        <p className="text-[11px] text-emerald-500/80 uppercase tracking-widest font-black leading-relaxed">
                                            Wasza percepcja jest doskonale zsynchronizowana. Jesteście dla siebie bezpiecznym portem.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Widgets */}
                    <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-10">
                        
                        {/* communication Pulse */}
                        <Card className="p-10 flex flex-col justify-between group h-full">
                            <div>
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-velvet-gold/5 border border-velvet-gold/10 flex items-center justify-center group-hover:bg-velvet-gold/10 transition-colors">
                                            <MessageCircle className="text-velvet-gold" size={20} />
                                        </div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Puls Rozmów</h3>
                                    </div>
                                    <Badge variant="gold">SAFE SPACE</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-10 mb-12">
                                    <div className="space-y-2">
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-velvet-cream/30 font-black block">Otwartość</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-heading text-white">{stats?.activeTopics}</span>
                                            <span className="text-velvet-cream/20 text-[10px] uppercase font-black tracking-widest">tematy</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-velvet-cream/30 font-black block">Gojenie (AVG)</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-heading text-white">{stats?.deescalationTime}</span>
                                            <span className="text-velvet-cream/20 text-[10px] uppercase font-black tracking-widest">h</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {['closeness', 'communication', 'support', 'intimacy'].map((metric) => (
                                        <div key={metric} className="flex items-center justify-between group/line cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-velvet-gold/20 group-hover/line:bg-velvet-gold group-hover/line:scale-125 transition-all duration-500" />
                                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-velvet-cream/40 group-hover/line:text-white transition-colors capitalize">
                                                    {metric === 'closeness' ? 'Bliskość' : metric === 'communication' ? 'Komunikacja' : metric === 'support' ? 'Wsparcie' : 'Intymność'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <Sparkline data={stats?.trends[metric] || []} color="#C6A355" />
                                                <span className="text-sm font-heading text-white w-4 text-right">
                                                    {stats?.trends[metric]?.length ? stats.trends[metric][stats.trends[metric].length-1] : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${stats && stats.activeTopics > 3 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                                        Status: <span className={stats && stats.activeTopics > 3 ? 'text-red-500' : 'text-emerald-500'}>
                                            {stats && stats.activeTopics > 3 ? 'Zatłoczony' : 'Czysty Eter'}
                                        </span>
                                    </span>
                                </div>
                                <Link href="/dashboard/safe-space" className="text-velvet-gold text-[9px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                                    Bezpieczna Przestrzeń <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </Card>

                        {/* Dynamics Card */}
                        <Card className="p-10 flex flex-col justify-between group overflow-hidden relative h-full">
                            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={240} />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-velvet-gold/5 border border-velvet-gold/10 flex items-center justify-center group-hover:bg-velvet-gold/10 transition-colors">
                                            <TrendingUp className="text-velvet-gold" size={20} />
                                        </div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Dynamika Energii</h3>
                                    </div>
                                    <Badge variant="gold">AKTYWNOŚĆ</Badge>
                                </div>

                                <div className="space-y-12 mb-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-velvet-gold/60" size={12} />
                                            <span className="text-[9px] uppercase tracking-widest text-velvet-cream/40 font-black">Wspólne Momenty (7 dni)</span>
                                        </div>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-7xl font-heading text-white">{stats?.activityScore}</span>
                                            <div className="space-y-1">
                                                <span className="text-emerald-500 text-[10px] uppercase tracking-widest font-black block">+12% vs week</span>
                                                <span className="text-velvet-cream/20 text-[9px] uppercase tracking-widest font-black block">Zrealizowano</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-br from-velvet-gold/5 to-transparent" />
                                        <Target className="absolute -right-4 -top-4 text-white/[0.02]" size={100} />
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] uppercase tracking-widest text-velvet-gold font-black px-3 py-1 rounded-full bg-velvet-gold/10 border border-velvet-gold/20">Najbliższe Marzenie</span>
                                                <Target size={14} className="text-velvet-gold/40" />
                                            </div>
                                            <h4 className="text-2xl font-heading text-white leading-tight">{stats?.nearestGoal}</h4>
                                            <Link href="/dashboard/bucket-list" className="text-[9px] uppercase tracking-widest font-black text-velvet-cream/30 hover:text-white transition-colors flex items-center gap-3">
                                                Otwórz Tablicę Marzeń <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button variant="burgundy" className="w-full py-6 rounded-2xl group/shuffle h-auto" asChild>
                                    <Link href="/dashboard/activity-deck">
                                        <RotateCcw size={18} className="mr-3 group-hover/shuffle:rotate-180 transition-transform duration-1000" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Losuj Wspólną Aktywność</span>
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Velvet Insight (AI Mimic) - Full Width Grid */}
                <Card className="v-card-burgundy md:p-16 p-10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-100 transition-transform duration-1000">
                        <Sparkles size={200} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10">
                        <div className="md:col-span-8 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-velvet-gold/20 flex items-center justify-center border border-velvet-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                    <Sparkles className="text-velvet-gold" size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-velvet-gold/80">Velvet Insight</h3>
                                    <div className="h-[1px] w-20 bg-gradient-to-r from-velvet-gold/40 to-transparent" />
                                </div>
                            </div>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-5xl font-light text-white leading-tight italic font-serif"
                            >
                                "{stats?.insight}"
                            </motion.p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Badge variant="gold" className="bg-velvet-gold/10 border-velvet-gold/20 px-4 py-2">ANALIZA DYNAMIKI</Badge>
                                <Badge variant="cream" className="bg-white/5 border-white/10 px-4 py-2 text-white/40">GŁĘBOKIE POŁĄCZENIE</Badge>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col items-center justify-center space-y-6 md:border-l md:border-white/5">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-velvet-gold/20 flex items-center justify-center p-2 relative">
                                <div className="absolute inset-2 rounded-full border border-velvet-gold/40 animate-pulse shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
                                <Heart className="text-velvet-gold" size={40} />
                            </div>
                            <div className="text-center space-y-2">
                                <span className="text-[10px] text-velvet-cream/40 uppercase tracking-[0.3em] font-black">Twoja Ścieżka</span>
                                <p className="text-xs text-white uppercase tracking-widest font-bold">Poziom Bliskości: Eteryczny</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Footer Advice */}
                <div className="bg-gradient-to-br from-white to-velvet-cream/90 p-12 md:p-16 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 group relative overflow-hidden shadow-2xl">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-velvet-gold/30 rounded-full blur-3xl pointer-events-none transition-all duration-1000 group-hover:scale-125 group-hover:opacity-50" />
                    <div className="absolute -left-20 -top-20 w-60 h-60 bg-velvet-burgundy/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-8 relative z-10 max-w-2xl text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <div className="w-12 h-[1px] bg-velvet-burgundy/40" />
                            <h3 className="text-2xl font-black text-velvet-burgundy font-heading tracking-[0.2em] uppercase">Sztuka Bliskości</h3>
                        </div>
                        <p className="text-black/70 text-lg leading-relaxed font-medium italic">
                            „Niezależnie od liczb, pamiętajcie, że dzisiejszy dzień to nowa czysta karta. Małe gesty, jak wspólna herbata czy szczere „dziękuję”, budują fundament, którego nie zmierzy żaden algorytm.”
                        </p>
                    </div>

                    <Link
                        href="/dashboard/wishlist"
                        className="bg-[#0A0E14] text-velvet-gold px-12 py-6 rounded-3xl font-black tracking-[0.4em] uppercase text-xs hover:bg-velvet-burgundy hover:text-white transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4 relative z-10"
                    >
                        Spełnij Życzenie <Sparkles size={16} className="animate-pulse" />
                    </Link>
                </div>

            </div>
        </DashboardLayout>
    )
}

function RotateCcw(props: any) {
    return <Activity {...props} />
}
