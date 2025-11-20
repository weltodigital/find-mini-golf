import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Geographic fixes needed based on analysis
const geographicFixes = [
  {
    name: 'Southsea',
    description: 'Create Southsea region for venues currently in Portsmouth',
    searchTerm: '%Southsea%',
    createRegion: true,
    slug: 'southsea'
  },
  {
    name: 'Hove',
    description: 'Create Hove region for venues currently in Brighton',
    searchTerm: '%Hove%',
    createRegion: true,
    slug: 'hove'
  },
  {
    name: 'Bath',
    description: 'Create Bath region for Bath venues',
    searchTerm: '%Bath%',
    createRegion: true,
    slug: 'bath'
  },
  {
    name: 'Preston',
    description: 'Create Preston region for Preston venues',
    searchTerm: '%Preston%',
    createRegion: true,
    slug: 'preston'
  },
  {
    name: 'Coventry',
    description: 'Create Coventry region for Coventry venues',
    searchTerm: '%Coventry%',
    createRegion: true,
    slug: 'coventry'
  },
  {
    name: 'Derby',
    description: 'Create Derby region for Derby venues',
    searchTerm: '%Derby%',
    createRegion: true,
    slug: 'derby'
  },
  {
    name: 'Kingston upon Hull',
    description: 'Create Hull region for Hull venues',
    searchTerm: '%Hull%',
    createRegion: true,
    slug: 'kingston-upon-hull'
  }
]

async function fixGeographicMismatches() {
  try {
    console.log('Fixing geographic mismatches and creating missing regions...\n')

    for (const fix of geographicFixes) {
      console.log(`\n=== ${fix.description} ===`)

      if (fix.createRegion) {
        // Check if region already exists
        const { data: existingRegion } = await supabase
          .from('regions')
          .select('*')
          .eq('name', fix.name)
          .single()

        if (existingRegion) {
          console.log(`✅ ${fix.name} region already exists`)
        } else {
          // Create new region
          const { data: newRegion, error: regionError } = await supabase
            .from('regions')
            .insert({
              name: fix.name,
              slug: fix.slug
            })
            .select()
            .single()

          if (regionError) throw regionError
          console.log(`✅ Created ${fix.name} region`)
        }
      }

      // Find venues for this location
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('id, name, address, region')
        .ilike('address', fix.searchTerm)

      if (venuesError) throw venuesError

      if (venues && venues.length > 0) {
        console.log(`Found ${venues.length} ${fix.name} venues:`)
        venues.forEach(venue => {
          console.log(`  - ${venue.name} (currently: ${venue.region})`)
        })

        // Update venues to correct region
        const { data: updatedVenues, error: updateError } = await supabase
          .from('venues')
          .update({ region: fix.name })
          .in('id', venues.map(v => v.id))
          .select()

        if (updateError) throw updateError

        console.log(`✅ Updated ${updatedVenues?.length || 0} venues to ${fix.name} region`)
      } else {
        console.log(`⚠️ No venues found for ${fix.name}`)
      }
    }

    console.log('\n📝 New regions to add to utils.ts:')
    geographicFixes.forEach(fix => {
      console.log(`    '${fix.name}': '${fix.slug}',`)
    })

    console.log('\n🎉 Geographic mismatches fixed!')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  fixGeographicMismatches()
}

export { fixGeographicMismatches }