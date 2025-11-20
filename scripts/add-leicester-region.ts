import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addLeicesterRegion() {
  try {
    console.log('Adding Leicester region...\n')

    // Add Leicester region
    const { data: newRegion, error: regionError } = await supabase
      .from('regions')
      .insert({
        name: 'Leicester',
        slug: 'leicester'
      })
      .select()
      .single()

    if (regionError) {
      if (regionError.code === '23505') {
        console.log('Leicester region already exists')
      } else {
        throw regionError
      }
    } else {
      console.log('✅ Created Leicester region:', newRegion)
    }

    // Get Leicester venues (those with Leicester in address)
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, address')
      .ilike('address', '%Leicester%')

    if (venuesError) throw venuesError

    console.log(`\nFound ${venues?.length || 0} Leicester venues:`)
    venues?.forEach(venue => {
      console.log(`- ${venue.name}: ${venue.address}`)
    })

    // Update venues to Leicester region
    if (venues && venues.length > 0) {
      const { data: updatedVenues, error: updateError } = await supabase
        .from('venues')
        .update({ region: 'Leicester' })
        .in('id', venues.map(v => v.id))
        .select()

      if (updateError) throw updateError

      console.log(`\n✅ Updated ${updatedVenues?.length || 0} venues to Leicester region`)
    }

    // Update utils.ts to include Leicester
    console.log('\n📝 Remember to add Leicester to getRegionSlug mapping in lib/utils.ts')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  addLeicesterRegion()
}

export { addLeicesterRegion }