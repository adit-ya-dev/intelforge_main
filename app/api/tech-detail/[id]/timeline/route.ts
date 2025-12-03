// app/api/tech-detail/[id]/timeline/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve timeline events
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
    const types = searchParams.get('types')?.split(',')
    const minImpactScore = searchParams.get('minImpactScore')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Build query
    let query = supabase
      .from('timeline_events')
      .select('*')
      .eq('technology_id', id)
      .order('date', { ascending: true })

    // Apply filters
    if (types && types.length > 0) {
      query = query.in('type', types)
    }
    if (minImpactScore) {
      query = query.gte('impact_score', parseInt(minImpactScore))
    }
    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }
    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching timeline events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch timeline events' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      techId: id,
      events: events || [],
      total: events?.length || 0,
    })
  } catch (error) {
    console.error('Timeline API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}