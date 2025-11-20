const { createClient } = require('@supabase/supabase-js');

// Use the credentials from the .env file (which appear to be more current)
const supabaseUrl = 'https://hdmsfnidzzqzdcljebks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbXNmbmlkenpxemRjbGplYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQ4NzQsImV4cCI6MjA3OTIxMDg3NH0.-69frcGawEuIFAOHJdWweZQe7MtcmPxjL-3jtkgNkWA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

function extractCityFromAddress(address) {
  // Clean up the address first
  let cleanAddress = address.trim();

  // Remove common prefixes that might confuse parsing
  cleanAddress = cleanAddress.replace(/^(The\s+)?(.+)/i, '$2');

  // Split by commas to get address parts
  const parts = cleanAddress.split(',').map(part => part.trim());

  // Common patterns for UK addresses:
  // "Street, City, Postcode"
  // "Venue Name, Street, City, County, Postcode"
  // "Street, City, County, UK"

  let city = null;

  // Look for patterns with postcodes (UK postcodes are at the end)
  const postcodePattern = /[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  const ukPattern = /\buk\b/i;

  if (parts.length >= 2) {
    // Check if the last part looks like a postcode or "UK"
    const lastPart = parts[parts.length - 1];
    const secondLastPart = parts.length > 2 ? parts[parts.length - 2] : null;

    if (postcodePattern.test(lastPart)) {
      // Pattern: ..., City, Postcode
      if (parts.length >= 2) {
        city = parts[parts.length - 2];
      }
    } else if (ukPattern.test(lastPart)) {
      // Pattern: ..., City, UK
      if (parts.length >= 2) {
        city = parts[parts.length - 2];
      }
    } else if (secondLastPart && postcodePattern.test(secondLastPart)) {
      // Pattern: ..., City, County, Postcode (rare but possible)
      if (parts.length >= 3) {
        city = parts[parts.length - 3];
      }
    } else {
      // Try to guess - usually the second to last meaningful part
      // Skip very short parts that might be county codes
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (part.length > 2 && !postcodePattern.test(part) && !ukPattern.test(part)) {
          city = part;
          break;
        }
      }
    }
  }

  if (!city && parts.length >= 2) {
    // Fallback: take the second part (assuming first is venue/street)
    city = parts[1];
  }

  if (!city && parts.length >= 1) {
    // Last resort: take the first part
    city = parts[0];
  }

  // Clean up the city name
  if (city) {
    city = city
      .replace(/^\d+\s*/, '') // Remove leading numbers
      .replace(/\b(Street|St|Road|Rd|Avenue|Ave|Lane|Close|Drive|Way|Place|Court|Ct)\b.*$/i, '') // Remove street suffixes
      .replace(/\b(Industrial Estate|Business Park|Shopping Centre|Retail Park)\b.*$/i, '') // Remove commercial area suffixes
      .trim();

    // Skip if it's too short or looks like a street name/number
    if (city.length < 3 || /^\d+$/.test(city)) {
      return null;
    }
  }

  return city;
}

async function main() {
  console.log('🏌️ Starting migration of venues from "Other" region...\n');

  try {
    // 1. Query all venues in the "Other" region
    console.log('1️⃣ Querying venues in "Other" region...');
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .eq('region', 'Other');

    if (venuesError) {
      throw new Error(`Error fetching venues: ${venuesError.message}`);
    }

    console.log(`Found ${venues.length} venues in "Other" region\n`);

    if (venues.length === 0) {
      console.log('✅ No venues found in "Other" region. Migration already complete!');
      return;
    }

    // 2. Extract unique cities from addresses
    console.log('2️⃣ Extracting cities from venue addresses...');
    const cityVenueMap = new Map();
    const failedExtractions = [];

    venues.forEach(venue => {
      const city = extractCityFromAddress(venue.address);
      if (city) {
        if (!cityVenueMap.has(city)) {
          cityVenueMap.set(city, []);
        }
        cityVenueMap.get(city).push(venue);
        console.log(`  📍 ${venue.name} -> ${city}`);
      } else {
        failedExtractions.push(venue);
        console.log(`  ❌ Failed to extract city from: ${venue.name} (${venue.address})`);
      }
    });

    console.log(`\nExtracted ${cityVenueMap.size} unique cities:`);
    Array.from(cityVenueMap.keys()).forEach(city => {
      console.log(`  🏙️ ${city} (${cityVenueMap.get(city).length} venues)`);
    });

    if (failedExtractions.length > 0) {
      console.log(`\n⚠️ ${failedExtractions.length} venues had addresses that couldn't be parsed automatically:`);
      failedExtractions.forEach(venue => {
        console.log(`  - ${venue.name}: ${venue.address}`);
      });
    }

    // 3. Create new regions for each unique city
    console.log(`\n3️⃣ Creating ${cityVenueMap.size} new regions...`);
    const createdRegions = [];

    for (const city of cityVenueMap.keys()) {
      const slug = createSlug(city);

      try {
        const { data: region, error: regionError } = await supabase
          .from('regions')
          .insert({
            name: city,
            slug: slug,
            description: `Mini golf venues in ${city}`
          })
          .select()
          .single();

        if (regionError) {
          throw new Error(`Error creating region ${city}: ${regionError.message}`);
        }

        createdRegions.push(region);
        console.log(`  ✅ Created region: ${city} (slug: ${slug})`);
      } catch (error) {
        console.log(`  ❌ Failed to create region ${city}: ${error.message}`);
      }
    }

    // 4. Update venues to use the new regions
    console.log(`\n4️⃣ Updating venues with new regions...`);
    let updatedCount = 0;

    for (const [city, cityVenues] of cityVenueMap.entries()) {
      for (const venue of cityVenues) {
        try {
          const { error: updateError } = await supabase
            .from('venues')
            .update({ region: city })
            .eq('id', venue.id);

          if (updateError) {
            throw new Error(`Error updating venue ${venue.name}: ${updateError.message}`);
          }

          updatedCount++;
          console.log(`  ✅ Updated ${venue.name} -> ${city}`);
        } catch (error) {
          console.log(`  ❌ Failed to update ${venue.name}: ${error.message}`);
        }
      }
    }

    // 5. Verify no venues remain in "Other"
    console.log(`\n5️⃣ Verifying migration...`);
    const { data: remainingVenues, error: verifyError } = await supabase
      .from('venues')
      .select('id, name')
      .eq('region', 'Other');

    if (verifyError) {
      throw new Error(`Error verifying migration: ${verifyError.message}`);
    }

    // 6. Generate slug mappings for utils.ts
    console.log(`\n6️⃣ Generating slug mappings...\n`);

    const slugMappings = {};
    createdRegions.forEach(region => {
      slugMappings[region.name] = region.slug;
    });

    // 7. Generate final report
    console.log('📊 MIGRATION REPORT');
    console.log('==================');
    console.log(`✅ Venues processed: ${venues.length}`);
    console.log(`✅ New regions created: ${createdRegions.length}`);
    console.log(`✅ Venues updated: ${updatedCount}`);
    console.log(`⚠️  Venues requiring manual review: ${failedExtractions.length}`);
    console.log(`✅ Venues remaining in "Other": ${remainingVenues.length}`);

    console.log('\n🗺️ NEW REGION SLUG MAPPINGS:');
    console.log('============================');
    Object.entries(slugMappings).forEach(([name, slug]) => {
      console.log(`    '${name}': '${slug}',`);
    });

    if (failedExtractions.length > 0) {
      console.log('\n⚠️  VENUES REQUIRING MANUAL REVIEW:');
      console.log('===================================');
      failedExtractions.forEach(venue => {
        console.log(`- ${venue.name}`);
        console.log(`  Address: ${venue.address}`);
        console.log(`  ID: ${venue.id}\n`);
      });
    }

    console.log('\n🎉 Migration completed successfully!');

    return {
      totalVenues: venues.length,
      newRegions: createdRegions,
      updatedVenues: updatedCount,
      failedExtractions: failedExtractions,
      remainingInOther: remainingVenues.length,
      slugMappings: slugMappings
    };

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, extractCityFromAddress, createSlug };