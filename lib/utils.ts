import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return Math.round(distance * 100) / 100
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function getRegionSlug(regionName: string): string {
  // Map region names to their slugs (based on current regions table)
  const regionSlugs: Record<string, string> = {
    'London': 'london',
    'Glasgow': 'glasgow',
    'Birmingham': 'birmingham',
    'Manchester': 'manchester',
    'Brighton': 'brighton',
    'Bournemouth': 'bournemouth',
    'Bristol': 'bristol',
    'Canterbury': 'canterbury',
    'Cheltenham': 'cheltenham',
    'Chichester': 'chichester',
    'Edinburgh': 'edinburgh',
    'Leicester': 'leicester',
    'Milton Keynes': 'milton-keynes',
    'Oxford': 'oxford',
    'Portsmouth': 'portsmouth',
    'Reading': 'reading',
    'Southampton': 'southampton',
    'Wolverhampton': 'wolverhampton',
    'Norwich': 'norwich',
    'Nottingham': 'nottingham',
    'Liverpool': 'liverpool',
    'Poole': 'poole',
    'Blackpool': 'blackpool',
    'Cardiff': 'cardiff',
    'Eastbourne': 'eastbourne',
    'Great Yarmouth': 'great-yarmouth',
    'Newcastle upon Tyne': 'newcastle-upon-tyne',
    'Southend': 'southend',
    'Stoke-on-Trent': 'stoke-on-trent',
    'York': 'york',
    'Leeds': 'leeds',
    'Sheffield': 'sheffield',
    'Southsea': 'southsea',
    'Hove': 'hove',
    'Bath': 'bath',
    'Preston': 'preston',
    'Coventry': 'coventry',
    'Derby': 'derby',
    'Kingston upon Hull': 'kingston-upon-hull',
    // New regions created from "Other" category
    'Herne Bay': 'herne-bay',
    'Bognor Regis': 'bognor-regis',
    'Golf': 'golf',
    'Henley-on-Thames': 'henley-on-thames',
    'Wokingham': 'wokingham',
    'Bracknell': 'bracknell',
    'Romford': 'romford',
    'Edgware': 'edgware',
    'Barnet': 'barnet',
    'Brierley Hill': 'brierley-hill',
    'Walsall': 'walsall',
    'Gateshead': 'gateshead',
    'North Shields': 'north-shields',
    'South Shields': 'south-shields',
    'Morpeth': 'morpeth',
    'Bolton': 'bolton',
    'Wembley': 'wembley',
    'Harrow': 'harrow',
    'Northolt': 'northolt',
    'Hounslow': 'hounslow',
    'Croydon': 'croydon',
    'New Malden': 'new-malden',
    'West Wickham': 'west-wickham',
    'Tewkesbury': 'tewkesbury',
    'Cambridge': 'cambridge',
    'Royston': 'royston',
    'Bury': 'bury',
    'Wirral': 'wirral',
    'Saint Helens': 'saint-helens',
    'Ellesmere Port': 'ellesmere-port',
    'Rotherham': 'rotherham',
    'Bradford': 'bradford',
    'Belfast': 'belfast',
    'Newtownabbey': 'newtownabbey',
    'Ballyclare': 'ballyclare',
    'Swindon': 'swindon',
    'Watford': 'watford',
    'Bushey': 'bushey',
    'Blofield': 'blofield',
    'Cromer': 'cromer',
    'Peterborough': 'peterborough',
    'Lincoln': 'lincoln',
    'Daisy Made Mini Golf': 'daisy-made-mini-golf',
    'Plymouth': 'plymouth',
    'Saltash': 'saltash',
    'Hastings': 'hastings',
    'Chelmsford': 'chelmsford',
    'Maldon': 'maldon',
    'Brentwood': 'brentwood',
    'Colchester': 'colchester',
    'Worcester': 'worcester',
    'Billericay': 'billericay',
    'Rushden': 'rushden',
    'Livingston': 'livingston',
    'Dunfermline': 'dunfermline',
    'Margate': 'margate',
    'Broadstairs': 'broadstairs',
    'Ramsgate': 'ramsgate',
    'Birchington': 'birchington',
    'Exeter': 'exeter',
    'Dawlish': 'dawlish',
    'Teignmouth': 'teignmouth',
    'Torquay': 'torquay',
    'Paignton': 'paignton',
    'Aberdeen': 'aberdeen',
    'Weymouth': 'weymouth',
    'Swansea': 'swansea',
    'Port Talbot': 'port-talbot',
    'Rochdale': 'rochdale',
    'Wigan': 'wigan',
    'Newquay': 'newquay',
    'Middlesbrough': 'middlesbrough',
    'Redcar': 'redcar',
    'Saltburn-by-the-Sea': 'saltburn-by-the-sea',
    'Sunderland': 'sunderland',
    'Sandown': 'sandown',
    'Shanklin': 'shanklin',
    'Maidstone': 'maidstone',
    'Halifax': 'halifax',
    'Basildon': 'basildon',
    'Crawley': 'crawley',
    'Warrington': 'warrington'
  }

  return regionSlugs[regionName] || createSlug(regionName)
}