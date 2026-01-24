'use server'

import { createClient } from '@/lib/supabase/server'

export interface UpdateEntry {
    id: string;
    title: string;
    description: string;
    version: string;
    type: 'feature' | 'improvement' | 'fix';
    created_at: string;
}

export async function getChangelog() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching changelog:', error)
        return []
    }

    return data as UpdateEntry[]
}
