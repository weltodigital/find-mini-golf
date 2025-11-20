import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let query = supabase
      .from('venues')
      .select('*', { count: 'exact' })

    // Apply filters
    if (region) {
      query = query.eq('region', region)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,region.ilike.%${search}%`)
    }

    // Apply pagination and ordering
    const { data: venues, error, count } = await query
      .order('name')
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      venues: venues || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { data: venue, error } = await supabase
      .from('venues')
      .insert({
        name: data.name,
        description: data.description,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        website: data.website,
        phone: data.phone,
        region: data.region,
        features: data.features || []
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error('Error creating venue:', error)
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    )
  }
}