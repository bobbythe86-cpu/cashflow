'use server'

import { createClient } from '@/lib/supabase/server'
import { Milestone, UserMilestone, MilestoneWithProgress } from '@/types'

export async function getMilestones(): Promise<MilestoneWithProgress[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Fetch all system milestones
    const { data: milestones, error: milestonesError } = await supabase
        .from('milestones')
        .select('*')
        .order('target_value', { ascending: true })

    if (milestonesError || !milestones) {
        console.error('Error fetching milestones:', milestonesError)
        return []
    }

    // 2. Fetch user progress
    const { data: userProgress, error: progressError } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', user.id)

    if (progressError) {
        console.error('Error fetching user milestones:', progressError)
        return []
    }

    // 3. Merge data
    const combined: MilestoneWithProgress[] = milestones.map((m: Milestone) => {
        const progressEntry = userProgress?.find((up: UserMilestone) => up.milestone_id === m.id)
        return {
            ...m,
            progress: progressEntry ? progressEntry.current_value : 0,
            is_achieved: progressEntry ? progressEntry.is_achieved : false,
            achieved_at: progressEntry ? progressEntry.achieved_at : null
        }
    })

    return combined
}

/**
 * Updates the progress of a specific milestone for a user.
 * 
 * @param userId - The ID of the user
 * @param milestoneCode - The unique code of the milestone (e.g. 'first_transaction')
 * @param incrementBy - How much to increment the progress by (default 1)
 */
export async function updateMilestoneProgress(userId: string, milestoneCode: string, incrementBy: number = 1) {
    const supabase = createClient()

    // 1. Get milestone details
    const { data: milestone, error: milestoneError } = await supabase
        .from('milestones')
        .select('id, target_value')
        .eq('code', milestoneCode)
        .single()

    if (milestoneError || !milestone) {
        // console.error('Milestone not found:', milestoneCode)
        return
    }

    // 2. Get current progress
    const { data: currentProgress } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', userId)
        .eq('milestone_id', milestone.id)
        .maybeSingle()

    let newCurrentValue = incrementBy
    if (currentProgress) {
        newCurrentValue = (currentProgress.current_value || 0) + incrementBy
    }

    // Pofonegyszerű logika: ha elértük a célt, achieved = true
    // De ha már achieved volt, nem bántjuk a dátumot
    const isAchieved = newCurrentValue >= milestone.target_value
    const achievedAt = isAchieved && (!currentProgress || !currentProgress.is_achieved)
        ? new Date().toISOString()
        : (currentProgress?.achieved_at || null)

    // 3. Upsert progress
    const { error: upsertError } = await supabase
        .from('user_milestones')
        .upsert({
            user_id: userId,
            milestone_id: milestone.id,
            current_value: newCurrentValue,
            is_achieved: isAchieved,
            achieved_at: achievedAt,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, milestone_id'
        })

    if (upsertError) {
        console.error('Error updating milestone progress:', upsertError)
    }
}
