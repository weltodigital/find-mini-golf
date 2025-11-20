import Link from 'next/link'
import { MapPin, ExternalLink, Star } from 'lucide-react'
import { createSlug, getRegionSlug } from '@/lib/utils'

interface Venue {
  id: string
  name: string
  address: string
  region: string
  website?: string | null
  rating?: number | null
}

interface VenueCardProps {
  venue: Venue
}

export default function VenueCard({ venue }: VenueCardProps) {
  const regionSlug = getRegionSlug(venue.region)
  const venueSlug = createSlug(venue.name)
  const venueUrl = `/uk/${regionSlug}/${venueSlug}`

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          <Link
            href={venueUrl}
            className="hover:text-primary-600 transition-colors"
          >
            {venue.name}
          </Link>
        </h3>
        {venue.rating && (
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <Star className="w-4 h-4 fill-current" />
            <span>{venue.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{venue.address}</span>
        </div>

        <div className="text-sm text-primary-600 font-medium">
          {venue.region}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={venueUrl}
          className="btn-primary text-sm"
        >
          View Details
        </Link>

        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Website</span>
          </a>
        )}
      </div>
    </div>
  )
}