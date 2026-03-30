'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import DashboardLayout from "@/components/DashboardLayout"
import HabitItem from "@/components/HabitItem"
import AddHabitModal from "@/components/AddHabitModal"
import { Activity, Plus, Flame } from "lucide-react"

interface Habit {
    id: string
    title: string
    created_at: string
}

interface HabitLog {
    habit_id: string
    user_id: string
    completed_at_date: string
}

interface HabitWithData extends Habit {
    streak: number
    isCompletedMe: boolean
    isCompletedPartner: boolean
}

export default function TrackerPage() {
    const [habits, setHabits] = useState<HabitWithData[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const [partnerId, setPartnerId] = useState<string | null>(null)
    const [partnerName, setPartnerName] = useState('Partner')
    const [coupleId, setCoupleId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const supabase = createClient()

    const calculateStreak = (habitId: string, logs: HabitLog[], uid: string, pid: string | null) => {
        if (!pid) return 0

        const habitLogs = logs.filter(l => l.habit_id === habitId)
        const dateMap: Record<string, { me: boolean, partner: boolean }> = {}

        habitLogs.forEach(log => {
            if (!dateMap[log.completed_at_date]) {
                dateMap[log.completed_at_date] = { me: false, partner: false }
            }
            if (log.user_id === uid) dateMap[log.completed_at_date].me = true
            if (log.user_id === pid) dateMap[log.completed_at_date].partner = true
        })

        let streak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let currentIter = new Date(today)

        // Check backwards
        while (true) {
            const dateStr = currentIter.toISOString().split('T')[0]
            const dayData = dateMap[dateStr]

            if (dayData?.me && dayData?.partner) {
                streak++
            } else {
                // If it's today and not both finished, we check if they finished yesterday to continue the streak
                if (dateStr === today.toISOString().split('T')[0]) {
                    // Carry on to yesterday
                } else {
                    break
                }
            }
            currentIter.setDate(currentIter.getDate() - 1)

            // Safety break
            if (streak > 365) break
        }

        return streak
    }

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        const { data: profile } = await supabase
            .from('profiles')
            .select('couple_id')
            .eq('id', user.id)
            .single()

        if (!profile?.couple_id) {
            setLoading(false)
            return
        }
        setCoupleId(profile.couple_id)

        // Get partner data
        const { data: partners } = await supabase
            .from('profiles')
            .select('id, display_name')
            .eq('couple_id', profile.couple_id)
            .neq('id', user.id)
            .limit(1)

        const pid = partners?.[0]?.id || null
        setPartnerId(pid)
        setPartnerName(partners?.[0]?.display_name || 'Partner')

        // Fetch habits
        const { data: habitsData } = await supabase
            .from('habits')
            .select('*')
            .eq('couple_id', profile.couple_id)
            .order('created_at', { ascending: true })

        // Fetch all logs to calculate streaks
        const { data: logsData } = await supabase
            .from('habit_logs')
            .select('habit_id, user_id, completed_at_date')
            .in('habit_id', (habitsData || []).map(h => h.id))

        const todayStr = new Date().toISOString().split('T')[0]

        const richHabits = (habitsData || []).map(h => ({
            ...h,
            streak: calculateStreak(h.id, logsData || [], user.id, pid),
            isCompletedMe: (logsData || []).some(l => l.habit_id === h.id && l.user_id === user.id && l.completed_at_date === todayStr),
            isCompletedPartner: pid ? (logsData || []).some(l => l.habit_id === h.id && l.user_id === pid && l.completed_at_date === todayStr) : false
        }))

        setHabits(richHabits)
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchData()

        // Realtime subscription for logs
        const channel = supabase
            .channel('habit_logs_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'habit_logs' },
                () => {
                    fetchData() // Refresh everything on any log change
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'habits' },
                () => {
                    fetchData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchData, supabase])

    const handleToggleHabit = async (habitId: string, completed: boolean) => {
        if (!userId) return

        const todayStr = new Date().toISOString().split('T')[0]

        if (completed) {
            await supabase
                .from('habit_logs')
                .insert([{
                    habit_id: habitId,
                    user_id: userId,
                    completed_at_date: todayStr
                }])
        } else {
            await supabase
                .from('habit_logs')
                .delete()
                .eq('habit_id', habitId)
                .eq('user_id', userId)
                .eq('completed_at_date', todayStr)
        }
    }

    const handleAddHabit = async (title: string) => {
        if (!coupleId || !userId) return

        await supabase
            .from('habits')
            .insert([{
                title,
                couple_id: coupleId,
                created_by: userId
            }])
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-velvet-gold animate-pulse" size={24} />
                            <h1 className="text-3xl font-heading text-velvet-gold uppercase tracking-[0.2em]">Śledzik Nawyków</h1>
                        </div>
                        <p className="text-gray-500 text-sm tracking-wide">
                            Metodologia 12WY Lite: Budujcie trwałe rutyny każdego dnia.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="v-button-burgundy self-start md:self-center"
                    >
                        <Plus size={20} />
                        Nowy Nawyk
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-velvet-dark-alt/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Aktywne Nawyki</span>
                        <span className="text-2xl font-heading text-velvet-gold">{habits.length}</span>
                    </div>
                    <div className="bg-velvet-dark-alt/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Dzisiejszy Postęp</span>
                        <span className="text-2xl font-heading text-velvet-gold">
                            {Math.round((habits.filter(h => h.isCompletedMe && h.isCompletedPartner).length / (habits.length || 1)) * 100)}%
                        </span>
                    </div>
                    <div className="bg-velvet-dark-alt/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Najlepszy Streak</span>
                        <div className="flex items-center gap-2">
                            <Flame size={20} className="text-orange-500" fill="currentColor" />
                            <span className="text-2xl font-heading text-orange-500">
                                {Math.max(0, ...habits.map(h => h.streak))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Habits List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-2 border-velvet-gold/20 border-t-velvet-gold rounded-full animate-spin mb-4" />
                        <p className="text-velvet-gold/50 text-[10px] uppercase tracking-widest font-bold">Wczytywanie postępów...</p>
                    </div>
                ) : habits.length > 0 ? (
                    <div className="animate-fade-in">
                        {habits.map(habit => (
                            <HabitItem
                                key={habit.id}
                                id={habit.id}
                                title={habit.title}
                                streak={habit.streak}
                                isCompletedMe={habit.isCompletedMe}
                                isCompletedPartner={habit.isCompletedPartner}
                                onToggle={handleToggleHabit}
                                partnerName={partnerName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="v-card p-12 flex flex-col items-center justify-center text-center opacity-80 border-dashed border-velvet-gold/20">
                        <Activity className="text-velvet-gold/30 mb-4" size={48} />
                        <h2 className="text-lg font-heading text-velvet-gold/60 uppercase tracking-widest mb-2">Brak nawyków</h2>
                        <p className="text-gray-600 text-sm max-w-xs mb-8">Zdefinujcie pierwsze wspólne rutyny, które chcecie śledzić.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="v-button-outline-gold"
                        >
                            Dodaj pierwszy nawyk
                        </button>
                    </div>
                )}
            </div>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddHabit}
            />
        </DashboardLayout>
    )
}
