'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Issue {
    id: string
    author_id: string
    type: 'heavy' | 'talk'
    status: 'new' | 'read' | 'discussed' | 'resolved'
    content: any
    color_category?: string
    created_at: string
}

export default function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
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
            setLoading(false)

            // Realtime subscription
            const channel = supabase
                .channel('issues_realtime')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'issues', filter: `couple_id=eq.${profile.couple_id}` },
                    (payload) => {
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

            return () => {
                supabase.removeChannel(channel)
            }
        }
        fetchData()
    }, [supabase])

    const updateStatus = async (issueId: string, nextStatus: string) => {
        await supabase
            .from('issues')
            .update({ status: nextStatus })
            .eq('id', issueId)
    }

    const getNextStatus = (current: string) => {
        switch (current) {
            case 'new': return 'read'
            case 'read': return 'discussed'
            case 'discussed': return 'resolved'
            default: return null
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Nowe'
            case 'read': return 'Przeczytane'
            case 'discussed': return 'Omówione'
            case 'resolved': return 'Rozwiązane'
            default: return status
        }
    }

    if (loading) return <div className="text-velvet-gold animate-pulse text-center p-8">Ładowanie tematów...</div>

    const myIssues = issues.filter(i => i.author_id === userId)
    const partnerIssues = issues.filter(i => i.author_id !== userId)

    const renderIssueCard = (issue: Issue, isPartnerIssue: boolean) => {
        const nextStatus = getNextStatus(issue.status)
        const canUpdate = isPartnerIssue && nextStatus

        return (
            <div key={issue.id} className="p-6 bg-velvet-dark/40 border border-velvet-burgundy/20 rounded-2xl mb-4 hover:border-velvet-gold/20 transition-all backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${issue.type === 'heavy' ? 'bg-velvet-burgundy text-white' : 'bg-blue-900 text-blue-100'
                        }`}>
                        {issue.type === 'heavy' ? 'Ciężko mi' : 'Pogadajmy'}
                    </span>
                    <span className="text-[10px] text-velvet-gold/60 font-mono">
                        {getStatusLabel(issue.status)}
                    </span>
                </div>

                <div className="space-y-3">
                    {issue.type === 'heavy' && issue.content && (
                        <>
                            <p className="text-white text-sm leading-relaxed">&ldquo;{issue.content.fact}&rdquo;</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {issue.content.emotions?.map((e: string) => (
                                    <span key={e} className="text-[9px] text-velvet-gold/80 bg-velvet-gold/5 px-2 py-0.5 rounded border border-velvet-gold/20 italic">#{e}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {canUpdate && (
                    <button
                        onClick={() => updateStatus(issue.id, nextStatus)}
                        className="w-full mt-6 py-3 bg-velvet-gold text-black rounded-xl hover:bg-opacity-80 transition-all font-bold uppercase text-[9px] tracking-widest"
                    >
                        Sygnalizuj: {getStatusLabel(nextStatus)}
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <section>
                <h3 className="text-velvet-gold text-xs uppercase tracking-[0.4em] mb-6 font-bold border-b border-velvet-gold/10 pb-4">
                    Od Partnera
                </h3>
                {partnerIssues.length === 0 ? (
                    <p className="text-gray-600 text-sm italic">Brak nowych komunikatów.</p>
                ) : (
                    partnerIssues.map(i => renderIssueCard(i, true))
                )}
            </section>

            <section>
                <h3 className="text-gray-500 text-xs uppercase tracking-[0.4em] mb-6 font-bold border-b border-white/5 pb-4">
                    Moje zgłoszenia
                </h3>
                {myIssues.length === 0 ? (
                    <p className="text-gray-600 text-sm italic">Nic nie zgłosiłeś/aś.</p>
                ) : (
                    myIssues.map(i => renderIssueCard(i, false))
                )}
            </section>
        </div>
    )
}
