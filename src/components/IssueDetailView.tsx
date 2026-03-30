'use client'

import {
    X,
    ShieldCheck,
    MessageSquare,
    Quote,
    Heart,
    Shield,
    Sparkles,
    Wind,
    ArrowRight,
    Clock,
    VolumeX
} from 'lucide-react'

interface Issue {
    id: string
    author_id: string
    type: 'heavy' | 'talk'
    status: 'new' | 'read' | 'discussed' | 'resolved'
    content: any
    priority?: 'red' | 'yellow' | 'green'
    scheduled_at?: string
    needs_quiet_space?: boolean
    created_at: string
}

interface IssueDetailViewProps {
    issue: Issue
    onClose: () => void
    onUpdateStatus: (id: string, status: string) => void
    isPartner: boolean
}

export default function IssueDetailView({ issue, onClose, onUpdateStatus, isPartner }: IssueDetailViewProps) {
    const isHeavy = issue.type === 'heavy'
    const statusOrder: Issue['status'][] = ['new', 'read', 'discussed', 'resolved']

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0A0E14] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-velvet-gold/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isHeavy ? 'bg-velvet-burgundy/10' : 'bg-velvet-gold/10'}`}>
                            {isHeavy ? <ShieldCheck className="text-velvet-burgundy" size={24} /> : <MessageSquare className="text-velvet-gold" size={24} />}
                        </div>
                        <div>
                            <h2 className="text-velvet-gold font-heading text-xl uppercase tracking-widest">
                                {isHeavy ? 'Dziennik Trudnych Spraw' : 'Planowana Rozmowa'}
                            </h2>
                            <p className="text-[10px] text-velvet-cream/30 uppercase tracking-[0.4em] font-bold">
                                {new Date(issue.created_at).toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-white/5 text-velvet-cream/40 hover:text-velvet-gold hover:bg-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                    {isHeavy ? (
                        <div className="space-y-12">
                            {/* Step 1: Fact */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-velvet-gold/40">
                                    <Quote size={16} />
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">Co się wydarzyło?</h4>
                                </div>
                                <p className="text-velvet-cream text-lg font-light leading-relaxed italic border-l-2 border-velvet-burgundy/20 pl-6">
                                    {issue.content.fact || 'Brak opisu...'}
                                </p>
                            </section>

                            {/* Step 2: Emotions */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-velvet-gold/40">
                                    <Heart size={16} />
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">Co poczułem/aś?</h4>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {issue.content.emotions?.map((e: string) => (
                                        <span key={e} className="px-6 py-2 rounded-xl bg-velvet-gold/5 border border-velvet-gold/20 text-velvet-gold text-xs font-medium italic">
                                            #{e}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Step 3: Need then */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-velvet-gold/40">
                                    <Shield size={16} />
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">Czego zabrakło w tamtym momencie?</h4>
                                </div>
                                <p className="text-velvet-cream/80 text-base font-light leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">
                                    {issue.content.need_then || 'Brak danych...'}
                                </p>
                            </section>

                            {/* Step 4: Future Help */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-velvet-gold/40">
                                    <Sparkles size={16} />
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">Jak partner może zareagować następnym razem?</h4>
                                </div>
                                <p className="text-velvet-cream/80 text-base font-light leading-relaxed bg-velvet-gold/5 p-6 rounded-2xl border border-velvet-gold/10">
                                    {issue.content.future_help || 'Brak sugestii...'}
                                </p>
                            </section>

                            {/* Step 5: Need now */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-velvet-gold/40">
                                    <Wind size={16} />
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">Czego potrzebuję TERAZ?</h4>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-velvet-burgundy/10 to-transparent border border-velvet-burgundy/20">
                                    <p className="text-xl text-velvet-cream font-medium text-center">
                                        &ldquo;{issue.content.need_now || 'Brak danych...'}&rdquo;
                                    </p>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <section className="text-center space-y-2">
                                <h4 className="text-[10px] text-velvet-gold uppercase tracking-[0.4em] font-black">Temat Rozmowy</h4>
                                <p className="text-3xl text-velvet-cream font-heading">{issue.content.title}</p>
                            </section>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="v-card p-6 flex flex-col items-center gap-3">
                                    <Clock className="text-velvet-gold/40" size={24} />
                                    <span className="text-[9px] uppercase tracking-widest text-velvet-cream/30">Planowany Termin</span>
                                    <span className="text-velvet-cream font-medium">
                                        {issue.scheduled_at ? new Date(issue.scheduled_at).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }) : 'Nie ustalono'}
                                    </span>
                                </div>
                                <div className="v-card p-6 flex flex-col items-center gap-3">
                                    <VolumeX className="text-velvet-gold/40" size={24} />
                                    <span className="text-[9px] uppercase tracking-widest text-velvet-cream/30">Wymagania</span>
                                    <span className="text-velvet-cream font-medium">
                                        {issue.needs_quiet_space ? 'Spokojna przestrzeń' : 'Brak specjalnych'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-velvet-cream/20">Status Cyklu:</span>
                            <div className="flex gap-2">
                                {statusOrder.map((s) => (
                                    <div
                                        key={s}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${statusOrder.indexOf(s) <= statusOrder.indexOf(issue.status)
                                                ? 'bg-velvet-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                                                : 'bg-white/5'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-xs text-velvet-gold font-bold uppercase tracking-widest italic">{issue.status}</span>
                    </div>

                    {isPartner && (
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => onUpdateStatus(issue.id, 'read')}
                                disabled={issue.status !== 'new'}
                                className={`v-button-outline py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 ${issue.status === 'new' ? 'opacity-100' : 'opacity-20 grayscale'}`}
                            >
                                <Check size={16} />
                                Przeczytane
                            </button>
                            <button
                                onClick={() => onUpdateStatus(issue.id, 'discussed')}
                                disabled={issue.status !== 'read'}
                                className={`v-button-outline py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 ${issue.status === 'read' ? 'opacity-100' : 'opacity-20 grayscale'}`}
                            >
                                <MessageSquare size={16} />
                                Omówione
                            </button>
                            <button
                                onClick={() => onUpdateStatus(issue.id, 'resolved')}
                                disabled={issue.status !== 'discussed'}
                                className={`v-button-burgundy py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 ${issue.status === 'discussed' ? 'opacity-100' : 'opacity-20 grayscale animate-pulse'}`}
                            >
                                <Sparkles size={16} />
                                Rozwiązane
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Check({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
}
