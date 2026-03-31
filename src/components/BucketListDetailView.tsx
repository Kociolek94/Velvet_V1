'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { 
    X, Edit2, Trash2, MessageSquare, Send, Calendar, CheckCircle2, Circle, Trophy,
    Plane, Sparkles, Heart, ShoppingBag, TrendingUp, Utensils, Home, Compass, 
    Link as LinkIcon, Plus as PlusIcon, ExternalLink, Camera, Loader2, HeartHandshake
} from 'lucide-react'
import NextLink from 'next/link'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { BucketListItem, BucketListComment } from '@/types/bucket-list'
import { updateBucketListItem, deleteBucketListItem, addBucketListComment } from '@/lib/actions/bucket_list'
import { uploadMedia } from '@/lib/actions/media'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface BucketListDetailViewProps {
    isOpen: boolean
    onClose: () => void
    item: BucketListItem
    userId: string
    onSuccess?: () => void
}

export default function BucketListDetailView({ isOpen, onClose, item, userId, onSuccess }: BucketListDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [ownerType, setOwnerType] = useState<'jej' | 'jego' | 'wspólne'>('wspólne')
    const [description, setDescription] = useState('')
    const [estimatedDate, setEstimatedDate] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [activityCategory, setActivityCategory] = useState('experience')
    const [budgetLevel, setBudgetLevel] = useState(1)
    const [vibe, setVibe] = useState('romance')
    const [links, setLinks] = useState<string[]>([])
    const [newLink, setNewLink] = useState('')
    const [showCongrats, setShowCongrats] = useState(false)
    
    const [comments, setComments] = useState<BucketListComment[]>([])
    const [newCommentText, setNewCommentText] = useState('')
    const [loadingComments, setLoadingComments] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    
    const commentsEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (item) {
            setTitle(item.title)
            setOwnerType(item.owner_type as any)
            setActivityCategory(item.activity_category || 'experience')
            setBudgetLevel(item.budget_level || 1)
            setVibe(item.vibe || 'romance')
            setDescription(item.description || '')
            setEstimatedDate(item.estimated_date || '')
            setIsCompleted(item.is_completed)
            setLinks(item.links || [])
            fetchComments()
        }
    }, [item, isOpen])

    useEffect(() => {
        if (isOpen && item) {
            const channel = supabase
                .channel(`bucket_comments_${item.id}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'bucket_list_comments', filter: `bucket_list_id=eq.${item.id}` },
                    (payload) => {
                        // Optimistic updates are handled by Server Actions return or we can refetch
                        fetchComments()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [isOpen, item])

    const fetchComments = async () => {
        if (!item) return
        setLoadingComments(true)
        try {
            const { data, error } = await supabase
                .from('bucket_list_comments')
                .select(`
                    *,
                    author:profiles(display_name, avatar_url)
                `)
                .eq('bucket_list_id', item.id)
                .order('created_at', { ascending: true })

            if (error) throw error
            setComments(data as BucketListComment[])
            scrollToBottom()
        } catch (err) {
            console.error('Error fetching comments:', err)
        } finally {
            setLoadingComments(false)
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleSave = async () => {
        if (!item || isSaving) return
        setIsSaving(true)
        try {
            // Check if just completed
            if (!item.is_completed && isCompleted) {
                setShowCongrats(true)
            }

            await updateBucketListItem(item.id, {
                title,
                owner_type: ownerType as any,
                activity_category: activityCategory,
                budget_level: budgetLevel,
                vibe,
                description,
                estimated_date: estimatedDate || null,
                is_completed: isCompleted,
                links
            })
            setIsEditing(false)
            onSuccess?.()
        } catch (err) {
            console.error('Error updating item:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!item || !confirm('Czy na pewno chcesz usunąć to marzenie?')) return
        try {
            await deleteBucketListItem(item.id)
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Error deleting item:', err)
        }
    }

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCommentText.trim() || !item || submittingComment) return

        setSubmittingComment(true)
        try {
            await addBucketListComment({
                bucket_list_id: item.id,
                author_id: userId,
                content: newCommentText.trim()
            })
            setNewCommentText('')
            // Realtime will trigger refetch
        } catch (err) {
            console.error('Error adding comment:', err)
        } finally {
            setSubmittingComment(false)
        }
    }

    const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !item) return

        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const result = await uploadMedia(formData)
            
            if (!result.url) throw new Error('No URL returned')

            await updateBucketListItem(item.id, { image_url: result.url })
            onSuccess?.()
        } catch (err) {
            console.error('Error updating image:', err)
        } finally {
            setIsSaving(false)
        }
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

    const ownerVariant = useMemo(() => {
        if (ownerType === 'jej') return 'red'
        if (ownerType === 'jego') return 'cream'
        return 'gold'
    }, [ownerType])

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEditing ? "Edytuj Marzenie" : item.title}
            width="xl"
        >
            <div className="flex flex-col gap-8 py-4">
                {/* Visual Header / Image */}
                <div className="relative h-64 md:h-[400px] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    {item.image_url ? (
                        <Image 
                            src={item.image_url} 
                            alt={item.title} 
                            fill 
                            className="object-cover transition-transform duration-[3s] group-hover:scale-110" 
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-velvet-dark-alt via-[#1A0505] to-velvet-dark flex items-center justify-center border border-white/5">
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <motion.div
                                animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles size={80} className="text-velvet-gold/20" />
                            </motion.div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-velvet-dark via-velvet-dark/40 to-transparent" />
                    
                    {/* Perspective / Owner Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                        <Badge variant={ownerVariant} size="sm">{ownerType}</Badge>
                        <Badge variant="default" size="sm" dot>{activityCategory}</Badge>
                    </div>

                    {/* Completion Status Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        {isCompleted ? (
                            <div className="flex items-center gap-3 bg-velvet-gold/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-velvet-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                <Trophy size={20} className="text-velvet-gold animate-bounce" />
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white">Spełnione Marzenie</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-black italic">
                                <Compass size={14} className="animate-pulse" />
                                <span>W drodze do realizacji</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 text-white transition-all"
                                title="Zmień zdjęcie"
                            >
                                <Camera size={18} />
                            </button>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="p-3 bg-velvet-gold/20 hover:bg-velvet-gold text-velvet-gold hover:text-black backdrop-blur-md rounded-2xl border border-velvet-gold/30 transition-all"
                                    title="Edytuj detale"
                                >
                                    <Edit2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleImageUpdate} className="hidden" accept="image/*" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Details / Editing */}
                    <div className="md:col-span-2 space-y-8">
                        {isEditing ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-heading text-velvet-gold outline-none focus:border-velvet-gold/30 transition-all font-bold"
                                        placeholder="Tytuł marzenia"
                                    />
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[13px] text-velvet-cream outline-none focus:border-velvet-gold/30 transition-all font-light leading-relaxed resize-none"
                                        placeholder="Opisz to marzenie..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {(['jej', 'jego', 'wspólne'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setOwnerType(type)}
                                            className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${ownerType === type
                                                ? 'bg-velvet-gold text-black border-velvet-gold'
                                                : 'bg-white/5 text-velvet-cream/30 border-white/5'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="burgundy" className="flex-1" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Zapisz zmiany'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-heading text-velvet-gold leading-tight tracking-wide">{title}</h3>
                                    {description ? (
                                        <p className="text-velvet-cream/60 text-sm italic font-light leading-relaxed">"{description}"</p>
                                    ) : (
                                        <p className="text-velvet-cream/20 text-xs uppercase tracking-widest font-black italic">Brak dodatkowego opisu</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-6 pt-4">
                                    {estimatedDate && (
                                        <div className="flex items-center gap-3 text-velvet-gold">
                                            <Calendar size={18} className="opacity-40" />
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">
                                                {format(new Date(estimatedDate), 'd MMMM yyyy', { locale: pl })}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-velvet-gold">
                                        <MessageSquare size={18} className="opacity-40" />
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">{comments.length} refleksji</span>
                                    </div>
                                </div>

                                {/* Custom Fields Display */}
                                <div className="grid grid-cols-2 gap-4 pt-4 text-[10px] uppercase tracking-widest font-black italic">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                                        <span className="text-velvet-cream/20">Budżet</span>
                                        <div className="flex gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <span key={i} className={i < budgetLevel ? 'text-velvet-gold' : 'text-white/5'}>$</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                                        <span className="text-velvet-cream/20">Vibe</span>
                                        <span className="text-velvet-gold">{vibe}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Links Section */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-velvet-gold font-black flex items-center gap-3">
                                    <LinkIcon size={14} className="opacity-40" /> Inspiracje i linki
                                </h4>
                                {isEditing && (
                                    <div className="flex gap-2 min-w-[200px]">
                                        <input 
                                            type="text" 
                                            value={newLink} 
                                            onChange={(e) => setNewLink(e.target.value)}
                                            placeholder="Dodaj link..."
                                            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-velvet-gold/30 transition-all font-bold"
                                        />
                                        <button onClick={addLink} className="p-2 bg-velvet-gold text-black rounded-xl hover:scale-105 transition-all">
                                            <PlusIcon size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {links.length > 0 ? links.map((link, i) => (
                                    <div key={i} className="group relative flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-velvet-gold/20 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-velvet-gold/5 flex items-center justify-center text-velvet-gold group-hover:scale-110 transition-transform">
                                            <ExternalLink size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="text-[8px] uppercase tracking-widest text-velvet-gold/40 font-black mb-1">Inspiracja</div>
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-velvet-cream font-bold truncate block hover:text-white transition-colors">
                                                {getDomain(link)}
                                            </a>
                                        </div>
                                        {isEditing && (
                                            <button onClick={() => removeLink(i)} className="absolute top-2 right-2 text-white/20 hover:text-red-500 transition-colors">
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                )) : (
                                    <div className="sm:col-span-2 py-8 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-velvet-cream/20">
                                        <LinkIcon size={24} className="mb-3 opacity-20" />
                                        <span className="text-[8px] uppercase tracking-widest font-black">Brak zapisanych linków</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chat / Engagement */}
                    <div className="space-y-6">
                        <div className="flex flex-col h-[500px] bg-black/20 border border-white/5 rounded-[3rem] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-velvet-gold/10 text-velvet-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                    <MessageSquare size={16} />
                                </div>
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-velvet-gold font-black">Refleksje</h4>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                                {loadingComments ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
                                        <Loader2 size={24} className="animate-spin" />
                                        <span className="text-[8px] uppercase tracking-[0.3em] font-black">Wczytywanie rozmowy...</span>
                                    </div>
                                ) : comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div 
                                            key={comment.id} 
                                            className={`flex gap-3 group animate-in slide-in-from-bottom-2 duration-300 ${
                                                comment.author_id === userId ? 'flex-row-reverse' : ''
                                            }`}
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-velvet-gold relative overflow-hidden">
                                                {comment.author?. avatar_url ? (
                                                    <Image src={comment.author.avatar_url} alt="A" fill className="object-cover" />
                                                ) : (
                                                    comment.author?.display_name?.charAt(0) || '?'
                                                )}
                                            </div>
                                            <div className={`max-w-[85%] flex flex-col ${comment.author_id === userId ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all duration-500 ${
                                                    comment.author_id === userId 
                                                    ? 'bg-velvet-gold text-black rounded-tr-none font-medium' 
                                                    : 'bg-white/5 text-velvet-cream border border-white/10 rounded-tl-none font-light'
                                                }`}>
                                                    {comment.content}
                                                </div>
                                                <span className="text-[7px] uppercase tracking-widest text-velvet-cream/20 mt-1.5 font-black italic">
                                                    {format(new Date(comment.created_at), 'HH:mm • d MMM', { locale: pl })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-20 text-center px-6">
                                        <HeartHandshake size={32} className="mb-4" />
                                        <p className="text-[9px] uppercase tracking-widest leading-relaxed font-black">Rozpocznijcie wspólną rozmowę o tym marzeniu.</p>
                                    </div>
                                )}
                                <div ref={commentsEndRef} />
                            </div>

                            <div className="p-6 bg-black/40 border-t border-white/5">
                                <form onSubmit={handleAddComment} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Dodaj refleksję..."
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-12 text-xs text-velvet-cream focus:border-velvet-gold/30 outline-none transition-all placeholder:text-velvet-cream/10 font-bold"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newCommentText.trim() || submittingComment}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-velvet-gold hover:scale-110 disabled:opacity-20 transition-all"
                                    >
                                        {submittingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {!isEditing && (
                            <button 
                                onClick={handleDelete}
                                className="w-full py-4 flex items-center justify-center gap-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/5 rounded-3xl transition-all text-[9px] uppercase tracking-[0.4em] font-black italic"
                            >
                                <Trash2 size={14} /> Usuń z tablicy marzeń
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Congratulations Overlay */}
            {showCongrats && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-1000">
                    <div className="flex flex-col items-center text-center space-y-12 animate-in zoom-in-95 duration-1000 delay-300 transform scale-110">
                        <div className="relative">
                            <div className="absolute inset-0 bg-velvet-gold blur-[6rem] opacity-30 animate-pulse" />
                            <Trophy size={100} className="text-velvet-gold animate-bounce" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-5xl font-heading text-white uppercase tracking-[0.3em] leading-tight">Legenda Zapisana</h2>
                            <p className="text-velvet-gold/60 text-[11px] uppercase tracking-[0.3em] max-w-sm font-black italic leading-loose">
                                Kolejne wspólne marzenie stało się rzeczywistością. Celebrujcie tę chwilę i zachowajcie jej magię w Kronice.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-6 w-full max-w-sm">
                            <NextLink 
                                href={`/dashboard/diary?from=bucket_list&title=${encodeURIComponent(title)}`}
                                className="v-button-burgundy w-full h-20 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <Sparkles size={24} className="text-velvet-gold animate-pulse" />
                                    <span className="uppercase tracking-[0.3em] font-black">Utwórz wspomnienie</span>
                                </div>
                            </NextLink>
                            <button 
                                onClick={() => setShowCongrats(false)}
                                className="text-[10px] uppercase tracking-[0.5em] text-velvet-cream/30 hover:text-white transition-colors py-4 font-black italic"
                            >
                                Powiedz mi to później
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}
