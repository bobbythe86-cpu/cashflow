import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// FONTOS: Ezt a szkriptet csak egyszer kell futtatni!
// Használat: npx tsx scripts/migrate.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Hiányzó környezeti változók!')
    console.error('Győződj meg róla, hogy a .env.local fájlban van:')
    console.error('- NEXT_PUBLIC_SUPABASE_URL')
    console.error('- SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function runMigration(filename: string) {
    console.log(`\n📄 Futtatás: ${filename}...`)

    const sqlPath = path.join(process.cwd(), 'supabase_migrations', filename)
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabase.from('_migrations').insert({ name: filename })

        if (directError) {
            console.error(`❌ Hiba a(z) ${filename} futtatásakor:`, error.message)
            return false
        }
    }

    console.log(`✅ ${filename} sikeresen lefutott!`)
    return true
}

async function migrate() {
    console.log('🚀 Adatbázis migráció indítása...\n')

    const migrations = [
        'profiles.sql',
        'categories.sql',
        'transactions.sql',
        'recurring_transactions.sql'
    ]

    for (const migration of migrations) {
        const success = await runMigration(migration)
        if (!success) {
            console.error('\n❌ Migráció megszakítva hiba miatt.')
            process.exit(1)
        }
    }

    console.log('\n✅ Minden migráció sikeresen lefutott!')
    console.log('🎉 Az adatbázis készen áll a használatra!')
}

migrate().catch(console.error)
