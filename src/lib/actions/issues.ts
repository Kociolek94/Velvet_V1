'use server'

import { createClient } from '../../utils/supabase/server'
import { IssueInsert, IssueUpdate, IssueStatus } from '@/types/issue'

export async function getIssues(coupleId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function updateIssue(issueId: string, updates: IssueUpdate) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('issues')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', issueId)

    if (error) throw error
}

export async function updateIssueStatus(issueId: string, status: IssueStatus) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId)

    if (error) throw error
}
