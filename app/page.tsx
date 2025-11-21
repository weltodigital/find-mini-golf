import Link from 'next/link'
import { Search, MapPin, Star, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Map from '@/components/Map'
import { supabase } from '@/lib/supabase'
import { createSlug, getRegionSlug } from '@/lib/utils'

async function getFeaturedVenues() {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, address, latitude, longitude, region, website, rating')
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .limit(6)

    if (error) throw error
    return venues || []
  } catch (error) {
    console.error('Error fetching featured venues:', error)
    return []
  }
}

async function getStats() {
  try {
    const [venuesResult, regionsResult] = await Promise.all([
      supabase.from('venues').select('id', { count: 'exact', head: true }),
      supabase.from('regions').select('id', { count: 'exact', head: true })
    ])

    const venueCount = venuesResult.count || 0
    const regionCount = regionsResult.count || 0

    return [
      { label: 'Mini Golf Venues', value: `${venueCount}+`, icon: MapPin },
      { label: 'Regions Covered', value: `${regionCount}+`, icon: Star },
      { label: 'Happy Visitors', value: '10K+', icon: Users }
    ]
  } catch (error) {
    console.error('Error fetching stats:', error)
    return [
      { label: 'Mini Golf Venues', value: '500+', icon: MapPin },
      { label: 'Regions Covered', value: '120+', icon: Star },
      { label: 'Happy Visitors', value: '10K+', icon: Users }
    ]
  }
}

export default async function HomePage() {
  const featuredVenues = await getFeaturedVenues()
  const stats = await getStats()
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Mini Golf
            <span className="block text-primary-200">Near You</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover the best mini golf venues across the UK. From adventure golf to crazy golf,
            find your perfect day out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/uk" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Venues Near You
            </Link>
            <Link href="/uk" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Browse All Venues
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Explore Venues on the Map
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            See all our featured mini golf venues across the UK. Click on any marker to learn more
            about that location.
          </p>
          <div className="max-w-6xl mx-auto">
            <Map venues={featuredVenues} height="500px" />
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Featured Venues
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Check out some of our most popular mini golf venues across the UK.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVenues.map((venue) => {
              const regionSlug = getRegionSlug(venue.region)
              const venueSlug = createSlug(venue.name)
              const venueUrl = `/uk/${regionSlug}/${venueSlug}`

              return (
                <div key={venue.id} className="card p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <Link href={venueUrl} className="hover:text-primary-600 transition-colors">
                      {venue.name}
                    </Link>
                  </h3>
                  <div className="flex items-start gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-primary-600">{venue.region}</span>
                    {venue.rating && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{venue.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <Link href={venueUrl} className="btn-primary w-full text-center">
                    View Details
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/uk" className="btn-secondary">
              View All Venues
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}