import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Find Mini Golf</h1>
                <p className="text-xs text-gray-400">Near You</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Find the best mini golf venues across the UK. From adventure golf to crazy golf,
              discover your next fun day out.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/uk" className="hover:text-primary-400 transition-colors">All Venues</Link></li>
              <li><Link href="/uk" className="hover:text-primary-400 transition-colors">UK Locations</Link></li>
              <li><Link href="/search" className="hover:text-primary-400 transition-colors">Search</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Popular Locations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/uk/london" className="hover:text-primary-400 transition-colors">London</Link></li>
              <li><Link href="/uk/manchester" className="hover:text-primary-400 transition-colors">Manchester</Link></li>
              <li><Link href="/uk/birmingham" className="hover:text-primary-400 transition-colors">Birmingham</Link></li>
              <li><Link href="/uk/glasgow" className="hover:text-primary-400 transition-colors">Glasgow</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Find Mini Golf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}