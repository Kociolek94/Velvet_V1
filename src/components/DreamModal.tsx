'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { 
    X, Edit2, Trash2, MessageSquare, Send, Calendar, CheckCircle2, Circle, Trophy,
    Plane, Sparkles, Heart, ShoppingBag, TrendingUp, Utensils, Home, Compass, 
    Link as LinkIcon, Plus as PlusIcon, ExternalLink 
} from 'lucide-react'
import NextLink from 'next/link'

interface Comment {
    id: string
    author_id: string
    content: string
    created_at: string
    author: {
        display_name: string
        avatar_url: string
    }
}

interface DreamModalProps {
    isOpen: boolean
    onClose: () => void
    dream: any // BucketListItem
    onUpdate: (id: string, updates: any) => Promise<void>
    onDelete?: (id: string) => Promise<void>
}

export default function DreamModal({ isOpen, onClose, dream, onUpdate, onDelete }: DreamModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('wspólne')
    const [description, setDescription] = useState('')
    const [estimatedDate, setEstimatedDate] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [activityCategory, setActivityCategory] = useState('experience')
    const [budgetLevel, setBudgetLevel] = useState(1)
    const [vibe, setVibe] = useState('romance')
    const [links, setLinks] = useState<string[]>([])
    const [newLink, setNewLink] = useState('')
    const [showCongrats, setShowCongrats] = useState(false)
    
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loadingComments, setLoadingComments] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)
    
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const commentsEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (dream) {
            setTitle(dream.title)
            setCategory(dream.owner_type)
            setActivityCategory(dream.activity_category || 'experience')
            setBudgetLevel(dream.budget_level || 1)
            setVibe(dream.vibe || 'romance')
            setDescription(dream.description || '')
            setEstimatedDate(dream.estimated_date || '')
            setIsCompleted(dream.is_completed)
            setLinks(dream.links || [])
            fetchComments()
        }
        
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUserId(user?.id || null)
        }
        getUser()
    }, [dream, isOpen])

    useEffect(() => {
        if (isOpen && dream) {
            const channel = supabase
                .channel(`dream_comments_${dream.id}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'bucket_list_comments', filter: `bucket_list_id=eq.${dream.id}` },
                    () => fetchComments()
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [isOpen, dream])

    const fetchComments = async () => {
        if (!dream) return
        setLoadingComments(true)
        const { data, error } = await supabase
            .from('bucket_list_comments')
            .select(`
                *,
                author:profiles(display_name, avatar_url)
            `)
            .eq('bucket_list_id', dream.id)
            .order('created_at', { ascending: true })

        if (error) console.error('Error fetching comments:', error)
        else setComments(data as any[])
        setLoadingComments(false)
        scrollToBottom()
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleSave = async () => {
        if (!dream) return
        
        // Check if just completed
        if (!dream.is_completed && isCompleted) {
            setShowCongrats(true)
        }

        await onUpdate(dream.id, {
            title,
            owner_type: category,
            activity_category: activityCategory,
            budget_level: budgetLevel,
            vibe,
            description,
            estimated_date: estimatedDate || null,
            is_completed: isCompleted,
            links
        })
        setIsEditing(false)
    }

    const addLink = () => {
        if (!newLink.trim()) return
        let url = newLink.trim()
        if (!url.startsWith('http')) url = 'https://' + url
        setLinks([...links, url])
        setNewLink('')
    }

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index))
    }

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !dream || !currentUserId) return

        setSubmittingComment(true)
        const { error } = await supabase
            .from('bucket_list_comments')
            .insert([{
                bucket_list_id: dream.id,
                author_id: currentUserId,
                content: newComment.trim()
            }])

        if (error) {
            console.error('Error adding comment:', error)
        } else {
            setNewComment('')
            fetchComments()
        }
        setSubmittingComment(false)
    }

    if (!isOpen || !dream) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-velvet-dark-alt border border-velvet-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            category === 'jej' ? 'bg-pink-900/30 text-pink-200 border-pink-500/30' :
                            category === 'jego' ? 'bg-blue-900/30 text-blue-200 border-blue-500/30' :
                            'bg-velvet-gold/10 text-velvet-gold border-velvet-gold/30'
                        }`}>
                            {category}
                        </span>
                        {isCompleted && (
                            <span className="flex items-center gap-1.5 bg-velvet-gold/10 px-3 py-1 rounded-full text-velvet-gold text-[10px] font-black uppercase tracking-widest border border-velvet-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                <Trophy size={12} className="animate-bounce" /> Zrealizowane
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-gray-500 hover:text-velvet-gold transition-colors"
                                title="Edytuj"
                            >
                                <Edit2 size={18} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Tytuł Marzenia</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Kategoria</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['jej', 'jego', 'wspólne'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${category === cat
                                                ? 'bg-velvet-gold text-black border-velvet-gold'
                                                : 'bg-black/20 text-gray-500 border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Kategoria</label>
                                    <select 
                                        value={activityCategory}
                                        onChange={(e) => setActivityCategory(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-velvet-gold/50 outline-none transition-all appearance-none"
                                    >
                                        <option value="travel">Podróże</option>
                                        <option value="experience">Przeżycia</option>
                                        <option value="intimacy">Bliskość</option>
                                        <option value="material">Rzeczy</option>
                                        <option value="growth">Rozwój</option>
                                        <option value="food">Smaki</option>
                                        <option value="home">Dom</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Vibe</label>
                                    <select 
                                        value={vibe}
                                        onChange={(e) => setVibe(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-velvet-gold/50 outline-none transition-all appearance-none"
                                    >
                                        <option value="relax">Relaks</option>
                                        <option value="romance">Romans</option>
                                        <option value="adrenaline">Adrenalina</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Budżet (1-4)</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setBudgetLevel(num)}
                                            className={`flex-1 h-9 rounded-lg border text-[13px] font-bold transition-all ${budgetLevel >= num
                                                ? 'bg-velvet-gold/20 text-velvet-gold border-velvet-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                                                : 'bg-black/20 text-gray-700 border-white/5'
                                            }`}
                                        >
                                            $
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Opis</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Links Management during Editing */}
                            <div className="pt-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Inspiracje i Linki</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        type="text"
                                        placeholder="Wklej URL (np. airbnb, maps, blog)"
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-velvet-gold/50 outline-none transition-all"
                                    />
                                    <button 
                                        type="button"
                                        onClick={addLink}
                                        className="px-4 bg-velvet-gold text-black rounded-xl hover:bg-velvet-gold/80 transition-all font-bold text-xs"
                                    >
                                        <PlusIcon size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {links.map((link, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                            <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{getDomain(link)}</span>
                                            <button onClick={() => removeLink(i)} className="text-red-500/50 hover:text-red-500">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-velvet-gold/60 mb-2 font-bold">Harmonogram</label>
                                    <input
                                        type="date"
                                        value={estimatedDate}
                                        onChange={(e) => setEstimatedDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-velvet-gold/50 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button 
                                        onClick={() => setIsCompleted(!isCompleted)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                            isCompleted ? 'bg-velvet-gold/20 border-velvet-gold text-velvet-gold' : 'bg-black/20 border-white/10 text-gray-500'
                                        }`}
                                    >
                                        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Zrealizowane</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={handleSave}
                                    className="v-button-gold flex-1"
                                >
                                    Zapisz Zmiany
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Details View */}
                            <div>
                                <h2 className="text-3xl font-heading text-velvet-gold mb-4 tracking-wide">{title}</h2>
                                {description && (
                                    <p className="text-gray-300 leading-relaxed italic mb-6">
                                        "{description}"
                                    </p>
                                )}
                                
                                <div className="flex flex-wrap gap-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {estimatedDate && (
                                        <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                                            <Calendar size={14} className="text-velvet-gold/50" />
                                            <span>{format(new Date(estimatedDate), 'd MMMM yyyy', { locale: pl })}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                                        <MessageSquare size={14} className="text-velvet-gold/50" />
                                        <span>{comments.length} komentarzy</span>
                                    </div>
                                </div>

                                {/* Notes and Links Preview Section */}
                                {links.length > 0 && (
                                    <div className="mt-10">
                                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-velvet-gold/40 mb-4 flex items-center gap-2 font-black">
                                            <LinkIcon size={12} /> Nasze notatki i linki
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {links.map((link, i) => (
                                                <a 
                                                    key={i} 
                                                    href={link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group/link flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-4 hover:border-velvet-gold/30 hover:bg-black/40 transition-all shadow-lg overflow-hidden relative"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-velvet-gold/5 flex items-center justify-center text-velvet-gold group-hover/link:scale-110 transition-transform flex-shrink-0">
                                                        <ExternalLink size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] uppercase tracking-widest text-velvet-gold font-black opacity-40 mb-1">Link Inspiracji</div>
                                                        <div className="text-xs text-gray-300 font-bold truncate group-hover/link:text-white">{getDomain(link)}</div>
                                                    </div>
                                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/link:opacity-100 transition-opacity">
                                                        <Sparkles size={10} className="text-velvet-gold" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-velvet-gold/40 mb-6 flex items-center gap-2">
                                    <MessageSquare size={12} /> Rozmowa o tym marzeniu
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div 
                                                key={comment.id} 
                                                className={`flex gap-3 group animate-in slide-in-from-left-2 duration-300 ${
                                                    comment.author_id === currentUserId ? 'flex-row-reverse' : ''
                                                }`}
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center text-[10px] font-bold text-velvet-gold">
                                                    {comment.author.display_name?.charAt(0) || '?'}
                                                </div>
                                                <div className={`max-w-[80%] ${comment.author_id === currentUserId ? 'items-end' : ''}`}>
                                                    <div className={`px-4 py-2 rounded-2xl text-sm ${
                                                        comment.author_id === currentUserId 
                                                        ? 'bg-velvet-gold text-black rounded-tr-none' 
                                                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                                                    }`}>
                                                        {comment.content}
                                                    </div>
                                                    <span className="text-[8px] uppercase tracking-tighter text-gray-600 mt-1 block px-1">
                                                        {format(new Date(comment.created_at), 'HH:mm, d MMM', { locale: pl })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 opacity-30">
                                            <MessageSquare size={32} className="mx-auto mb-2" />
                                            <p className="text-[10px] uppercase tracking-widest font-bold">Brak komentarzy. Napisz coś!</p>
                                        </div>
                                    )}
                                    <div ref={commentsEndRef} />
                                </div>

                                {/* Add Comment Input */}
                                <form onSubmit={handleAddComment} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Napisz coś partnerowi..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm text-white focus:border-velvet-gold/50 outline-none transition-all"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newComment.trim() || submittingComment}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-velvet-gold hover:scale-110 disabled:opacity-30 disabled:scale-100 transition-all"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {!isEditing && onDelete && (
                    <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end">
                        <button 
                            onClick={() => {
                                if (confirm('Czy na pewno chcesz usunąć to marzenie?')) {
                                    onDelete(dream.id)
                                }
                            }}
                            className="flex items-center gap-2 text-red-500/50 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            <Trash2 size={12} /> Usuń Marzenie
                        </button>
                    </div>
                )}
            </div>

            {/* Congratulations Modal */}
            {showCongrats && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-burgundy-950/90 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-700 delay-200">
                        <div className="relative">
                            <div className="absolute inset-0 bg-velvet-gold blur-3xl opacity-20 animate-pulse" />
                            <Trophy size={80} className="text-velvet-gold animate-bounce" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-heading text-white uppercase tracking-widest">Gratulacje!</h2>
                            <p className="text-velvet-gold/80 text-sm max-w-xs font-light leading-relaxed">
                                Kolejne wspólne marzenie stało się rzeczywistością. Celebrujcie tę chwilę i zachowajcie jej magię.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <NextLink 
                                href={`/dashboard/diary?from=bucket_list&title=${encodeURIComponent(dream.title)}`}
                                className="v-button-gold w-full flex items-center justify-center gap-3 group"
                            >
                                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                <span>Stwórz wpis w Pamiętniku</span>
                            </NextLink>
                            <button 
                                onClick={() => setShowCongrats(false)}
                                className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors py-2"
                            >
                                Powiedz mi to później
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
