import fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  // Extract venue data from SQL INSERT statements
  const insertMatch = sqlContent.match(/INSERT IGNORE INTO `XOF_wpgmza` VALUES (.*?);/s)
  if (!insertMatch) return venues

  const valuesString = insertMatch[1]
  const venueMatches = valuesString.match(/\([^)]+\)/g)

  if (!venueMatches) return venues

  venueMatches.forEach((match, index) => {
    if (index < 2) return // Skip first two entries (they seem to be test data)

    try {
      const values = match.slice(1, -1).split(',')
      if (values.length < 11) return

      const name = values[10]?.replace(/'/g, '').trim()
      const address = values[2]?.replace(/'/g, '').trim()
      const latitude = values[7]?.replace(/'/g, '').trim()
      const longitude = values[8]?.replace(/'/g, '').trim()
      const website = values[5]?.replace(/'/g, '').trim()

      if (!name || !address || !latitude || !longitude) return

      // Extract region from the name or address
      const region = extractRegion(name, address)

      venues.push({
        id: index,
        name: cleanString(name),
        address: cleanString(address),
        latitude: latitude,
        longitude: longitude,
        website: website && website !== '' ? website : undefined,
        region: region
      })
    } catch (error) {
      console.log(`Error parsing venue at index ${index}:`, error)
    }
  })

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

async function migrateData() {
  try {
    console.log('Reading WordPress database backup...')
    const sqlContent = fs.readFileSync('./findminigolf_com-backup.sql', 'utf8')

    console.log('Parsing venue data...')
    const venues = parseWordPressData(sqlContent)

    console.log(`Found ${venues.length} venues to migrate`)

    // Create regions first
    const regions = [...new Set(venues.map(v => v.region))]
    console.log(`Creating ${regions.length} regions...`)

    for (const regionName of regions) {
      await prisma.region.upsert({
        where: { slug: regionName.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: {
          name: regionName,
          slug: regionName.toLowerCase().replace(/\s+/g, '-'),
          description: `Mini golf venues in ${regionName}`
        }
      })
    }

    // Import venues
    console.log('Importing venues...')
    let imported = 0

    for (const venue of venues) {
      try {
        const lat = parseFloat(venue.latitude)
        const lng = parseFloat(venue.longitude)

        if (isNaN(lat) || isNaN(lng)) {
          console.log(`Skipping venue with invalid coordinates: ${venue.name}`)
          continue
        }

        await prisma.venue.create({
          data: {
            name: venue.name,
            address: venue.address,
            latitude: lat,
            longitude: lng,
            website: venue.website,
            region: venue.region
          }
        })

        imported++
        if (imported % 50 === 0) {
          console.log(`Imported ${imported} venues...`)
        }
      } catch (error) {
        console.log(`Error importing venue ${venue.name}:`, error)
      }
    }

    console.log(`Successfully imported ${imported} venues!`)
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateData()
}

export { migrateData }