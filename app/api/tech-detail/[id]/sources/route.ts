// app/api/tech-detail/[id]/sources/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List sources with pagination and filtering
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const size = parseInt(searchParams.get('size') || '20')
    const type = searchParams.get('type')
    const confidence = searchParams.get('confidence')
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    let query = supabase
      .from('technology_sources')
      .select('*', { count: 'exact' })
      .eq('technology_id', id)

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }
    if (confidence) {
      query = query.eq('confidence', confidence)
    }

    // Apply sorting
    const ascending = sortOrder === 'asc'
    if (sortBy === 'date') {
      query = query.order('date', { ascending })
    } else if (sortBy === 'impact') {
      query = query.order('impact_score', { ascending })
    } else if (sortBy === 'citations') {
      query = query.order('citation_count', { ascending })
    }

    // Apply pagination
    const start = (page - 1) * size
    const end = start + size - 1
    query = query.range(start, end)

    const { data: sources, error, count } = await query

    if (error) {
      console.error('Error fetching sources:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sources' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      techId: id,
      sources: sources || [],
      total: count || 0,
      page,
      pageSize: size,
    })
  } catch (error) {
    console.error('Sources API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}