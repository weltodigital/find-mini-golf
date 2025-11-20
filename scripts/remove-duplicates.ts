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

async function removeDuplicates() {
  try {
    console.log('🔍 Finding and removing duplicate venues...\n')

    // Get all venues
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .order('name')

    if (error) throw error

    console.log(`Found ${venues?.length || 0} total venues`)

    // Group by name (case insensitive) and address
    const groups = (venues || []).reduce((acc, venue) => {
      const key = `${venue.name.toLowerCase().trim()}|${venue.address.toLowerCase().trim()}`
      if (!acc[key]) acc[key] = []
      acc[key].push(venue)
      return acc
    }, {} as Record<string, any[]>)

    // Find duplicates and prepare for deletion
    const toDelete: string[] = []
    const duplicateGroups = Object.entries(groups).filter(([key, venues]) => venues.length > 1)

    console.log(`Found ${duplicateGroups.length} venue groups with duplicates\n`)

    duplicateGroups.forEach(([key, venueGroup]) => {
      // Keep the first one, delete the rest
      const [nameAddr] = key.split('|')
      console.log(`"${venueGroup[0].name}" - keeping 1, removing ${venueGroup.length - 1} duplicates`)

      // Sort by created date if available, otherwise by ID, and keep the first one
      venueGroup.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }
        return a.id.localeCompare(b.id)
      })

      // Add all but the first to deletion list
      venueGroup.slice(1).forEach(venue => {
        toDelete.push(venue.id)
      })
    })

    console.log(`\n📊 Summary:`)
    console.log(`  • ${venues?.length || 0} total venues`)
    console.log(`  • ${toDelete.length} duplicates to remove`)
    console.log(`  • ${(venues?.length || 0) - toDelete.length} unique venues will remain\n`)

    if (toDelete.length === 0) {
      console.log('✅ No duplicates found!')
      return
    }

    // Delete duplicates in batches
    console.log('🗑️  Removing duplicates...')
    const batchSize = 50
    let deleted = 0

    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = toDelete.slice(i, i + batchSize)

      const { error: deleteError } = await supabase
        .from('venues')
        .delete()
        .in('id', batch)

      if (deleteError) {
        console.error(`❌ Error deleting batch ${Math.floor(i/batchSize) + 1}:`, deleteError)
        continue
      }

      deleted += batch.length
      console.log(`  ✅ Deleted batch ${Math.floor(i/batchSize) + 1} - ${deleted}/${toDelete.length} total`)
    }

    console.log(`\n🎉 Cleanup complete!`)
    console.log(`  • Removed ${deleted} duplicate venues`)
    console.log(`  • ${(venues?.length || 0) - deleted} unique venues remain`)

    // Verify final count
    const { count: finalCount } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true })

    console.log(`  • Database now contains ${finalCount} venues`)

  } catch (error) {
    console.error('❌ Error removing duplicates:', error)
  }
}

// Run if called directly
if (require.main === module) {
  removeDuplicates()
}

export { removeDuplicates }