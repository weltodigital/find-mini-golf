import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create Supabase client for analysis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

async function analyzeLocations() {
  try {
    console.log('Analyzing current venue locations and regions...\n')

    // Get all unique regions from venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('region')

    if (venuesError) throw venuesError

    // Count venues per region
    const regionCounts = (venues || []).reduce((acc, venue) => {
      acc[venue.region] = (acc[venue.region] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('📊 Venues per region:')
    Object.entries(regionCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([region, count]) => {
        console.log(`  ${region}: ${count} venues`)
      })

    console.log(`\nTotal regions with venues: ${Object.keys(regionCounts).length}`)
    console.log(`Total venues: ${venues?.length || 0}\n`)

    // Get current regions table
    const { data: existingRegions, error: regionsError } = await supabase
      .from('regions')
      .select('*')

    if (regionsError) throw regionsError

    console.log('📋 Current regions table:')
    if (existingRegions) {
      existingRegions.forEach(region => {
        const venueCount = regionCounts[region.name] || 0
        console.log(`  ${region.name} (${region.slug}) - ${venueCount} venues`)
      })
    }

    // Find missing regions (venues without region entries)
    const existingRegionNames = new Set((existingRegions || []).map(r => r.name))
    const missingRegions = Object.keys(regionCounts).filter(region => !existingRegionNames.has(region))

    if (missingRegions.length > 0) {
      console.log('\n❌ Missing regions (need to be added):')
      missingRegions.forEach(region => {
        const slug = createSlug(region)
        console.log(`  ${region} -> /uk/${slug} (${regionCounts[region]} venues)`)
      })

      // Add missing regions
      console.log('\n🔧 Adding missing regions...')
      for (const regionName of missingRegions) {
        const slug = createSlug(regionName)
        const { error } = await supabase
          .from('regions')
          .upsert({
            name: regionName,
            slug: slug,
            description: `Mini golf venues in ${regionName}`
          }, {
            onConflict: 'slug'
          })

        if (error) {
          console.log(`  ❌ Error adding ${regionName}:`, error)
        } else {
          console.log(`  ✅ Added ${regionName} -> /uk/${slug}`)
        }
      }
    } else {
      console.log('\n✅ All venue regions have corresponding region entries')
    }

    // Check for orphaned regions (regions without venues)
    const orphanedRegions = (existingRegions || []).filter(region => !regionCounts[region.name])
    if (orphanedRegions.length > 0) {
      console.log('\n⚠️  Orphaned regions (no venues):')
      orphanedRegions.forEach(region => {
        console.log(`  ${region.name} (${region.slug}) - 0 venues`)
      })
    }

    // Generate complete location list
    const { data: finalRegions, error: finalError } = await supabase
      .from('regions')
      .select('*')
      .order('name')

    if (finalError) throw finalError

    console.log('\n🗺️  Complete location pages available:')
    if (finalRegions) {
      finalRegions.forEach(region => {
        const venueCount = regionCounts[region.name] || 0
        if (venueCount > 0) {
          console.log(`  ✅ /uk/${region.slug} - ${region.name} (${venueCount} venues)`)
        }
      })
    }

    // Check for problematic venue mappings
    console.log('\n🔍 Checking venue-region mappings...')
    const problematicVenues = await Promise.all(
      Object.keys(regionCounts).map(async (regionName) => {
        const { data: regionVenues, error } = await supabase
          .from('venues')
          .select('id, name, region, address')
          .eq('region', regionName)
          .limit(3) // Sample a few

        if (error) return null

        const region = (finalRegions || []).find(r => r.name === regionName)
        if (!region) {
          return { regionName, venues: regionVenues, issue: 'No region entry' }
        }

        return { regionName, venues: regionVenues, region, issue: null }
      })
    )

    const issues = problematicVenues.filter(item => item?.issue)
    if (issues.length > 0) {
      console.log('\n❌ Venue mapping issues found:')
      issues.forEach(issue => {
        console.log(`  ${issue?.regionName}: ${issue?.issue}`)
      })
    } else {
      console.log('✅ All venue-region mappings look correct')
    }

    console.log('\n📈 Summary:')
    console.log(`  • ${Object.keys(regionCounts).length} active regions`)
    console.log(`  • ${venues?.length || 0} total venues`)
    console.log(`  • ${(finalRegions || []).filter(r => regionCounts[r.name] > 0).length} location pages with venues`)
    console.log('  • All location URLs: /uk/[location-slug]')

  } catch (error) {
    console.error('Analysis failed:', error)
  }
}

// Run analysis if called directly
if (require.main === module) {
  analyzeLocations()
}

export { analyzeLocations }