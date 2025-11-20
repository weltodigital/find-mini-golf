import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function removeOtherRegion() {
  try {
    console.log('🗑️ Removing "Other" region from database...\n')

    // First verify no venues are assigned to "Other"
    const { data: otherVenues, count } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .eq('region', 'Other')

    console.log(`Venues in "Other" category: ${count}`)

    if (count && count > 0) {
      console.log('❌ Cannot remove "Other" region - venues still assigned:')
      otherVenues?.forEach(venue => {
        console.log(`  - ${venue.name}: ${venue.address}`)
      })
      return
    }

    // Remove the "Other" region from the regions table
    const { data: deletedRegion, error } = await supabase
      .from('regions')
      .delete()
      .eq('name', 'Other')
      .select()

    if (error) throw error

    if (deletedRegion && deletedRegion.length > 0) {
      console.log('✅ Successfully removed "Other" region from database')
      console.log(`Deleted region: ${deletedRegion[0].name} (slug: ${deletedRegion[0].slug})`)
    } else {
      console.log('ℹ️ "Other" region was already removed or doesn\'t exist')
    }

    // Verify final state
    const { count: finalCount } = await supabase
      .from('regions')
      .select('*', { count: 'exact' })

    const { count: venueCount } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })

    console.log(`\n📊 FINAL STATE:`)
    console.log(`Total regions: ${finalCount}`)
    console.log(`Total venues: ${venueCount}`)
    console.log(`All venues have dedicated location pages!`)

    console.log('\n🚫 The following URL will now return 404:')
    console.log('• http://localhost:3002/uk/other')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  removeOtherRegion()
}

export { removeOtherRegion }