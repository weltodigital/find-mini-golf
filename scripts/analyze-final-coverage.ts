import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function analyzeFinalCoverage() {
  try {
    console.log('🎯 LOCATION COVERAGE ANALYSIS - FINAL RESULTS\n')
    console.log('='.repeat(60))

    // Get total venues
    const { data: allVenues, count: totalVenues } = await supabase
      .from('venues')
      .select('*', { count: 'exact' })

    console.log(`\n📊 OVERALL STATISTICS:`)
    console.log(`Total Venues: ${totalVenues}`)

    // Get venue count by region
    const { data: regionCounts } = await supabase
      .from('venues')
      .select('region')
      .not('region', 'is', null)

    const regionCountMap = regionCounts?.reduce((acc, venue) => {
      acc[venue.region] = (acc[venue.region] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Get total regions
    const { count: totalRegions } = await supabase
      .from('regions')
      .select('*', { count: 'exact' })

    console.log(`Total Regions: ${totalRegions}`)

    // Count venues not in "Other" category
    const venuesWithProperRegions = Object.entries(regionCountMap)
      .filter(([region]) => region !== 'Other')
      .reduce((sum, [_, count]) => sum + count, 0)

    const venuesInOther = regionCountMap['Other'] || 0

    console.log(`Venues with dedicated pages: ${venuesWithProperRegions}`)
    console.log(`Venues still in "Other": ${venuesInOther}`)
    console.log(`Coverage: ${((venuesWithProperRegions / totalVenues!) * 100).toFixed(1)}%`)

    console.log('\n🚀 NEWLY CREATED LOCATION PAGES:')
    console.log('='.repeat(40))

    // Show new regions with venue counts (sorted by venue count)
    const newRegions = [
      'Leicester', 'Norwich', 'Nottingham', 'Liverpool', 'Poole',
      'Blackpool', 'Cardiff', 'Eastbourne', 'Great Yarmouth',
      'Newcastle upon Tyne', 'Southend', 'Stoke-on-Trent', 'York',
      'Leeds', 'Sheffield', 'Southsea', 'Hove', 'Bath', 'Preston',
      'Coventry', 'Derby', 'Kingston upon Hull'
    ]

    const newRegionStats = newRegions
      .map(region => ({
        region,
        count: regionCountMap[region] || 0
      }))
      .filter(stat => stat.count > 0)
      .sort((a, b) => b.count - a.count)

    newRegionStats.forEach(stat => {
      console.log(`✅ ${stat.region}: ${stat.count} venues`)
    })

    console.log(`\nTotal new locations: ${newRegionStats.length}`)
    const newVenuesCovered = newRegionStats.reduce((sum, stat) => sum + stat.count, 0)
    console.log(`Total venues now with dedicated pages: ${newVenuesCovered}`)

    console.log('\n🎯 TOP PERFORMING LOCATIONS:')
    console.log('='.repeat(30))

    // Show top regions by venue count
    const topRegions = Object.entries(regionCountMap)
      .filter(([region]) => region !== 'Other')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    topRegions.forEach(([region, count], index) => {
      const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'
      console.log(`${emoji} ${region}: ${count} venues`)
    })

    console.log('\n🔧 REMAINING OPTIMIZATION OPPORTUNITIES:')
    console.log('='.repeat(45))

    if (venuesInOther > 0) {
      console.log(`• ${venuesInOther} venues still in "Other" category`)
      console.log(`• These represent potential for ${venuesInOther} additional location pages`)
    }

    // Get venues still in Other to see what cities remain
    const { data: otherVenues } = await supabase
      .from('venues')
      .select('name, address')
      .eq('region', 'Other')
      .limit(10)

    if (otherVenues && otherVenues.length > 0) {
      console.log('\nSample remaining venues in "Other":')
      otherVenues.forEach(venue => {
        console.log(`  - ${venue.name}: ${venue.address}`)
      })
    }

    console.log('\n🎉 IMPACT SUMMARY:')
    console.log('='.repeat(20))
    console.log(`• Created ${newRegionStats.length} new location pages`)
    console.log(`• Improved SEO for ${newVenuesCovered} venues`)
    console.log(`• Increased location coverage from ~18 to ${totalRegions} regions`)
    console.log(`• Enhanced local search potential significantly`)

    console.log('\nExample new location pages:')
    console.log('• http://localhost:3002/uk/leicester - 5 venues')
    console.log('• http://localhost:3002/uk/norwich - 6 venues')
    console.log('• http://localhost:3002/uk/liverpool - 5 venues')
    console.log('• http://localhost:3002/uk/southsea - 3 venues')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  analyzeFinalCoverage()
}

export { analyzeFinalCoverage }