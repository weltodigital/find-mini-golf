'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'

// Fix for default markers
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Venue {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  website?: string | null
}

interface LeafletMapProps {
  venues: Venue[]
  center: [number, number]
  zoom: number
}

export default function LeafletMap({ venues, center, zoom }: LeafletMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {venues.map((venue) => (
        <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{venue.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{venue.address}</p>
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Visit Website
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}