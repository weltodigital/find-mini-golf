'use client'

import Link from 'next/link'
import { MapPin, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Find Mini Golf</h1>
              <p className="text-xs text-gray-500">Near You</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/uk" className="text-gray-600 hover:text-primary-600 transition-colors">
              All Venues
            </Link>
            <Link href="/uk" className="text-gray-600 hover:text-primary-600 transition-colors">
              Locations
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
          </nav>

          <Link href="/search" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </div>
    </header>
  )
}