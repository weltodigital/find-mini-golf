'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Find Mini Golf"
              width={160}
              height={80}
              className="h-12 w-auto"
              priority
            />
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

          <Link href="/uk" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </div>
      </div>
    </header>
  )
}