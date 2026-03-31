'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Bell, CheckCheck, MessageCircle, 
    BookOpen, Zap, Clock, ChevronRight, 
    Inbox, Trash2, Sparkles, AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications, NotificationItem } from '@/hooks/useNotifications'
import Badge from '@/components/ui/Badge'
import { useEffect } from 'react'

interface NotificationDrawerProps {
    isOpen: boolean
    onClose: () => void
    onUnreadUpdate: (count: number) => void
}

export default function NotificationDrawer({ isOpen, onClose, onUnreadUpdate }: NotificationDrawerProps) {
    const { userId } = useAuth()
    const { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(userId ?? undefined)
    const router = useRouter()

    useEffect(() => {
        onUnreadUpdate(unreadCount)
    }, [unreadCount, onUnreadUpdate])

    const handleNotificationClick = async (n: NotificationItem) => {
        if (!n.is_read) {
            await markAsRead(n.id)
        }

        if (n.link) {
            router.push(n.link)
            onClose()
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'issue': return <MessageCircle className="text-orange-400" size={18} />
            case 'diary': return <BookOpen className="text-blue-400" size={18} />
            case 'habit': return <Zap className="text-yellow-400" size={18} />
            case 'system': return <Sparkles className="text-velvet-gold" size={18} />
            default: return <Bell className="text-gray-400" size={18} />
        }
    }

    const getBadge = (type: string, is_read: boolean) => {
        if (!is_read) return <Badge variant="red" size="sm">Nowe</Badge>
        
        switch (type) {
            case 'issue': return <Badge variant="default" size="sm">Safe Space</Badge>
            case 'diary': return <Badge variant="default" size="sm">Pamiętnik</Badge>
            case 'habit': return <Badge variant="default" size="sm">Nawyk</Badge>
            default: return <Badge variant="default" size="sm">System</Badge>
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#0A0E14] border-l border-velvet-gold/10 z-[70] flex flex-col shadow-[20px_0_100px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-velvet-burgundy/5 to-transparent">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Bell className="text-velvet-gold" size={18} />
                                    <h2 className="text-xl font-heading text-white uppercase tracking-[0.2em]">Puls Relacji</h2>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-velvet-cream/40 font-black">Ostatnie powiadomienia</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
                            >
                                <X className="text-gray-500 group-hover:text-white transition-colors" size={20} />
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="px-8 py-4 bg-black/40 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-widest font-black text-gray-600">
                                {notifications.length} {notifications.length === 1 ? 'POWIADOMIENIE' : 'POWIADOMIENIA'}
                            </span>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={() => markAllAsRead()}
                                    className="text-[9px] uppercase tracking-widest font-black text-velvet-gold hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <CheckCheck size={14} /> Oznacz wszystkie jako przeczytane
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                                    <div className="w-8 h-8 rounded-full border-2 border-velvet-gold border-t-transparent animate-spin" />
                                    <span className="text-[10px] uppercase tracking-widest text-velvet-gold font-black">Synchronizacja Pulsacji...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-8 text-center px-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-velvet-gold/20 blur-3xl rounded-full animate-pulse" />
                                        <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-velvet-cream/10 relative z-10">
                                            <Inbox size={40} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-heading text-white uppercase tracking-widest">Cisza w eterze</h3>
                                        <p className="text-[11px] text-velvet-cream/30 leading-relaxed font-light italic">Nie masz jeszcze żadnych powiadomień. Spokój to dobry znak dla kondycji związku.</p>
                                    </div>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {notifications.map((n) => (
                                        <motion.div
                                            key={n.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className={`group relative p-5 rounded-2xl border transition-all duration-500 overflow-hidden ${
                                                n.is_read 
                                                ? 'bg-white/[0.01] border-white/5 hover:border-white/10 shadow-none' 
                                                : 'bg-velvet-burgundy/[0.03] border-velvet-burgundy/20 hover:border-velvet-burgundy/40 shadow-[0_10px_30px_rgba(158,43,43,0.05)]'
                                            }`}
                                        >
                                            {/* Status Dot */}
                                            {!n.is_read && (
                                                <div className="absolute top-0 right-0 p-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-velvet-burgundy animate-pulse shadow-[0_0_8px_rgba(158,43,43,0.8)]" />
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-4 items-start relative z-10" onClick={() => handleNotificationClick(n)}>
                                                <div className={`p-4 rounded-xl shrink-0 transition-all duration-500 ${
                                                    n.is_read 
                                                    ? 'bg-white/5 group-hover:bg-white/10' 
                                                    : 'bg-velvet-burgundy/10 border border-velvet-burgundy/20 group-hover:bg-velvet-burgundy/20 px-4'
                                                }`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                                                                    n.is_read ? 'text-gray-400 group-hover:text-gray-200' : 'text-velvet-gold'
                                                                }`}>
                                                                    {n.title}
                                                                </h4>
                                                                {getBadge(n.type, n.is_read)}
                                                            </div>
                                                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                                                                {n.content}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                <Clock size={8} /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: pl })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons Overlay */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 translate-x-full group-hover:translate-x-0 transition-transform duration-500">
                                               <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteNotification(n.id)
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer Tips */}
                        <div className="p-8 bg-black/60 border-t border-white/5 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <AlertCircle className="text-velvet-gold shrink-0 mt-0.5" size={14} />
                                <p className="text-[10px] text-velvet-cream/40 leading-relaxed font-medium">
                                    Wszystkie powiadomienia są szyfrowane i widoczne tylko dla Ciebie i Twojego partnera. Velvet dba o Waszą prywatność.
                                </p>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed italic text-center font-serif">
                                „Najpiękniejszym powiadomieniem jest to, które przypomina Ci o bliskości.”
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
