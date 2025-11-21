'use client'

import dynamic from 'next/dynamic'

// Dynamically import the entire react-leaflet components with SSR disabled
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg flex items-center justify-center h-full">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
})

interface Venue {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  website?: string | null
}

interface MapProps {
  venues: Venue[]
  center?: [number, number]
  zoom?: number
  height?: string
}

export default function Map({ venues, center = [54.7, -2.5], zoom = 6, height = '400px' }: MapProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <LeafletMap venues={venues} center={center} zoom={zoom} />
    </div>
  )
}