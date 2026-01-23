import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Hiányzó Supabase URL vagy Service Role Key!')
    }

    // Ez a kliens kikerüli az RLS szabályokat (admin jogkör)
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
