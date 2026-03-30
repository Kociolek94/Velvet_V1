'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, MessageSquare, ShieldCheck, Sparkles, Clock, VolumeX, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import IssueDetailView from '@/components/IssueDetailView'

interface Issue {
    id: string
    couple_id: string
    author_id: string
    type: 'heavy' | 'talk'
    status: 'new' | 'read' | 'discussed' | 'resolved'
    content: any
    priority?: 'red' | 'yellow' | 'green'
    scheduled_at?: string
    needs_quiet_space?: boolean
    created_at: string
    updated_at: string
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        let channel: any

        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                setUserId(user.id)

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('couple_id')
                    .eq('id', user.id)
                    .single()

                if (!profile?.couple_id) return

                const { data: issuesData } = await supabase
                    .from('issues')
                    .select('*')
                    .eq('couple_id', profile.couple_id)
                    .order('created_at', { ascending: false })

                setIssues(issuesData || [])

                // Realtime subscription
                channel = supabase
                    .channel('issues_realtime_safe_space')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'issues', filter: `couple_id=eq.${profile.couple_id}` },
                        (payload: any) => {
                            if (payload.eventType === 'INSERT') {
                                setIssues(prev => [payload.new as Issue, ...prev])
                            } else if (payload.eventType === 'UPDATE') {
                                setIssues(prev => prev.map(issue => issue.id === payload.new.id ? payload.new as Issue : issue))
                            } else if (payload.eventType === 'DELETE') {
                                setIssues(prev => prev.filter(issue => issue.id !== payload.old.id))
                            }
                        }
                    )
                    .subscribe()

            } catch (err) {
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            if (channel) supabase.removeChannel(channel)
        }
    }, [supabase])

    const updateStatus = async (issueId: string, nextStatus: string) => {
        try {
            const { error } = await supabase
                .from('issues')
                .update({ status: nextStatus })
                .eq('id', issueId)
            if (error) throw error
        } catch (err: any) {
            alert(err.message)
        }
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'new': return { label: 'Nowe', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
            case 'read': return { label: 'Przeczytane', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
            case 'discussed': return { label: 'Omówione', color: 'text-velvet-gold', bg: 'bg-velvet-gold/10', border: 'border-velvet-gold/20' }
            case 'resolved': return { label: 'Rozwiązane', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
            default: return { label: 'Status', color: 'text-velvet-cream/40', bg: 'bg-white/5', border: 'border-white/5' }
        }
    }

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'red': return 'text-red-500 bg-red-500/20 border-red-500/30'
            case 'yellow': return 'text-amber-500 bg-amber-500/20 border-amber-500/30'
            case 'green': return 'text-emerald-500 bg-emerald-500/20 border-emerald-500/30'
            default: return 'text-velvet-cream/40 bg-white/5 border-white/5'
        }
    }

    const renderIssueCard = (issue: Issue, isPartner: boolean) => {
        const s = getStatusInfo(issue.status)
        const isHeavy = issue.type === 'heavy'

        // Status Stepper logic for Partner
        const statusOrder: Issue['status'][] = ['new', 'read', 'discussed', 'resolved']
        const currentIndex = statusOrder.indexOf(issue.status)
        const nextStatus = isPartner && currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null

        return (
            <div
                key={issue.id}
                className="v-card p-8 mb-6 group transition-all duration-500 hover:shadow-gold/5 relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedIssue(issue)}
            >
                {/* Type Indicator */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isHeavy ? 'bg-velvet-burgundy' :
                    issue.priority === 'red' ? 'bg-red-500' :
                        issue.priority === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                />

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isHeavy ? 'bg-velvet-burgundy/10' : 'bg-velvet-gold/10'}`}>
                            {isHeavy ? <ShieldCheck className="text-velvet-burgundy" size={20} /> : <MessageSquare className="text-velvet-gold" size={20} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-velvet-gold uppercase tracking-[0.3em] font-black">
                                    {isHeavy ? 'Dziennik Trudnych Spraw' : 'Planowana Rozmowa'}
                                </span>
                                {issue.priority && (
                                    <span className={`text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border ${getPriorityColor(issue.priority)}`}>
                                        {issue.priority === 'red' ? 'Wysoki' : issue.priority === 'yellow' ? 'Średni' : 'Lekki'}
                                    </span>
                                )}
                            </div>
                            <span className="text-velvet-cream/40 text-[10px] uppercase tracking-widest font-bold">
                                {isPartner ? 'Sygnał od Partnera' : 'Twoje Zgłoszenie'}
                            </span>
                        </div>
                    </div>

                    <div className={`px-4 py-1.5 rounded-full border ${s.bg} ${s.color} ${s.border} shadow-sm`}>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{s.label}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-velvet-cream text-xl font-light leading-relaxed">
                        &ldquo;{isHeavy ? issue.content?.fact : issue.content?.title}&rdquo;
                    </h3>

                    {isHeavy && issue.content?.emotions?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {issue.content.emotions.map((e: string) => (
                                <span key={e} className="text-[10px] text-velvet-gold italic bg-velvet-gold/5 px-3 py-1 rounded-lg border border-velvet-gold/10">
                                    #{e}
                                </span>
                            ))}
                        </div>
                    )}

                    {!isHeavy && (
                        <div className="flex flex-wrap gap-6 pt-2">
                            {issue.scheduled_at && (
                                <div className="flex items-center gap-2 text-velvet-cream/50">
                                    <Clock size={16} />
                                    <span className="text-xs">{new Date(issue.scheduled_at).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                            )}
                            {issue.needs_quiet_space && (
                                <div className="flex items-center gap-2 text-velvet-gold bg-velvet-gold/5 px-3 py-1 rounded-lg border border-velvet-gold/20">
                                    <VolumeX size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Spokojna Przestrzeń</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-velvet-cream/20 uppercase tracking-widest font-medium">
                        Wysłano: {new Date(issue.created_at).toLocaleDateString()}
                    </span>

                    {isPartner && nextStatus && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(issue.id, nextStatus)
                            }}
                            className="v-button-gold px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-gold/10"
                        >
                            Oznacz jako {getStatusInfo(nextStatus).label}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    const myIssues = issues.filter(i => i.author_id === userId)
    const partnerIssues = issues.filter(i => i.author_id !== userId)

    return (
        <DashboardLayout>
            <div className="space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="text-velvet-gold" size={18} />
                            <span className="text-velvet-gold text-[10px] uppercase tracking-[0.5em] font-black">Bezpieczna Przystań</span>
                        </div>
                        <h1 className="text-5xl font-heading text-velvet-gold uppercase tracking-tight">Safe <span className="text-velvet-cream italic font-light lowercase">Space</span></h1>
                    </div>

                    <Link
                        href="/dashboard/safe-space/new"
                        className="v-button-burgundy flex items-center gap-4 px-10 py-5 group shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform text-velvet-gold" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-velvet-gold">Dodaj Zgłoszenie</span>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                    {/* Partner Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="mb-10 flex items-center gap-6">
                            <div className="p-3 bg-velvet-gold/10 rounded-2xl">
                                <Sparkles className="text-velvet-gold" size={24} />
                            </div>
                            <h2 className="text-velvet-gold text-sm uppercase tracking-[0.5em] font-black">Sygnały od Partnera</h2>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-velvet-gold/20 to-transparent" />
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="w-10 h-10 border-2 border-velvet-gold/20 border-t-velvet-gold rounded-full animate-spin" />
                                <span className="text-[10px] text-velvet-gold uppercase tracking-[0.3em] font-bold">Synchronizacja...</span>
                            </div>
                        ) : partnerIssues.length === 0 ? (
                            <div className="p-20 v-card border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                                <Sparkles size={48} className="mb-6 text-velvet-gold" />
                                <p className="italic text-lg text-velvet-cream font-light mb-2">Czysta karta</p>
                                <p className="text-xs uppercase tracking-widest">Partner nie dodał jeszcze nowych sygnałów.</p>
                            </div>
                        ) : (
                            partnerIssues.map(i => renderIssueCard(i, true))
                        )}
                    </section>

                    {/* Personal Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <div className="mb-10 flex items-center gap-6">
                            <div className="p-3 bg-velvet-burgundy/10 rounded-2xl">
                                <Plus className="text-velvet-burgundy" size={24} />
                            </div>
                            <h2 className="text-velvet-burgundy text-sm uppercase tracking-[0.5em] font-black">Twoje Sygnały</h2>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-velvet-burgundy/20 to-transparent" />
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="w-10 h-10 border-2 border-white/5 border-t-velvet-cream rounded-full animate-spin" />
                            </div>
                        ) : myIssues.length === 0 ? (
                            <div className="p-20 v-card border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                                <Plus size={48} className="mb-6 text-velvet-cream" />
                                <p className="italic text-lg text-velvet-cream font-light mb-2">Pusto tutaj</p>
                                <p className="text-xs uppercase tracking-widest">Twoje zgłoszenia pojawią się w tym miejscu.</p>
                            </div>
                        ) : (
                            myIssues.map(i => renderIssueCard(i, false))
                        )}
                    </section>
                </div>

                {/* Detail View Modal */}
                {selectedIssue && (
                    <IssueDetailView
                        issue={selectedIssue}
                        isPartner={selectedIssue.author_id !== userId}
                        onClose={() => setSelectedIssue(null)}
                        onUpdateStatus={(id, status) => {
                            updateStatus(id, status)
                            // Update local selected state if still open
                            setSelectedIssue(prev => prev ? { ...prev, status: status as any } : null)
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
