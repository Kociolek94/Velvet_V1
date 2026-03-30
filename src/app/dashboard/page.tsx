'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import RelationshipChart from '@/components/RelationshipChart'
import DashboardLayout from '@/components/DashboardLayout'
import {
    Heart,
    MessageSquare,
    Sparkles,
    HandHelping,
    Flame,
    Zap,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react'
import Link from 'next/link'

interface MetricAverages {
    closeness: number
    communication: number
    support: number
    intimacy: number
    time_together: number
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState<any[]>([])
    const [names, setNames] = useState({ me: 'Ty', partner: 'Partner' })
    const [averages, setAverages] = useState<MetricAverages | null>(null)
    const [partnerAverages, setPartnerAverages] = useState<MetricAverages | null>(null)
    const [hasData, setHasData] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // 1. Get couple info and partner profile
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, display_name, couple_id')

                const myProfile = profiles?.find(p => p.id === user.id)
                if (!myProfile?.couple_id) {
                    setLoading(false)
                    return
                }

                const partnerProfile = profiles?.find(p => p.couple_id === myProfile.couple_id && p.id !== user.id)
                setNames({
                    me: myProfile.display_name || 'Ty',
                    partner: partnerProfile?.display_name || 'Partner'
                })

                // 2. Fetch metrics for last 7 days
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                const dateStr = sevenDaysAgo.toISOString().split('T')[0]

                const { data: metrics } = await supabase
                    .from('daily_metrics')
                    .select('*')
                    .eq('couple_id', myProfile.couple_id)
                    .gte('created_at', dateStr)

                if (!metrics || metrics.length === 0) {
                    setHasData(false)
                    setLoading(false)
                    return
                }

                setHasData(true)

                // 3. Calculation helper
                const calcAverages = (userId: string) => {
                    const userMetrics = metrics.filter(m => m.user_id === userId)
                    if (userMetrics.length === 0) return null

                    const count = userMetrics.length
                    return {
                        closeness: userMetrics.reduce((sum, m) => sum + m.closeness, 0) / count,
                        communication: userMetrics.reduce((sum, m) => sum + m.communication, 0) / count,
                        support: userMetrics.reduce((sum, m) => sum + m.support, 0) / count,
                        intimacy: userMetrics.reduce((sum, m) => sum + m.intimacy, 0) / count,
                        time_together: userMetrics.reduce((sum, m) => sum + m.time_together, 0) / count
                    }
                }

                const myAvg = calcAverages(user.id)
                const partnerAvg = partnerProfile ? calcAverages(partnerProfile.id) : null

                setAverages(myAvg)
                setPartnerAverages(partnerAvg)

                // 4. Set Chart Data
                const subjects = [
                    { key: 'closeness', label: 'Bliskość' },
                    { key: 'communication', label: 'Komunikacja' },
                    { key: 'support', label: 'Wsparcie' },
                    { key: 'intimacy', label: 'Intymność' },
                    { key: 'time_together', label: 'Czas' }
                ]

                const newChartData = subjects.map(s => ({
                    subject: s.label,
                    A: myAvg ? Math.round(myAvg[s.key as keyof MetricAverages] * 10) / 10 : 0,
                    B: partnerAvg ? Math.round(partnerAvg[s.key as keyof MetricAverages] * 10) / 10 : 0,
                    fullMark: 10
                }))

                setChartData(newChartData)

            } catch (err) {
                console.error('Error loading dashboard:', err)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [supabase])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E14] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-[1px] bg-velvet-gold/20 animate-expand" />
                <div className="animate-pulse text-velvet-gold tracking-[1em] font-heading text-sm uppercase pl-[1em]">VELVET</div>
                <div className="w-16 h-[1px] bg-velvet-gold/20 animate-expand" />
            </div>
        )
    }

    const commAlert = partnerAverages && partnerAverages.communication < 5

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                        <h1 className="text-3xl md:text-5xl font-semibold text-velvet-gold font-heading mb-2 tracking-tight">
                            Status <span className="text-velvet-cream italic font-light">Relacji</span>
                        </h1>
                        <p className="text-velvet-cream/40 text-[10px] uppercase tracking-[0.4em] font-bold">Osobisty Panel Bliskości</p>
                    </div>

                    <Link href="/dashboard/check-in" className="v-button-burgundy flex items-center gap-3 px-8 group shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
                        <Zap size={18} className="text-velvet-gold group-hover:animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Wykonaj Daily Check-in</span>
                    </Link>
                </div>

                {!hasData ? (
                    <div className="v-card p-20 flex flex-col items-center justify-center text-center space-y-8 border-dashed border-white/5 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="w-24 h-24 rounded-full bg-velvet-gold/5 flex items-center justify-center border border-velvet-gold/10">
                            <Activity className="text-velvet-gold/40" size={40} />
                        </div>
                        <div className="max-w-md">
                            <h2 className="text-2xl font-heading text-velvet-gold uppercase tracking-widest mb-4">Czekamy na pierwsze dane</h2>
                            <p className="text-velvet-cream/40 text-sm leading-relaxed">
                                Wykonajcie swój pierwszy Daily Check-in, aby Velvet Confidant mógł wygenerować Waszą Kartę Radarową i przeanalizować kondycję związku.
                            </p>
                        </div>
                        <Link href="/dashboard/check-in" className="v-button-gold px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-black">
                            Zacznij tutaj
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                        {/* Left: Radar Chart */}
                        <div className="lg:col-span-7 v-card p-10 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Sparkles size={120} />
                            </div>

                            <div className="w-full mb-8 flex justify-between items-center px-4">
                                <h2 className="text-velvet-gold text-xs uppercase tracking-[0.4em] font-black flex items-center gap-3">
                                    <Activity size={18} />
                                    Karta Radarowa (7D)
                                </h2>
                            </div>

                            <div className="w-full flex-1 min-h-[400px] flex items-center justify-center">
                                <RelationshipChart data={chartData} userName={names.me} partnerName={names.partner} />
                            </div>
                        </div>

                        {/* Right: Metrics Grid */}
                        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

                            {/* Closeness Card */}
                            <div className="v-card-gold-border p-8 flex flex-col justify-between group overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 text-velvet-gold/5 group-hover:scale-110 transition-transform">
                                    <Heart size={120} />
                                </div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="p-3 bg-velvet-gold/10 rounded-2xl">
                                        <Heart className={`text-velvet-gold ${averages?.closeness && averages.closeness > 7 ? 'fill-velvet-gold/20' : ''}`} size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase tracking-widest text-velvet-cream/30 font-bold block mb-1">Bliskość</span>
                                        <span className="text-3xl font-heading text-velvet-gold">{averages ? Math.round(averages.closeness * 10) / 10 : '-'}</span>
                                        <span className="text-velvet-gold/40 text-xs ml-1">/10</span>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] text-velvet-cream/40 uppercase tracking-widest italic leading-none">Status stabilny</span>
                                    <TrendingUp size={20} className="text-velvet-gold opacity-30" />
                                </div>
                            </div>

                            {/* Communication Card */}
                            <div className={`p-8 rounded-[2rem] border transition-all duration-700 ${commAlert ? 'bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${commAlert ? 'bg-red-500/10' : 'bg-black/20'}`}>
                                        <MessageSquare className={commAlert ? 'text-red-500' : 'text-velvet-cream/40'} size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase tracking-widest text-velvet-cream/30 font-bold block mb-1">Komunikacja</span>
                                        <span className={`text-3xl font-heading ${commAlert ? 'text-red-500' : 'text-velvet-cream'}`}>{averages ? Math.round(averages.communication * 10) / 10 : '-'}</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${commAlert ? 'bg-red-500' : 'bg-velvet-gold/40'}`}
                                            style={{ width: `${(averages?.communication || 0) * 10}%` }}
                                        />
                                    </div>
                                    <p className={`text-[10px] mt-4 uppercase tracking-widest font-bold ${commAlert ? 'text-red-500/60 animate-pulse' : 'text-velvet-cream/20'}`}>
                                        {commAlert ? 'Wymagana Uwaga' : 'Poziom optymalny'}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Bottom Row: AI Insight / Alert */}
                        {commAlert && (
                            <div className="lg:col-span-12 v-card p-1 flex items-stretch overflow-hidden bg-red-500/5 border-red-500/10 animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="w-2 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
                                <div className="p-10 flex flex-col md:flex-row items-center gap-10 flex-1">
                                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                        <Zap className="text-red-500" size={32} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">Alert Bliskości</span>
                                            <span className="text-velvet-gold text-[10px] uppercase tracking-widest font-bold">Wiadomość od Velvet Confidant</span>
                                        </div>
                                        <p className="text-velvet-cream/80 text-lg font-light leading-relaxed">
                                            Uwaga: Średni wynik komunikacji u <span className="text-velvet-gold font-bold">{names.partner}</span> spadł poniżej <span className="text-red-400 font-bold">5.0</span>. Partnerka może potrzebować Twojej uważności i bezpiecznej przestrzeni do rozmowy.
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard/safe-space/new"
                                        className="v-button-gold px-10 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                                    >
                                        Wyjdź naprzeciw
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="lg:col-span-12 v-card-light p-10 flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden">
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-velvet-gold/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 group-hover:scale-110" />

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-velvet-burgundy" size={24} />
                                    <h3 className="text-2xl font-semibold text-black font-heading tracking-tight uppercase">Velvet Advice</h3>
                                </div>
                                <p className="text-black/60 text-sm max-w-xl leading-relaxed">
                                    Pamiętaj, że relacja to żywy organizm. Dzisiejsze dane to tylko moment w czasie – liczy się Wasza otwartość i gotowość do wzajemnego wsparcia.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/games"
                                className="bg-black text-velvet-gold px-12 py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-[11px] hover:bg-velvet-burgundy hover:text-white transition-all shadow-2xl relative z-10"
                            >
                                Zagraj w Grę!
                            </Link>
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
