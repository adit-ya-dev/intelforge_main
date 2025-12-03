// app/api/search/saved/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve saved searches
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get saved searches
    const { data: savedSearches, error: savedError, count } = await supabase
      .from('saved_searches')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (savedError) {
      console.error('Error fetching saved searches:', savedError)
      return NextResponse.json(
        { error: 'Failed to fetch saved searches' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      savedSearches: savedSearches || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Saved searches API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create saved search/alert
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, query, search_mode, filters, alert_frequency } = body

    // Validate input
    if (!name || !query) {
      return NextResponse.json(
        { error: 'Name and query are required' },
        { status: 400 }
      )
    }

    // Create saved search
    const { data: savedSearch, error: insertError } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name,
        query,
        search_mode: search_mode || 'semantic',
        filters: filters || {},
        alert_frequency: alert_frequency || 'none',
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating saved search:', insertError)
      return NextResponse.json(
        { error: 'Failed to create saved search', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Saved search created successfully',
      savedSearch,
    })
  } catch (error) {
    console.error('Saved search create API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update saved search
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, query, search_mode, filters, alert_frequency, is_active } = body

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    if (name !== undefined) updates.name = name
    if (query !== undefined) updates.query = query
    if (search_mode !== undefined) updates.search_mode = search_mode
    if (filters !== undefined) updates.filters = filters
    if (alert_frequency !== undefined) updates.alert_frequency = alert_frequency
    if (is_active !== undefined) updates.is_active = is_active

    // Update saved search
    const { data: savedSearch, error: updateError } = await supabase
      .from('saved_searches')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating saved search:', updateError)
      return NextResponse.json(
        { error: 'Failed to update saved search' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Saved search updated successfully',
      savedSearch,
    })
  } catch (error) {
    console.error('Saved search update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete saved search
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const searchId = searchParams.get('id')

    if (!searchId) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      )
    }

    // Delete saved search
    const { error: deleteError } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting saved search:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete saved search' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Saved search deleted successfully' })
  } catch (error) {
    console.error('Saved search delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}