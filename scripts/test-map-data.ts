import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testMapData() {
  try {
    console.log('🗺️  TESTING MAP DATA INTEGRITY\n')
    console.log('='.repeat(50))

    // Check for venues with missing or invalid coordinates
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, address, latitude, longitude, region')
      .order('name')

    if (error) throw error

    console.log(`\n📊 TOTAL VENUES: ${venues?.length || 0}`)

    // Check for missing coordinates
    const missingCoords = venues?.filter(venue =>
      !venue.latitude || !venue.longitude ||
      venue.latitude === 0 || venue.longitude === 0 ||
      isNaN(venue.latitude) || isNaN(venue.longitude)
    ) || []

    console.log(`\n❌ VENUES WITH MISSING/INVALID COORDINATES: ${missingCoords.length}`)

    if (missingCoords.length > 0) {
      console.log('\nVenues requiring coordinate fixes:')
      missingCoords.slice(0, 10).forEach(venue => {
        console.log(`  - ${venue.name}: lat=${venue.latitude}, lng=${venue.longitude}`)
        console.log(`    Address: ${venue.address}`)
      })
      if (missingCoords.length > 10) {
        console.log(`    ... and ${missingCoords.length - 10} more`)
      }
    }

    // Check for venues with missing addresses
    const missingAddresses = venues?.filter(venue =>
      !venue.address || venue.address.trim() === ''
    ) || []

    console.log(`\n📍 VENUES WITH MISSING ADDRESSES: ${missingAddresses.length}`)

    if (missingAddresses.length > 0) {
      console.log('\nVenues missing addresses:')
      missingAddresses.slice(0, 10).forEach(venue => {
        console.log(`  - ${venue.name}: "${venue.address}"`)
      })
    }

    // Check coordinate ranges (UK boundaries approximately)
    const ukBounds = {
      minLat: 49.5,
      maxLat: 61,
      minLng: -8,
      maxLng: 2
    }

    const outOfBounds = venues?.filter(venue =>
      venue.latitude && venue.longitude &&
      !isNaN(venue.latitude) && !isNaN(venue.longitude) &&
      (venue.latitude < ukBounds.minLat || venue.latitude > ukBounds.maxLat ||
       venue.longitude < ukBounds.minLng || venue.longitude > ukBounds.maxLng)
    ) || []

    console.log(`\n🌍 VENUES OUTSIDE UK BOUNDS: ${outOfBounds.length}`)

    if (outOfBounds.length > 0) {
      console.log('\nVenues with coordinates outside UK:')
      outOfBounds.slice(0, 5).forEach(venue => {
        console.log(`  - ${venue.name}: lat=${venue.latitude}, lng=${venue.longitude}`)
        console.log(`    Address: ${venue.address}`)
      })
    }

    // Sample some venues for map testing
    const sampleVenues = venues?.slice(0, 5) || []
    console.log(`\n🎯 SAMPLE VENUES FOR MAP TESTING:`)
    sampleVenues.forEach(venue => {
      console.log(`  ✅ ${venue.name}`)
      console.log(`     Address: ${venue.address}`)
      console.log(`     Coordinates: ${venue.latitude}, ${venue.longitude}`)
      console.log(`     Region: ${venue.region}`)
    })

    console.log(`\n📈 SUMMARY:`)
    console.log(`  • Total venues: ${venues?.length || 0}`)
    console.log(`  • Valid coordinates: ${(venues?.length || 0) - missingCoords.length}`)
    console.log(`  • Missing coordinates: ${missingCoords.length}`)
    console.log(`  • Missing addresses: ${missingAddresses.length}`)
    console.log(`  • Outside UK bounds: ${outOfBounds.length}`)
    console.log(`  • Map-ready venues: ${(venues?.length || 0) - missingCoords.length - outOfBounds.length}`)

  } catch (error) {
    console.error('❌ Error testing map data:', error)
  }
}

if (require.main === module) {
  testMapData()
}

export { testMapData }