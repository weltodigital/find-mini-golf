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

async function checkLondonVenues() {
  try {
    console.log('Checking London venues for duplicates...\n')

    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, address, region')
      .eq('region', 'London')
      .order('name')

    if (error) throw error

    console.log('All London venues:')
    venues?.forEach(v => {
      console.log(`- ${v.name}`)
      console.log(`  Address: ${v.address}`)
      console.log(`  ID: ${v.id.slice(0,8)}...`)
      console.log('')
    })

    console.log(`Total London venues: ${venues?.length || 0}\n`)

    // Check for duplicates
    const nameGroups = (venues || []).reduce((acc, venue) => {
      const key = venue.name.toLowerCase().trim()
      if (!acc[key]) acc[key] = []
      acc[key].push(venue)
      return acc
    }, {} as Record<string, any[]>)

    const duplicates = Object.entries(nameGroups)
      .filter(([name, venues]) => venues.length > 1)

    if (duplicates.length > 0) {
      console.log('🔥 DUPLICATES FOUND:')
      duplicates.forEach(([name, venues]) => {
        console.log(`\n"${venues[0].name}" (${venues.length} entries):`)
        venues.forEach(v => {
          console.log(`  - ID: ${v.id.slice(0,8)}... | Address: ${v.address}`)
        })
      })
    } else {
      console.log('✅ No duplicates found in London venues')
    }

  } catch (error) {
    console.error('Error checking London venues:', error)
  }
}

// Run if called directly
if (require.main === module) {
  checkLondonVenues()
}

export { checkLondonVenues }