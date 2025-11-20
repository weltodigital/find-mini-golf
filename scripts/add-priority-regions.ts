import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// High-priority cities with 4+ venues each
const priorityRegions = [
  { name: 'Norwich', searchTerm: '%Norwich%' },
  { name: 'Nottingham', searchTerm: '%Nottingham%' },
  { name: 'Liverpool', searchTerm: '%Liverpool%' },
  { name: 'Poole', searchTerm: '%Poole%' },
  { name: 'Blackpool', searchTerm: '%Blackpool%' },
  { name: 'Cardiff', searchTerm: '%Cardiff%' },
  { name: 'Eastbourne', searchTerm: '%Eastbourne%' },
  { name: 'Great Yarmouth', searchTerm: '%Great Yarmouth%' },
  { name: 'Newcastle upon Tyne', searchTerm: '%Newcastle%' },
  { name: 'Southend', searchTerm: '%Southend%' },
  { name: 'Stoke-on-Trent', searchTerm: '%Stoke%' },
  { name: 'York', searchTerm: '%York%' },
  { name: 'Leeds', searchTerm: '%Leeds%' },
  { name: 'Sheffield', searchTerm: '%Sheffield%' }
]

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function addPriorityRegions() {
  try {
    console.log('Adding priority regions with 4+ venues...\n')

    for (const region of priorityRegions) {
      console.log(`\n=== Processing ${region.name} ===`)

      // Check if region already exists
      const { data: existingRegion } = await supabase
        .from('regions')
        .select('*')
        .eq('name', region.name)
        .single()

      if (existingRegion) {
        console.log(`✅ ${region.name} region already exists`)
      } else {
        // Create new region
        const { data: newRegion, error: regionError } = await supabase
          .from('regions')
          .insert({
            name: region.name,
            slug: createSlug(region.name)
          })
          .select()
          .single()

        if (regionError) throw regionError
        console.log(`✅ Created ${region.name} region`)
      }

      // Find venues for this city
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('id, name, address, region')
        .ilike('address', region.searchTerm)

      if (venuesError) throw venuesError

      if (venues && venues.length > 0) {
        console.log(`Found ${venues.length} ${region.name} venues:`)
        venues.forEach(venue => {
          console.log(`  - ${venue.name} (currently: ${venue.region})`)
        })

        // Update venues to correct region
        const { data: updatedVenues, error: updateError } = await supabase
          .from('venues')
          .update({ region: region.name })
          .in('id', venues.map(v => v.id))
          .select()

        if (updateError) throw updateError

        console.log(`✅ Updated ${updatedVenues?.length || 0} venues to ${region.name} region`)
      } else {
        console.log(`⚠️ No venues found for ${region.name}`)
      }
    }

    console.log('\n📝 Remember to update getRegionSlug mapping in lib/utils.ts with new regions')
    console.log('\nNew regions to add to utils.ts:')
    priorityRegions.forEach(region => {
      console.log(`    '${region.name}': '${createSlug(region.name)}',`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  addPriorityRegions()
}

export { addPriorityRegions }