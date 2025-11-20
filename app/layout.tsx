import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Find Mini Golf Near You | Mini Golf Directory',
  description: 'Find The Best Mini Golf Near You. Discover adventure golf courses, crazy golf venues, and mini golf locations across the UK.',
  keywords: 'mini golf, crazy golf, adventure golf, putt putt, golf courses, UK',
  openGraph: {
    title: 'Find Mini Golf Near You',
    description: 'Find The Best Mini Golf Near You',
    type: 'website',
    url: 'https://findminigolf.com'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}