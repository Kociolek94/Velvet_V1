import { createClient } from '@/utils/supabase/client'
import { startOfDay, subDays, differenceInHours } from 'date-fns'

export interface DashboardStats {
    syncPercentage: number
    perceptionGaps: { category: string; gap: number }[]
    activeTopics: number
    deescalationTime: number // in hours
    activityScore: number
    nearestGoal: string | null
    insight: string
    trends: { [key: string]: number[] } // 7-day trend arrays
}

export async function getDashboardStats(coupleId: string, userId: string): Promise<DashboardStats> {
    const supabase = createClient()
    const sevenDaysAgo = subDays(new Date(), 7)
    const dateStr = sevenDaysAgo.toISOString()

    // 1. Fetch Metrics (Perception Gap & Sync)
    const { data: metrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('couple_id', coupleId)
        .gte('created_at', startOfDay(sevenDaysAgo).toISOString())

    const categories = ['closeness', 'communication', 'support', 'intimacy', 'time_together']
    const catNames: { [key: string]: string } = {
        closeness: 'Bliskość',
        communication: 'Komunikacja',
        support: 'Wsparcie',
        intimacy: 'Intymność',
        time_together: 'Czas'
    }

    const gaps: { category: string; gap: number }[] = []
    const trends: { [key: string]: number[] } = {}
    
    let totalGap = 0
    categories.forEach(cat => {
        const myVals = metrics?.filter(m => m.user_id === userId).map(m => m[cat as keyof typeof m] as number) || []
        const partnerVals = metrics?.filter(m => m.user_id !== userId).map(m => m[cat as keyof typeof m] as number) || []

        const myAvg = myVals.length ? myVals.reduce((a, b) => a + b, 0) / myVals.length : 5
        const partnerAvg = partnerVals.length ? partnerVals.reduce((a, b) => a + b, 0) / partnerVals.length : 5
        
        const gap = Math.abs(myAvg - partnerAvg)
        gaps.push({ category: catNames[cat], gap })
        totalGap += gap
        
        // Trend for the current user
        trends[cat] = myVals.slice(-7)
    })

    const syncPercentage = Math.max(0, 100 - (totalGap / categories.length) * 10)

    // 2. Fetch Issues (Active Topics & Velocity)
    const { data: issues } = await supabase
        .from('issues')
        .select('created_at, updated_at, status')
        .eq('couple_id', coupleId)
        .gte('created_at', dateStr)

    const activeTopics = issues?.filter(i => i.status !== 'resolved').length || 0
    const resolvedIssues = issues?.filter(i => i.status === 'resolved') || []
    
    const totalHours = resolvedIssues.reduce((sum, i) => {
        return sum + differenceInHours(new Date(i.updated_at), new Date(i.created_at))
    }, 0)
    const deescalationTime = resolvedIssues.length ? Math.round(totalHours / resolvedIssues.length) : 0

    // 3. Fetch Activity Score
    const { data: activities } = await supabase
        .from('activity_deck')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('is_completed', true)
        .gte('completed_at', dateStr)

    const activityScore = activities?.length || 0

    // 4. Fetch Nearest Goal (Bucket List)
    const { data: bucketList } = await supabase
        .from('bucket_list')
        .select('title')
        .eq('couple_id', coupleId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    // 5. Generate Logic-based Insight
    let insight = "Wasza harmonia jest na dobrym poziomie. Pamiętajcie o codziennych małych gestach."
    if (syncPercentage < 70) {
        const topGap = gaps.sort((a,b) => b.gap - a.gap)[0]
        insight = `Zauważyłem rozbieżność w obszarze: ${topGap.category}. Warto o tym szczerze porozmawiać.`
    } else if (activityScore === 0) {
        insight = "W tym tygodniu nie zrealizowaliście żadnej wspólnej aktywności. Może wylosujecie coś z Talii?"
    } else if (activeTopics > 2) {
        insight = "Macie kilka otwartych tematów w Safe Space. Skupcie się na ich wspólnym rozwiązaniu."
    }

    return {
        syncPercentage: Math.round(syncPercentage),
        perceptionGaps: gaps,
        activeTopics,
        deescalationTime,
        activityScore,
        nearestGoal: bucketList?.title || 'Brak aktywnych celów',
        insight,
        trends
    }
}
