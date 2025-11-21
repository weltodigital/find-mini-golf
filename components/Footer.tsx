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
            <p className="text-sm text-gray-400 leading-relaxed">
              Find the best mini golf venues across the UK. From adventure golf to crazy golf,
              discover your next fun day out.
            </p>
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Find Mini Golf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}