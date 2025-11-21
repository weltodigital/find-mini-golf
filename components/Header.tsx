'use client'

import Link from 'next/link'
import Image from 'next/image'

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

          <Link href="/uk" className="btn-primary">
            UK Mini Golf
          </Link>
        </div>
      </div>
    </header>
  )
}