import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addSlugColumn() {
  try {
    console.log('Adding slug column to venues table...')

    // Add slug column with SQL command
    const { data, error } = await supabase
      .rpc('sql', {
        query: 'ALTER TABLE venues ADD COLUMN IF NOT EXISTS slug TEXT;'
      })

    if (error) {
      console.log('Trying alternative approach...')
      // Try using the SQL editor approach
      const { error: sqlError } = await supabase
        .from('venues')
        .select('id')
        .limit(1) // Just to test the connection

      if (sqlError) throw sqlError

      console.log('✅ Column likely already exists or needs to be added via Supabase dashboard')
      console.log('Please add the slug column manually in Supabase if not present')
    } else {
      console.log('✅ Successfully added slug column to venues table')
    }

  } catch (error) {
    console.error('❌ Error adding slug column:', error)
    console.log('\nPlease add the slug column manually in Supabase:')
    console.log('ALTER TABLE venues ADD COLUMN IF NOT EXISTS slug TEXT;')
  }
}

// Run if called directly
if (require.main === module) {
  addSlugColumn()
}

export { addSlugColumn }