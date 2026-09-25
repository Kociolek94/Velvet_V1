'use client'

import { useState, useEffect } from 'react'
import {
    ShieldCheck,
    MessageSquare,
    Quote,
    Heart,
    Shield,
    Sparkles,
    Wind,
    Clock,
    VolumeX,
    Send,
    OctagonAlert,
    Calendar,
    PenTool,
    FileText,
    Sparkle
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { analyzeMessage } from '@/lib/actions/velvet_engine'
import OverloadModal from './OverloadModal'
import VelvetDateTimePicker from './VelvetDateTimePicker'
import { Issue, IssueUpdate, IssueStatus, IssueContent } from '@/types/issue'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'

interface IssueDetailViewProps {
    issue: Issue
    onClose: () => void
    onUpdateStatus: (id: string, status: IssueStatus) => Promise<void>
    onUpdateIssue: (id: string, updates: IssueUpdate) => Promise<void>
    isPartner: boolean
    userId: string
}

export default function IssueDetailView({ 
    issue, 
    onClose, 
    onUpdateStatus, 
    onUpdateIssue, 
    isPartner, 
    userId 
}: IssueDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingDraft, setIsEditingDraft] = useState(false)
    const [draftText, setDraftText] = useState(issue.solution_draft || '')
    const content = issue.content as unknown as IssueContent
    const [editData, setEditData] = useState({
        priority: issue.priority,
        need_now: content.need_now || content.needs || ''
    })
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')
    const [isOverloadModalOpen, setIsOverloadModalOpen] = useState(false)
    const [isRescheduling, setIsRescheduling] = useState(false)
    const [newSchedule, setNewSchedule] = useState(issue.scheduled_at || '')
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const supabase = createClient()

    const isHeavy = issue.type === 'heavy'
    const statusOrder: IssueStatus[] = ['new', 'read', 'discussed', 'resolved']

    useEffect(() => {
        if (isPartner && issue.status === 'new') {
            onUpdateStatus(issue.id, 'read')
        }
    }, [isPartner, issue.status, issue.id, onUpdateStatus])

    // Fetch and sync comments
    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await supabase
                .from('issue_comments')
                .select('*')
                .eq('issue_id', issue.id)
                .order('created_at', { ascending: true })
            if (data) setComments(data)
        }

        fetchComments()

        const channel = supabase
            .channel(`comments_${issue.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'issue_comments', filter: `issue_id=eq.${issue.id}` },
                (payload) => {
                    setComments(prev => [...prev, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [issue.id, supabase])

    const isOverloaded = issue.overloaded_until ? new Date(issue.overloaded_until) > new Date() : false

    const handleSaveChanges = async () => {
        const updates: IssueUpdate = { 
            priority: editData.priority as any
        }
        if (isHeavy) {
            updates.content = { ...content, need_now: editData.need_now }
        }
        await onUpdateIssue(issue.id, updates)
        setIsEditing(false)
    }

    const handleSendComment = async () => {
        if (!newComment.trim()) return
        const { error } = await supabase
            .from('issue_comments')
            .insert({
                issue_id: issue.id,
                author_id: userId,
                content: newComment.trim()
            })
        if (!error) setNewComment('')
    }

    const handleSetOverload = async (until: string) => {
        await onUpdateIssue(issue.id, {
            overloaded_until: until,
            overload_author_id: userId,
            status: 'discussed'
        })
        setIsOverloadModalOpen(false)
    }

    const handleUpdateSchedule = async () => {
        await onUpdateIssue(issue.id, { scheduled_at: newSchedule })
        setIsRescheduling(false)

        // Add auto-comment about the change
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('issue_comments').insert({
                issue_id: issue.id,
                author_id: user.id,
                content: `Zaproponowano nowy termin: ${new Date(newSchedule).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}`
            })
        }
    }

    const handleSaveDraft = async () => {
        await onUpdateIssue(issue.id, { solution_draft: draftText })
        setIsEditingDraft(false)
    }

    const handleAnalyze = async () => {
        if (!newComment.trim() || newComment.length < 5) return
        
        setIsAnalyzing(true)
        try {
            const result = await analyzeMessage(newComment)
            if (result.suggestion) {
                setAiSuggestion(result.suggestion)
            } else {
                setAiSuggestion(null)
                // Optional: show a "Message is perfect" toast
            }
        } catch (error) {
            console.error('AI Analysis failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const applySuggestion = () => {
        if (aiSuggestion) {
            const cleanText = aiSuggestion.replace('Velvet Engine sugeruje: ', '')
            setNewComment(cleanText)
            setAiSuggestion(null)
        }
    }

    const handleSign = async (type: 'author' | 'recipient') => {
        const updates: IssueUpdate = {}
        if (type === 'author') updates.signed_by_author = !issue.signed_by_author
        else updates.signed_by_recipient = !issue.signed_by_recipient

        await onUpdateIssue(issue.id, updates)
    }

    // Auto-resolve check
    useEffect(() => {
        if (issue.signed_by_author && issue.signed_by_recipient && issue.status !== 'resolved') {
            onUpdateStatus(issue.id, 'resolved')
        }
    }, [issue.signed_by_author, issue.signed_by_recipient, issue.status, issue.id, onUpdateStatus])

    return (
        <Modal 
            isOpen={true} 
            onClose={onClose} 
            width="full" 
            title={isHeavy ? 'Dziennik Trudnych Spraw' : 'Planowana Rozmowa'}
        >
            <div className="flex flex-col gap-12">
                {/* Overload Banner */}
                {isOverloaded && (
                    <Card variant="burgundy" padding="sm" className="animate-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center justify-center gap-6 text-center py-2">
                            <OctagonAlert className="text-velvet-gold animate-pulse" size={24} />
                            <div>
                                <h3 className="text-velvet-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1">
                                    ROZMOWA ZAWIESZONA
                                </h3>
                                <p className="text-velvet-gold/60 text-[10px] font-bold uppercase tracking-widest">
                                    Partner potrzebuje oddechu. Powrót: {new Date(issue.overloaded_until!).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Content Body */}
                <div className="space-y-20">
                    {isHeavy ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-4">
                            <div className="space-y-16">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Quote size={18} />
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Fakt</h4>
                                    </div>
                                    <Card variant="glass" padding="md" className="italic text-velvet-cream text-lg leading-relaxed border-l-2 border-l-velvet-burgundy/40">
                                        {content.fact || 'Brak opisu...'}
                                    </Card>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Heart size={18} />
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Emocje</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {content.emotions?.map((e: string) => (
                                            <Badge key={e} variant="gold" size="sm" className="italic px-5 py-2">
                                                #{e}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-16">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Shield size={18} />
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Potrzeba wtedy</h4>
                                    </div>
                                    <Card variant="outline" padding="md" className="text-velvet-cream/80 leading-relaxed">
                                        {content.needs || content.need_then || 'Brak danych...'}
                                    </Card>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Wind size={18} />
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Potrzeba teraz</h4>
                                    </div>
                                    <Card variant="outline" padding="md" className="text-velvet-cream/80 leading-relaxed border-l-2 border-l-velvet-gold/20">
                                        {content.need_now || 'Brak danych...'}
                                    </Card>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 text-velvet-gold/40">
                                        <Sparkles size={18} />
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Sugestia na przyszłość</h4>
                                    </div>
                                    <Card variant="burgundy" padding="md" className="text-velvet-cream/80 leading-relaxed bg-velvet-gold/5 border-velvet-gold/10">
                                        {content.suggestions || content.future_help || 'Brak sugestii...'}
                                    </Card>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-12 text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl font-heading text-velvet-cream tracking-tight">&ldquo;{content.title}&rdquo;</h2>
                            <div className="flex flex-wrap justify-center gap-8">
                                <Card variant="glass" padding="md" className="flex flex-col items-center gap-3 min-w-[240px]">
                                    <Clock className="text-velvet-gold/40" size={24} />
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-velvet-cream/30">Planowany Termin</span>
                                    <span className="text-velvet-gold font-medium uppercase tracking-widest text-[11px]">
                                        {issue.scheduled_at ? new Date(issue.scheduled_at).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }) : 'Nie ustalono'}
                                    </span>
                                </Card>
                                <Card variant="glass" padding="md" className="flex flex-col items-center gap-3 min-w-[240px]">
                                    <VolumeX className="text-velvet-gold/40" size={24} />
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-velvet-cream/30">Atmosfera</span>
                                    <Badge variant="gold" size="sm" dot>
                                        {issue.needs_quiet_space ? 'Spokojna Przestrzeń' : 'Brak wymogów'}
                                    </Badge>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Joint Agreement Section */}
                    <section className="space-y-10 pt-10 border-t border-white/5">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-3 bg-velvet-gold/10 rounded-2xl">
                                <FileText className="text-velvet-gold" size={24} />
                            </div>
                            <div>
                                <h3 className="text-velvet-gold text-xs uppercase tracking-[0.6em] font-black">Wspólne Ustalenie</h3>
                                <p className="text-[10px] text-velvet-cream/20 uppercase tracking-widest mt-2 font-bold">Oficjalny kontrakt Waszej partnerskiej zgody</p>
                            </div>
                        </div>

                        <Card variant="dark" padding="none" className="max-w-4xl mx-auto border-velvet-gold/30 shadow-premium overflow-visible">
                            <div className="p-12 relative">
                                {isEditingDraft ? (
                                    <div className="space-y-8">
                                        <textarea
                                            value={draftText}
                                            onChange={(e) => setDraftText(e.target.value)}
                                            className="w-full bg-black/40 border border-velvet-gold/20 rounded-2xl p-8 text-velvet-cream text-lg font-light focus:outline-none focus:border-velvet-gold/50 transition-all h-60"
                                            placeholder="Opiszcie Wasze wspólne ustalenie..."
                                        />
                                        <div className="flex justify-center gap-6">
                                            <Button onClick={handleSaveDraft}>Zapisz treść</Button>
                                            <Button variant="ghost" onClick={() => setIsEditingDraft(false)}>Anuluj</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-16">
                                        <p className="text-velvet-cream text-2xl font-light leading-relaxed text-center italic px-4">
                                            {issue.solution_draft ? `„${issue.solution_draft}”` : 'Miejsce na Wasze wspólne rozwiązanie...'}
                                        </p>

                                        <div className="pt-10 flex flex-col sm:flex-row items-center justify-around gap-12">
                                            <div className="flex flex-col items-center gap-4">
                                                <button
                                                    onClick={() => !isPartner && handleSign('author')}
                                                    disabled={isPartner || isOverloaded}
                                                    className={`p-6 rounded-full transition-all duration-700 ${
                                                        issue.signed_by_author 
                                                        ? 'bg-velvet-gold text-black shadow-gold scale-110' 
                                                        : 'bg-white/5 text-white/10 border border-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    <PenTool size={32} />
                                                </button>
                                                <span className={`text-[9px] uppercase tracking-[0.4em] font-black ${issue.signed_by_author ? 'text-velvet-gold' : 'text-white/20'}`}>
                                                    Autor
                                                </span>
                                            </div>

                                            {issue.status !== 'resolved' && !isOverloaded && (
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    onClick={() => setIsEditingDraft(true)}
                                                    className="rounded-full h-12 w-12"
                                                >
                                                    <FileText size={16} />
                                                </Button>
                                            )}

                                            <div className="flex flex-col items-center gap-4">
                                                <button
                                                    onClick={() => isPartner && handleSign('recipient')}
                                                    disabled={!isPartner || isOverloaded}
                                                    className={`p-6 rounded-full transition-all duration-700 ${
                                                        issue.signed_by_recipient
                                                        ? 'bg-velvet-gold text-black shadow-gold scale-110' 
                                                        : 'bg-white/5 text-white/10 border border-white/5 hover:border-white/20'
                                                    }`}
                                                >
                                                    <PenTool size={32} />
                                                </button>
                                                <span className={`text-[9px] uppercase tracking-[0.4em] font-black ${issue.signed_by_recipient ? 'text-velvet-gold' : 'text-white/20'}`}>
                                                    Partner
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {issue.status === 'resolved' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07] rotate-[-12deg]">
                                    <div className="border-[20px] border-velvet-gold rounded-full p-20">
                                        <span className="text-7xl font-black text-velvet-gold uppercase tracking-[0.3em]">ZATWIERDZONO</span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </section>

                    {/* Chat Flow */}
                    <section className="space-y-10 pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-velvet-burgundy/10 rounded-xl">
                                <MessageSquare className="text-velvet-burgundy" size={18} />
                            </div>
                            <h3 className="text-velvet-burgundy text-xs uppercase tracking-[0.5em] font-black">Dialog Serc</h3>
                        </div>

                        <div className="space-y-8 px-4">
                            {comments.map((c) => {
                                const isMe = c.author_id === userId
                                return (
                                    <div key={c.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className={`max-w-[75%] p-6 rounded-[1.5rem] ${
                                            isMe 
                                            ? 'bg-velvet-burgundy text-white shadow-premium rounded-tr-none' 
                                            : 'bg-[#1A1F26] border border-white/5 text-velvet-cream/90 rounded-tl-none'
                                        }`}>
                                            <p className="text-sm font-light leading-relaxed">{c.content}</p>
                                            <span className={`text-[8px] opacity-30 mt-3 block uppercase tracking-widest font-black ${isMe ? 'text-white' : 'text-velvet-gold'}`}>
                                                {new Date(c.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div className="relative group px-4">
                            {/* AI Suggestion Box */}
                            {aiSuggestion && (
                                <div className="mb-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                    <div className="bg-velvet-gold/10 border border-velvet-gold/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                                        <div className="absolute top-0 right-0 p-2">
                                            <Sparkle className="text-velvet-gold/40 animate-pulse" size={14} />
                                        </div>
                                        <p className="text-velvet-gold text-xs italic font-medium leading-relaxed pr-8">
                                            {aiSuggestion}
                                        </p>
                                        <button 
                                            onClick={applySuggestion}
                                            className="mt-4 text-[9px] uppercase tracking-[0.2em] font-bold text-velvet-gold hover:text-velvet-cream transition-colors flex items-center gap-2"
                                        >
                                            <Sparkles size={10} />
                                            Zastosuj sugestię
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Analysis Trigger Button */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !newComment.trim() || isOverloaded}
                                    className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black text-velvet-gold/60 hover:text-velvet-gold transition-all disabled:opacity-20"
                                >
                                    {isAnalyzing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-velvet-gold rounded-full animate-ping" />
                                            Analizuję...
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles size={14} className="text-velvet-gold" />
                                            Analizuj przez Velvet Engine
                                        </>
                                    )}
                                </button>
                            </div>

                            <textarea
                                value={newComment}
                                onChange={(e) => {
                                    setNewComment(e.target.value)
                                    if (aiSuggestion) setAiSuggestion(null)
                                }}
                                disabled={isOverloaded}
                                placeholder={isOverloaded ? "Dialog tymczasowo zawieszony..." : "Wyraź swoje myśli..."}
                                className={`w-full bg-black/60 border ${isOverloaded ? 'border-velvet-gold/20 opacity-30' : 'border-white/10 group-hover:border-white/20'} rounded-3xl p-8 text-velvet-cream text-sm focus:outline-none focus:border-velvet-gold/30 transition-all h-32 pr-24`}
                            />
                            {!isOverloaded && (
                                <button
                                    onClick={handleSendComment}
                                    disabled={!newComment.trim()}
                                    className="absolute bottom-8 right-12 p-4 rounded-2xl bg-velvet-gold text-black hover:scale-110 active:scale-95 transition-all disabled:opacity-20 shadow-premium"
                                >
                                    <Send size={20} />
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer Controls */}
                <div className="mt-10 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] uppercase tracking-widest text-velvet-cream/20 font-bold">Postęp:</span>
                        <div className="flex gap-2">
                            {statusOrder.map((s) => (
                                <div
                                    key={s}
                                    className={`w-3 h-3 rounded-full transition-all duration-1000 ${statusOrder.indexOf(s) <= statusOrder.indexOf(issue.status)
                                            ? 'bg-velvet-gold shadow-gold'
                                            : 'bg-white/5'
                                        }`}
                                    title={s}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => setIsOverloadModalOpen(true)}
                            size="sm"
                            className="bg-white/5"
                        >
                            <OctagonAlert size={14} className="mr-2" />
                            Przeciążenie
                        </Button>

                        {isPartner ? (
                            <Button
                                onClick={() => onUpdateStatus(issue.id, 'discussed')}
                                disabled={issue.status === 'discussed' || issue.status === 'resolved' || isOverloaded}
                                variant="gold"
                            >
                                {issue.status === 'read' ? 'Rozpocznij dialog' : 'W trakcie rozmowy'}
                            </Button>
                        ) : (
                            <Badge variant="gold" size="sm" className="px-8 py-3">
                                {issue.status === 'resolved' ? 'Pomyślnie Rozwiązane' : 'Oczekiwanie na partnera'}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <OverloadModal 
                isOpen={isOverloadModalOpen}
                onClose={() => setIsOverloadModalOpen(false)}
                onConfirm={handleSetOverload}
            />
        </Modal>
    )
}

