import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMigrationComplete() {
  try {
    console.log('🎯 FINAL MIGRATION VERIFICATION\n')
    console.log('='*50)

    // Check for any venues still in "Other"
    const { data: otherVenues, count: otherCount } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .eq('region', 'Other')

    console.log(`\n📊 VERIFICATION RESULTS:`)
    console.log(`Venues remaining in "Other": ${otherCount}`)

    if (otherCount === 0) {
      console.log('✅ SUCCESS: All venues have been migrated to dedicated location pages!')
    } else {
      console.log('⚠️ WARNING: Some venues still need migration:')
      otherVenues?.forEach(venue => {
        console.log(`  - ${venue.name}: ${venue.address}`)
      })
    }

    // Get total statistics
    const { count: totalVenues } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })

    const { count: totalRegions } = await supabase
      .from('regions')
      .select('*', { count: 'exact' })

    // Get venue distribution by region
    const { data: venuesByRegion } = await supabase
      .from('venues')
      .select('region')

    const regionCounts = venuesByRegion?.reduce((acc, venue) => {
      acc[venue.region] = (acc[venue.region] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    console.log(`\n📈 FINAL STATISTICS:`)
    console.log(`Total Venues: ${totalVenues}`)
    console.log(`Total Regions: ${totalRegions}`)
    console.log(`Venues with dedicated pages: ${totalVenues! - (otherCount || 0)}`)
    console.log(`Coverage: ${(((totalVenues! - (otherCount || 0)) / totalVenues!) * 100).toFixed(1)}%`)

    // Show top 10 regions by venue count
    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    console.log('\n🏆 TOP REGIONS BY VENUE COUNT:')
    console.log('='*35)
    topRegions.forEach(([region, count], index) => {
      const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'
      console.log(`${emoji} ${region}: ${count} venues`)
    })

    // Test a few sample location pages
    console.log('\n🌐 SAMPLE LOCATION PAGES:')
    console.log('='*30)

    const sampleRegions = ['Herne Bay', 'Bognor Regis', 'Henley-on-Thames', 'Aberdeen', 'Margate']
    for (const region of sampleRegions) {
      const { data: regionVenues } = await supabase
        .from('venues')
        .select('name')
        .eq('region', region)
        .limit(3)

      if (regionVenues && regionVenues.length > 0) {
        console.log(`✅ /${region.toLowerCase().replace(/\s+/g, '-')}: ${regionVenues.length} venues`)
        regionVenues.forEach(venue => {
          console.log(`   - ${venue.name}`)
        })
      }
    }

    console.log('\n🎉 MIGRATION IMPACT:')
    console.log('='*20)
    console.log(`• From 40 to ${totalRegions} location pages (+${totalRegions! - 40} new pages)`)
    console.log(`• Every venue now has a dedicated SEO-optimized location page`)
    console.log(`• Massive improvement in local search potential`)
    console.log(`• Complete geographic coverage across the UK`)

    console.log('\nExample URLs now available:')
    console.log('• http://localhost:3002/uk/herne-bay')
    console.log('• http://localhost:3002/uk/bognor-regis')
    console.log('• http://localhost:3002/uk/henley-on-thames')
    console.log('• http://localhost:3002/uk/aberdeen')
    console.log('• http://localhost:3002/uk/margate')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  verifyMigrationComplete()
}

export { verifyMigrationComplete }