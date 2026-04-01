'use server'

import { createClient } from '@/utils/supabase/server'
import { subDays, format } from 'date-fns'

/**
 * Pobiera skonsolidowany kontekst relacji dla modelu LLM.
 * Zawiera metryki z ostatnich 7 dni, sprawy (issues) z ostatnich 14 dni
 * oraz liczbę ukończonych aktywności w tym tygodniu.
 */
export async function getRelationshipContext() {
  const supabase = await createClient()

  // 1. Pobranie bieżącego użytkownika
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Nieautoryzowany dostęp')
  }

  // 2. Pobranie profilu i couple_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.couple_id) {
    throw new Error('Nie znaleziono powiązanej pary')
  }

  const coupleId = profile.couple_id

  // Definicja zakresów czasowych
  const now = new Date()
  const sevenDaysAgoDate = format(subDays(now, 7), 'yyyy-MM-dd')
  const sevenDaysAgoTS = subDays(now, 7).toISOString()
  const fourteenDaysAgoTS = subDays(now, 14).toISOString()

  // 3. Pobranie daily_metrics z ostatnich 7 dni
  const { data: dailyMetrics, error: metricsError } = await supabase
    .from('daily_metrics')
    .select('closeness, communication, support, intimacy, time_together, note, created_at, user_id')
    .eq('couple_id', coupleId)
    .gte('created_at', sevenDaysAgoDate)
    .order('created_at', { ascending: false })

  if (metricsError) console.error('Error fetching context metrics:', metricsError)

  // 4. Pobranie aktywnych lub ostatnio rozwiązanych (14 dni) tematów (issues)
  const { data: issues, error: issuesError } = await supabase
    .from('issues')
    .select('type, status, content, priority, created_at, updated_at')
    .eq('couple_id', coupleId)
    .or(`status.neq.resolved,updated_at.gte.${fourteenDaysAgoTS}`)
    .order('updated_at', { ascending: false })

  if (issuesError) console.error('Error fetching context issues:', issuesError)

  // 5. Pobranie liczby ukończonych activity_deck z ostatnich 7 dni
  const { count: completedActivitiesCount, error: activityError } = await supabase
    .from('activity_deck')
    .select('*', { count: 'exact', head: true })
    .eq('couple_id', coupleId)
    .eq('is_completed', true)
    .gte('completed_at', sevenDaysAgoTS)

  if (activityError) console.error('Error counting context activities:', activityError)

  // 6. Zwrócenie czystego obiektu JSON dla LLM
  return {
    couple_id: coupleId,
    generated_at: now.toISOString(),
    relationship_metrics: dailyMetrics || [],
    ongoing_and_recent_issues: issues || [],
    activities_completed_this_week: completedActivitiesCount || 0,
    summary_metadata: {
      metrics_days_count: 7,
      issues_days_count: 14,
      activities_days_count: 7
    }
  }
}
