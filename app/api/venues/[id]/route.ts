import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: venue, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Venue not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(venue)
  } catch (error) {
    console.error('Error fetching venue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venue' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const updateData: any = {}
    if (data.name) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.address) updateData.address = data.address
    if (data.latitude) updateData.latitude = parseFloat(data.latitude)
    if (data.longitude) updateData.longitude = parseFloat(data.longitude)
    if (data.website !== undefined) updateData.website = data.website
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.region) updateData.region = data.region
    if (data.features) updateData.features = data.features
    if (data.rating) updateData.rating = parseFloat(data.rating)

    const { data: venue, error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(venue)
  } catch (error) {
    console.error('Error updating venue:', error)
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting venue:', error)
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500 }
    )
  }
}