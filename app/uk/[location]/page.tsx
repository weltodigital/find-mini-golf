import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VenueCard from '@/components/VenueCard'
import Map from '@/components/Map'
import { supabase } from '@/lib/supabase'
import { MapPin, Navigation } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    location: string
  }
}

async function getLocationData(locationSlug: string) {
  try {
    // First try to find the region
    const { data: region, error: regionError } = await supabase
      .from('regions')
      .select('*')
      .eq('slug', locationSlug)
      .single()

    if (regionError && regionError.code !== 'PGRST116') {
      throw regionError
    }

    // If no exact region match, try to find venues by partial name match
    let venues = []
    let regionName = ''

    if (region) {
      // Get venues for this region
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .eq('region', region.name)
        .order('name')

      if (venuesError) throw venuesError
      venues = venuesData || []
      regionName = region.name
    } else {
      // Try to match venues by location name in address or name
      const locationName = locationSlug.replace(/-/g, ' ')
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .or(`region.ilike.%${locationName}%,address.ilike.%${locationName}%,name.ilike.%${locationName}%`)
        .order('name')

      if (venuesError) throw venuesError
      venues = venuesData || []

      // Use the most common region name from the results
      if (venues.length > 0) {
        const regions = venues.map(v => v.region)
        regionName = regions.reduce((a, b, i, arr) =>
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      } else {
        // Capitalize the slug for display
        regionName = locationSlug.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }
    }

    return { region: regionName, venues, locationSlug }
  } catch (error) {
    console.error('Error fetching location data:', error)
    return null
  }
}

function calculateCenter(venues: any[]) {
  if (venues.length === 0) return [54.7, -2.5] // UK center default

  const avgLat = venues.reduce((sum, venue) => sum + venue.latitude, 0) / venues.length
  const avgLng = venues.reduce((sum, venue) => sum + venue.longitude, 0) / venues.length

  return [avgLat, avgLng]
}

export async function generateMetadata({ params }: PageProps) {
  const { location } = params
  const data = await getLocationData(location)

  if (!data) {
    return {
      title: 'Location Not Found | Find Mini Golf',
      description: 'The requested location was not found.'
    }
  }

  const { region, venues } = data
  const venueCount = venues.length

  // Special handling for "Other" region
  if (region === 'Other') {
    return {
      title: `Mini Golf Venues Across the UK | Find Adventure Golf Near You`,
      description: `Discover ${venueCount} mini golf venues across the UK. Find adventure golf, crazy golf, putt putt and mini golf courses near you with reviews, locations, and contact details.`,
      keywords: `mini golf, adventure golf, crazy golf, putt putt, golf courses, UK, family activities`,
      openGraph: {
        title: `Mini Golf Venues Across the UK | Find Adventure Golf Near You`,
        description: `Discover ${venueCount} mini golf venues across the UK. Find adventure golf, crazy golf, and putt putt courses near you.`,
        type: 'website'
      }
    }
  }

  // City-specific keywords and optimized titles
  const cityKeywords = `mini golf ${region}, adventure golf ${region}, crazy golf ${region}, putt putt ${region}, golf courses ${region}, family activities ${region}, things to do ${region}`

  return {
    title: `Mini Golf ${region} - Best Adventure Golf Courses & Crazy Golf Near You`,
    description: `Find the best mini golf venues in ${region}. ${venueCount} top-rated adventure golf courses, crazy golf, and putt putt venues. Perfect for families, dates, and parties in ${region}.`,
    keywords: cityKeywords,
    openGraph: {
      title: `Mini Golf ${region} - Best Adventure Golf & Crazy Golf Courses`,
      description: `Find the best mini golf venues in ${region}. ${venueCount} top-rated adventure golf and crazy golf courses perfect for families.`,
      type: 'website'
    }
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { location } = params
  const data = await getLocationData(location)

  if (!data || data.venues.length === 0) {
    notFound()
  }

  const { region, venues } = data
  const mapCenter = calculateCenter(venues) as [number, number]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/uk" className="hover:text-primary-600 transition-colors">
              UK
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{region}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          {region === 'Other' ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Mini Golf Venues Across the UK
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Discover {venues.length} amazing mini golf venues across the UK. From adventure golf to crazy golf,
                putt putt to indoor courses, find your perfect family day out anywhere in Britain.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Best Mini Golf in {region} - Adventure Golf & Crazy Golf Courses
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Find the top {venues.length} mini golf venues in {region}. From adventure golf courses to themed crazy golf,
                discover the best putt putt and family golf activities for your perfect day out in {region}.
              </p>
            </>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{venues.length} venues found in {region === 'Other' ? 'across the UK' : region}</span>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {region === 'Other' ?
              'Adventure Golf & Mini Golf Venues Across the UK - Interactive Map' :
              `Adventure Golf & Mini Golf Venues in ${region} - Interactive Map`
            }
          </h2>
          <Map venues={venues} center={mapCenter} height="500px" zoom={10} />
        </div>

        {/* Venues List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {region === 'Other' ?
                'Top-Rated Mini Golf & Adventure Golf Venues Across the UK' :
                `Top-Rated Mini Golf & Adventure Golf Venues in ${region}`
              }
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Navigation className="w-4 h-4" />
              <span>Sorted by name</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {region === 'Other' ?
              'Why Choose Mini Golf & Adventure Golf Across the UK?' :
              `Why Choose Mini Golf & Adventure Golf in ${region}?`
            }
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              {region === 'Other' ? (
                `Explore ${venues.length} premium mini golf venues across the UK, each offering unique adventure golf experiences perfect for families, couples, and groups. From themed crazy golf courses to indoor putt putt venues, discover the best mini golf destinations throughout Britain.`
              ) : (
                `${region} is home to ${venues.length} exceptional mini golf venues, offering the best adventure golf and crazy golf experiences in the area. Whether you're looking for themed putt putt courses, indoor mini golf, or outdoor adventure golf, ${region} has something perfect for every occasion.`
              )}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {region === 'Other' ? (
                `Our comprehensive directory features carefully selected adventure golf venues from major cities to charming towns across the UK. Each venue offers unique experiences from pirate-themed crazy golf to jungle adventure courses, with many providing additional entertainment, food, and drinks.`
              ) : (
                `From pirate-themed adventure golf to jungle crazy golf courses, ${region}'s mini golf venues offer diverse experiences for all ages. Many locations feature additional activities including food, drinks, arcade games, and party packages - making them perfect destinations for special occasions.`
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Mini Golf Types {region !== 'Other' ? `in ${region}` : 'Across the UK'}</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Adventure Golf Courses & Themed Experiences</li>
                  <li>• Indoor Mini Golf & Glow-in-the-Dark Venues</li>
                  <li>• Classic Crazy Golf & Putt Putt Courses</li>
                  <li>• Family Entertainment Centers with Multi-Activities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect Mini Golf Occasions</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Family Days Out & Children's Activities</li>
                  <li>• Date Nights & Romantic Activities</li>
                  <li>• Birthday Parties & Celebrations</li>
                  <li>• Corporate Events & Team Building</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const { data: regions } = await supabase
      .from('regions')
      .select('slug')

    if (!regions) return []

    return regions.map((region) => ({
      location: region.slug
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}