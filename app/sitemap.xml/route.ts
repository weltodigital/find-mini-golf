import { supabase } from '@/lib/supabase'
import { createSlug, getRegionSlug } from '@/lib/utils'

export async function GET() {
  const baseUrl = 'https://findminigolf.com'

  try {
    // Get all venues
    const { data: venues } = await supabase
      .from('venues')
      .select('name, region, created_at, updated_at')
      .order('name')

    // Get all regions
    const { data: regions } = await supabase
      .from('regions')
      .select('name, slug, created_at, updated_at')
      .order('name')

    const now = new Date().toISOString()

    // Static pages
    const staticPages = [
      {
        url: `${baseUrl}/`,
        lastmod: now,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: `${baseUrl}/uk`,
        lastmod: now,
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: `${baseUrl}/privacy`,
        lastmod: now,
        changefreq: 'monthly',
        priority: '0.3'
      }
    ]

    // Region pages
    const regionPages = regions?.map(region => ({
      url: `${baseUrl}/uk/${region.slug}`,
      lastmod: region.updated_at || region.created_at || now,
      changefreq: 'weekly',
      priority: '0.8'
    })) || []

    // Venue pages
    const venuePages = venues?.map(venue => {
      const regionSlug = getRegionSlug(venue.region)
      const venueSlug = createSlug(venue.name)
      return {
        url: `${baseUrl}/uk/${regionSlug}/${venueSlug}`,
        lastmod: venue.updated_at || venue.created_at || now,
        changefreq: 'monthly',
        priority: '0.7'
      }
    }) || []

    // Combine all pages
    const allPages = [...staticPages, ...regionPages, ...venuePages]

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Fallback minimal sitemap
    const fallbackDate = new Date().toISOString()
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/uk</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${fallbackDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}