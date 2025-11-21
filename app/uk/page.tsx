import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function getRegionsData() {
  try {
    // Get all regions with venue counts, excluding "Other"
    const { data: regions, error } = await supabase
      .from('regions')
      .select('*')
      .neq('name', 'Other')
      .order('name')

    if (error) throw error

    // Get venue counts for each region
    const regionsWithCounts = await Promise.all(
      (regions || []).map(async (region) => {
        const { count } = await supabase
          .from('venues')
          .select('*', { count: 'exact', head: true })
          .eq('region', region.name)

        return {
          ...region,
          venueCount: count || 0
        }
      })
    )

    // Filter out regions with no venues and sort by venue count
    return regionsWithCounts
      .filter(region => region.venueCount > 0)
      .sort((a, b) => b.venueCount - a.venueCount)

  } catch (error) {
    console.error('Error fetching regions:', error)
    return []
  }
}

async function getTotalStats() {
  try {
    const { count: totalVenues } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true })

    const { count: totalRegions } = await supabase
      .from('regions')
      .select('*', { count: 'exact', head: true })

    return {
      venues: totalVenues || 0,
      regions: totalRegions || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { venues: 0, regions: 0 }
  }
}

export const metadata = {
  title: 'Mini Golf Locations Across the UK | Find Mini Golf Near You',
  description: 'Explore mini golf venues across all UK locations. Find adventure golf, crazy golf, and mini golf courses in your area with our comprehensive directory.',
  openGraph: {
    title: 'Mini Golf Locations Across the UK',
    description: 'Explore mini golf venues across all UK locations. Find adventure golf, crazy golf, and mini golf courses in your area.',
    type: 'website'
  }
}

export default async function UKLocationsPage() {
  const [regions, stats] = await Promise.all([
    getRegionsData(),
    getTotalStats()
  ])

  const popularRegions = regions.slice(0, 6) // Top 6 for featured section
  const allRegions = regions

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
            <span className="text-gray-900 font-medium">UK Locations</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mini Golf Locations Across the UK
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover amazing mini golf venues in cities and towns across the United Kingdom.
            From bustling cities to charming coastal towns, find your perfect mini golf adventure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats.venues}</div>
              <div className="text-sm text-gray-600">Total Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats.regions}</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">4.5★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">100%</div>
              <div className="text-sm text-gray-600">Free to Browse</div>
            </div>
          </div>
        </div>

        {/* Popular Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Mini Golf Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularRegions.map((region) => (
              <Link
                key={region.id}
                href={`/uk/${region.slug}`}
                className="card p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {region.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>

                <div className="flex items-center gap-2 text-primary-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{region.venueCount} venues</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Locations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            All UK Locations
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <p className="text-gray-600">
                Browse mini golf venues by location. Click on any location to see all available venues in that area.
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {allRegions.map((region) => (
                <Link
                  key={region.id}
                  href={`/uk/${region.slug}`}
                  className="block p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {region.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {region.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{region.venueCount} venues</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-500 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Can't Find Your Location?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            We're always adding new venues to our directory. If you know of a great mini golf venue
            that's not listed, let us know and we'll add it to help others discover it too.
          </p>
          <a href="mailto:findminigolf@weltodigital.com" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-block">
            findminigolf@weltodigital.com
          </a>
        </section>
      </div>

      <Footer />
    </div>
  )
}