import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create Supabase client for migration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface WordPressVenue {
  id: number
  name: string
  address: string
  latitude: string
  longitude: string
  website?: string
  region: string
}

function parseWordPressData(sqlContent: string): WordPressVenue[] {
  const venues: WordPressVenue[] = []

  // Use a simpler approach - look for the actual venue data we can see
  const lines = sqlContent.split('\n')
  const insertLine = lines.find(line => line.includes('INSERT IGNORE INTO `XOF_wpgmza` VALUES'))

  if (!insertLine) {
    console.log('No INSERT statement found for XOF_wpgmza table')
    return venues
  }

  // Extract just the venue data part after VALUES
  const valuesMatch = insertLine.match(/VALUES\s+(.+);?$/)
  if (!valuesMatch) {
    console.log('Could not extract VALUES section')
    return venues
  }

  const valuesData = valuesMatch[1].replace(/;$/, '') // Remove trailing semicolon
  console.log('Values data length:', valuesData.length)

  // Parse the venue records manually since they're in a predictable format
  // Based on the sample data, each record is: (id,map_id,'address','','','website','',lat,lng,'0','title','0','',flags...)

  // More targeted regex for complete venue records
  const recordRegex = /\((\d+),\d+,'([^']+)','[^']*','[^']*','([^']*)','[^']*','?([0-9.-]+)'?,'?([0-9.-]+)'?,'[^']*','([^']+)'/g

  let match
  while ((match = recordRegex.exec(valuesData)) !== null) {
    try {
      const [, id, address, website, lat, lng, name] = match

      if (!name || !address || !lat || !lng) {
        continue
      }

      // Extract region from the name or address
      const region = extractRegion(name, address)

      venues.push({
        id: parseInt(id),
        name: cleanString(name),
        address: cleanString(address),
        latitude: lat,
        longitude: lng,
        website: website && website !== '' ? website : undefined,
        region: region
      })
    } catch (error) {
      console.log(`Error parsing venue:`, error)
    }
  }

  console.log(`Parsed ${venues.length} venues`)
  return venues
}

function extractRegion(name: string, address: string): string {
  const text = `${name} ${address}`.toLowerCase()

  // Define region mapping based on the data analysis
  if (text.includes('london') || text.includes('westminster') || text.includes('camden') || text.includes('southwark')) return 'London'
  if (text.includes('brighton') || text.includes('hove')) return 'Brighton'
  if (text.includes('manchester')) return 'Manchester'
  if (text.includes('birmingham')) return 'Birmingham'
  if (text.includes('glasgow')) return 'Glasgow'
  if (text.includes('edinburgh')) return 'Edinburgh'
  if (text.includes('bristol')) return 'Bristol'
  if (text.includes('bournemouth')) return 'Bournemouth'
  if (text.includes('portsmouth') || text.includes('southsea')) return 'Portsmouth'
  if (text.includes('reading')) return 'Reading'
  if (text.includes('southampton')) return 'Southampton'
  if (text.includes('oxford')) return 'Oxford'
  if (text.includes('milton keynes')) return 'Milton Keynes'
  if (text.includes('canterbury')) return 'Canterbury'
  if (text.includes('chichester')) return 'Chichester'
  if (text.includes('cheltenham')) return 'Cheltenham'
  if (text.includes('wolverhampton')) return 'Wolverhampton'

  return 'Other'
}

function cleanString(str: string): string {
  return str
    .replace(/^'|'$/g, '') // Remove leading/trailing quotes
    .replace(/\\'/g, "'") // Unescape quotes
    .replace(/&amp;/g, '&') // Decode HTML entities
    .trim()
}

async function migrateToSupabase() {
  try {
    console.log('Reading WordPress database backup...')
    const sqlContent = fs.readFileSync('./findminigolf_com-backup.sql', 'utf8')

    console.log('Parsing venue data...')
    const venues = parseWordPressData(sqlContent)

    console.log(`Found ${venues.length} venues to migrate`)

    // Create regions first
    const regions = Array.from(new Set(venues.map(v => v.region)))
    console.log(`Creating ${regions.length} regions...`)

    for (const regionName of regions) {
      const { error } = await supabase
        .from('regions')
        .upsert({
          name: regionName,
          slug: regionName.toLowerCase().replace(/\s+/g, '-'),
          description: `Mini golf venues in ${regionName}`
        }, {
          onConflict: 'slug'
        })

      if (error) {
        console.log(`Error creating region ${regionName}:`, error)
      }
    }

    // Import venues in batches to avoid timeout
    console.log('Importing venues...')
    const batchSize = 50
    let imported = 0

    for (let i = 0; i < venues.length; i += batchSize) {
      const batch = venues.slice(i, i + batchSize)

      const venueData = batch.map(venue => {
        const lat = parseFloat(venue.latitude)
        const lng = parseFloat(venue.longitude)

        if (isNaN(lat) || isNaN(lng)) {
          console.log(`Skipping venue with invalid coordinates: ${venue.name}`)
          return null
        }

        return {
          name: venue.name,
          address: venue.address,
          latitude: lat,
          longitude: lng,
          website: venue.website,
          region: venue.region
        }
      }).filter(Boolean)

      if (venueData.length > 0) {
        const { error } = await supabase
          .from('venues')
          .insert(venueData)

        if (error) {
          console.log(`Error importing batch starting at ${i}:`, error)
        } else {
          imported += venueData.length
          console.log(`Imported ${imported} venues...`)
        }
      }
    }

    console.log(`Successfully imported ${imported} venues to Supabase!`)
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToSupabase()
}

export { migrateToSupabase }