'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, MessageSquare, ShieldCheck, Sparkles, Clock, VolumeX } from 'lucide-react'
import Link from 'next/link'
import IssueDetailView from '@/components/IssueDetailView'
import NotificationBanner from '@/components/NotificationBanner'
import { useIssues } from '@/hooks/useIssues'
import { Issue, IssueStatus, IssueUpdate } from '@/types/issue'
import { updateIssue as updateIssueAction, updateIssueStatus } from '@/lib/actions/issues'
import { createClient } from '@/utils/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function IssuesPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const { issues, loading, setIssues } = useIssues(coupleId)
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
    const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: '', show: false })
    const supabase = createClient()

    useEffect(() => {
        async function getAuth() {
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
            }
        }
        getAuth()
    }, [supabase])

    const handleUpdateIssue = async (issueId: string, updates: IssueUpdate) => {
        try {
            await updateIssueAction(issueId, updates)
            // Local state update managed by useIssues (realtime)
        } catch (err: any) {
            console.error('Update error:', err)
        }
    }

    const handleUpdateStatus = async (issueId: string, status: IssueStatus) => {
        try {
            await updateIssueStatus(issueId, status)
            // Local state update managed by useIssues (realtime)
        } catch (err: any) {
            console.error('Status update error:', err)
        }
    }

    const getStatusVariant = (status: IssueStatus) => {
        switch (status) {
            case 'new': return 'red'
            case 'read': return 'yellow'
            case 'discussed': return 'gold'
            case 'resolved': return 'green'
            default: return 'default'
        }
    }

    const getStatusLabel = (status: IssueStatus) => {
        switch (status) {
            case 'new': return 'Nowe'
            case 'read': return 'Przeczytane'
            case 'discussed': return 'Omówione'
            case 'resolved': return 'Rozwiązane'
            default: return status
        }
    }

    const renderIssueCard = (issue: Issue, isPartner: boolean) => {
        const isHeavy = issue.type === 'heavy'
        const statusOrder: IssueStatus[] = ['new', 'read', 'discussed', 'resolved']
        const currentIndex = statusOrder.indexOf(issue.status)
        const nextStatus = isPartner && currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null

        return (
            <Card
                key={issue.id}
                className="mb-8 group cursor-pointer"
                padding="none"
                onClick={() => setSelectedIssue(issue)}
            >
                {/* Type Indicator Line */}
                <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${
                    isHeavy ? 'bg-velvet-burgundy' :
                    issue.priority === 'red' ? 'bg-red-500' :
                    issue.priority === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${isHeavy ? 'bg-velvet-burgundy/10 shadow-[0_0_15px_rgba(139,0,0,0.1)]' : 'bg-velvet-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]'}`}>
                                {isHeavy ? <ShieldCheck className="text-velvet-burgundy" size={20} /> : <MessageSquare className="text-velvet-gold" size={20} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] text-velvet-gold uppercase tracking-[0.3em] font-black">
                                        {isHeavy ? 'Dziennik Trudnych Spraw' : 'Planowana Rozmowa'}
                                    </span>
                                    {issue.priority && (
                                        <Badge variant={issue.priority === 'red' ? 'red' : issue.priority === 'yellow' ? 'yellow' : 'green'}>
                                            {issue.priority === 'red' ? 'Wysoki' : issue.priority === 'yellow' ? 'Średni' : 'Lekki'}
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-velvet-cream/40 text-[10px] uppercase tracking-widest font-bold">
                                    {isPartner ? 'Sygnał od Partnera' : 'Twoje Zgłoszenie'}
                                </span>
                            </div>
                        </div>

                        <Badge variant={getStatusVariant(issue.status)} dot>
                            {getStatusLabel(issue.status)}
                        </Badge>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-velvet-cream text-xl font-light leading-relaxed">
                            &ldquo;{isHeavy ? (issue.content as any)?.fact : (issue.content as any)?.title}&rdquo;
                        </h3>

                        {isHeavy && Array.isArray((issue.content as any)?.emotions) && (
                            <div className="flex flex-wrap gap-2">
                                {(issue.content as any).emotions.map((e: string) => (
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
                                        <span className="text-xs uppercase tracking-widest font-bold text-[10px]">
                                            {new Date(issue.scheduled_at).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                )}
                                {issue.needs_quiet_space && (
                                    <Badge variant="gold" className="bg-velvet-gold/5">
                                        <VolumeX size={12} className="mr-1" />
                                        Spokojna Przestrzeń
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-velvet-cream/20 uppercase tracking-widest font-medium">
                            {new Date(issue.created_at).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>

                        {isPartner && nextStatus && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(issue.id, nextStatus)
                                }}
                            >
                                <span className="text-[9px]">Oznacz: {getStatusLabel(nextStatus)}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        )
    }

    const myIssues = issues.filter(i => i.author_id === userId)
    const partnerIssues = issues.filter(i => i.author_id !== userId)

    return (
        <DashboardLayout>
            <div className="space-y-16 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                    <div className="animate-in fade-in slide-in-from-left-12 duration-1000 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-[1px] bg-velvet-gold/40" />
                            <span className="text-velvet-gold text-[10px] uppercase tracking-[0.6em] font-black">Bezpieczna Przystań</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading text-velvet-gold uppercase tracking-tighter leading-[0.9]">
                            Bezpieczna <br />
                            <span className="text-velvet-cream italic font-light lowercase pl-8 md:pl-16 block mt-2">Przestrzeń</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/safe-space/new">
                            <Button 
                                variant="burgundy" 
                                size="lg" 
                                className="shadow-premium group h-16 md:h-20 px-8 md:px-12"
                            >
                                <Plus size={18} className="mr-4 group-hover:rotate-90 transition-transform" />
                                <span className="text-[10px] md:text-xs">Dodaj Zgłoszenie</span>
                            </Button>
                        </Link>
                    </div>
                    
                    {/* Decorative Background Element */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-velvet-burgundy/5 blur-[100px] rounded-full pointer-events-none" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24">
                    {/* Partner Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="mb-12 flex items-center gap-6">
                            <div className="p-3 bg-velvet-gold/10 rounded-[1.25rem] border border-velvet-gold/10">
                                <Sparkles className="text-velvet-gold" size={24} />
                            </div>
                            <div>
                                <h2 className="text-velvet-gold text-xs uppercase tracking-[0.6em] font-black">Sygnały od Partnera</h2>
                                <p className="text-[10px] text-velvet-cream/20 uppercase tracking-widest mt-1">To, co ważne dla Twojej drugiej połówki</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-velvet-gold/20 to-transparent" />
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
                                <div className="w-12 h-12 border-b-2 border-velvet-gold rounded-full animate-spin" />
                                <span className="text-[9px] text-velvet-gold uppercase tracking-[0.5em] font-black">Synchronizacja Duszy...</span>
                            </div>
                        ) : partnerIssues.length === 0 ? (
                            <Card variant="outline" className="p-24 flex flex-col items-center justify-center text-center opacity-20 border-dashed">
                                <Sparkles size={40} className="mb-8 text-velvet-gold/40" />
                                <p className="italic text-xl text-velvet-cream font-light mb-3">Czyste niebo</p>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Partner nie dodał jeszcze nowych sygnałów.</p>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {partnerIssues.map(i => renderIssueCard(i, true))}
                            </div>
                        )}
                    </section>

                    {/* Personal Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        <div className="mb-12 flex items-center gap-6">
                            <div className="p-3 bg-velvet-burgundy/10 rounded-[1.25rem] border border-velvet-burgundy/10">
                                <Plus className="text-velvet-burgundy" size={24} />
                            </div>
                            <div>
                                <h2 className="text-velvet-burgundy text-xs uppercase tracking-[0.6em] font-black">Twoje Wyznania</h2>
                                <p className="text-[10px] text-velvet-cream/20 uppercase tracking-widest mt-1">Miejsce na Twoje emocje i potrzeby</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-velvet-burgundy/20 to-transparent" />
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <div className="w-12 h-12 border-b-2 border-white/10 rounded-full animate-spin" />
                            </div>
                        ) : myIssues.length === 0 ? (
                            <Card variant="outline" className="p-24 flex flex-col items-center justify-center text-center opacity-20 border-dashed">
                                <Plus size={40} className="mb-8 text-velvet-cream/40" />
                                <p className="italic text-xl text-velvet-cream font-light mb-3">Czas na otwartość</p>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Twoje zgłoszenia pojawią się w tym miejscu.</p>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {myIssues.map(i => renderIssueCard(i, false))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Detail View Modal */}
                {selectedIssue && userId && (
                    <IssueDetailView
                        issue={selectedIssue}
                        userId={userId}
                        isPartner={selectedIssue.author_id !== userId}
                        onClose={() => setSelectedIssue(null)}
                        onUpdateStatus={handleUpdateStatus}
                        onUpdateIssue={handleUpdateIssue}
                    />
                )}

                <NotificationBanner 
                    message={notification.message}
                    isOpen={notification.show}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            </div>
        </DashboardLayout>
    )
}
