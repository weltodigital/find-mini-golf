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

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate venues...\n')

    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, address, region')
      .order('name')

    if (error) throw error

    // Group by name (case insensitive)
    const nameGroups = (venues || []).reduce((acc, venue) => {
      const key = venue.name.toLowerCase().trim()
      if (!acc[key]) acc[key] = []
      acc[key].push(venue)
      return acc
    }, {} as Record<string, any[]>)

    // Find duplicates
    const duplicates = Object.entries(nameGroups)
      .filter(([name, venues]) => venues.length > 1)
      .sort(([,a], [,b]) => b.length - a.length)

    console.log(`Found ${duplicates.length} venue names with duplicates:\n`)

    duplicates.slice(0, 15).forEach(([name, venues]) => {
      console.log(`"${venues[0].name}" (${venues.length} entries):`)
      venues.forEach(v => {
        console.log(`  - ID: ${v.id.slice(0,8)}... | Region: ${v.region} | Address: ${v.address.slice(0, 50)}...`)
      })
      console.log('')
    })

    const totalDuplicates = duplicates.reduce((sum, [,venues]) => sum + venues.length - 1, 0)
    console.log(`\n📊 Summary:`)
    console.log(`  • ${venues?.length || 0} total venues`)
    console.log(`  • ${duplicates.length} venue names with duplicates`)
    console.log(`  • ${totalDuplicates} duplicate entries to remove`)
    console.log(`  • ${(venues?.length || 0) - totalDuplicates} unique venues after cleanup`)

  } catch (error) {
    console.error('Error checking duplicates:', error)
  }
}

// Run if called directly
if (require.main === module) {
  checkDuplicates()
}

export { checkDuplicates }