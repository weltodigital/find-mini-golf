import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Find Mini Golf"
                width={160}
                height={80}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Find the best mini golf venues across the UK. From adventure golf to crazy golf,
              discover your next fun day out.
            </p>
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                <span className="text-white font-medium">Contact:</span>{' '}
                <a href="mailto:findminigolf@weltodigital.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                  findminigolf@weltodigital.com
                </a>
              </p>
              <p className="text-xs">
                Add your venue? Email us above!
              </p>
            </div>
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
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Find Mini Golf. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <a href="/sitemap.xml" className="hover:text-primary-400 transition-colors" target="_blank" rel="noopener">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}