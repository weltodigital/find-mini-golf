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

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

async function addVenueSlugs() {
  try {
    console.log('Adding slugs to all venues...\n')

    // Get all venues
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, region')
      .order('name')

    if (error) throw error

    console.log(`Found ${venues?.length || 0} venues to process`)

    // Process each venue
    let processed = 0
    const batchSize = 10

    for (let i = 0; i < (venues || []).length; i += batchSize) {
      const batch = venues?.slice(i, i + batchSize) || []

      const updates = batch.map(venue => {
        const slug = createSlug(venue.name)
        return {
          id: venue.id,
          slug: slug
        }
      })

      // Update batch
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('venues')
          .update({ slug: update.slug })
          .eq('id', update.id)

        if (updateError) {
          console.error(`❌ Error updating ${update.id}:`, updateError)
        } else {
          processed++
          if (processed % 20 === 0) {
            console.log(`✅ Processed ${processed}/${venues?.length || 0} venues...`)
          }
        }
      }
    }

    console.log(`\n🎉 Completed! Added slugs to ${processed} venues`)

    // Show some examples
    console.log('\n📝 Example venue slugs:')
    const { data: examples } = await supabase
      .from('venues')
      .select('name, slug, region')
      .limit(10)

    examples?.forEach(venue => {
      console.log(`  ${venue.name} -> ${venue.slug} (${venue.region})`)
    })

  } catch (error) {
    console.error('❌ Error adding venue slugs:', error)
  }
}

// Run if called directly
if (require.main === module) {
  addVenueSlugs()
}

export { addVenueSlugs }