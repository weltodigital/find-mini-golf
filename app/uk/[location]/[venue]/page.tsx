import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Map from '@/components/Map'
import { supabase } from '@/lib/supabase'
import { MapPin, ExternalLink, Phone, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    location: string
    venue: string
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

async function getVenueData(locationSlug: string, venueSlug: string) {
  try {
    // First get the region from location slug
    const { data: region } = await supabase
      .from('regions')
      .select('name')
      .eq('slug', locationSlug)
      .single()

    if (!region) {
      return null
    }

    // Get all venues in this region
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .eq('region', region.name)

    if (error) throw error

    // Find venue by matching slug generated from name
    const venue = venues?.find(v => createSlug(v.name) === venueSlug)

    return venue
  } catch (error) {
    console.error('Error fetching venue:', error)
    return null
  }
}

async function getNearbyVenues(latitude: number, longitude: number, excludeId: string, region: string) {
  try {
    // Get venues in the same region
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .eq('region', region)
      .neq('id', excludeId)
      .limit(6)

    if (error) throw error

    return venues || []
  } catch (error) {
    console.error('Error fetching nearby venues:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { location, venue: venueSlug } = params
  const venue = await getVenueData(location, venueSlug)

  if (!venue) {
    return {
      title: 'Venue Not Found | Find Mini Golf',
      description: 'The requested venue was not found.'
    }
  }

  const locationName = venue.region
  const venueName = venue.name

  return {
    title: `${venueName} - Mini Golf in ${locationName} | Adventure Golf & Crazy Golf`,
    description: `Visit ${venueName} in ${locationName}. ${venue.description || `Find adventure golf, crazy golf, and mini golf at ${venue.address}. Perfect for families, dates, and special occasions.`}`,
    keywords: `${venueName}, mini golf ${locationName}, adventure golf ${locationName}, crazy golf ${locationName}, ${venue.address}`,
    openGraph: {
      title: `${venueName} - Mini Golf in ${locationName}`,
      description: `Visit ${venueName} in ${locationName}. ${venue.description || `Adventure golf and crazy golf at ${venue.address}.`}`,
      type: 'website'
    }
  }
}

export default async function VenuePage({ params }: PageProps) {
  const { location, venue: venueSlug } = params
  const venue = await getVenueData(location, venueSlug)

  if (!venue) {
    notFound()
  }

  const nearbyVenues = await getNearbyVenues(venue.latitude, venue.longitude, venue.id, venue.region)
  const regionSlug = location

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
            <Link
              href={`/uk/${regionSlug}`}
              className="hover:text-primary-600 transition-colors"
            >
              {venue.region}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{venue.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/uk/${regionSlug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {venue.region}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {venue.name}
                  </h1>
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{venue.address}</span>
                  </div>
                  <div className="text-primary-600 font-medium">
                    {venue.region}
                  </div>
                </div>

                {venue.rating && (
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold text-yellow-700">{venue.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {venue.description && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{venue.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}

                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                )}

                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </Link>
              </div>
            </div>

            {/* Features */}
            {venue.features && venue.features.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {venue.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <Map
                venues={[venue]}
                center={[venue.latitude, venue.longitude]}
                height="400px"
                zoom={15}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-gray-900">{venue.region}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Address</span>
                  <p className="text-gray-900">{venue.address}</p>
                </div>
                {venue.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <p className="text-gray-900">{venue.phone}</p>
                  </div>
                )}
                {venue.rating && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-900">{venue.rating.toFixed(1)} / 5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Venues */}
            {nearbyVenues.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  More in {venue.region}
                </h3>
                <div className="space-y-4">
                  {nearbyVenues.slice(0, 3).map((nearbyVenue) => (
                    <Link
                      key={nearbyVenue.id}
                      href={`/uk/${regionSlug}/${createSlug(nearbyVenue.name)}`}
                      className="block group"
                    >
                      <div className="border-b border-gray-100 pb-3">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {nearbyVenue.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {nearbyVenue.address}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/uk/${regionSlug}`}
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium mt-4"
                >
                  View all venues in {venue.region}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  try {
    // Get all venues with their regions
    const { data: venues } = await supabase
      .from('venues')
      .select('name, region')

    const { data: regions } = await supabase
      .from('regions')
      .select('name, slug')

    if (!venues || !regions) return []

    // Create mapping of region name to slug
    const regionSlugs = regions.reduce((acc, region) => {
      acc[region.name] = region.slug
      return acc
    }, {} as Record<string, string>)

    // Generate static params for all venue pages
    return venues.map((venue) => {
      const locationSlug = regionSlugs[venue.region] || 'other'
      const venueSlug = createSlug(venue.name)

      return {
        location: locationSlug,
        venue: venueSlug
      }
    })
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}