// app/api/search/recent/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Get recent searches for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '5')

    // Get recent unique searches
    const { data: recentSearches, error: recentError } = await supabase
      .from('search_history')
      .select('query, search_mode, created_at, result_count')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit * 2) // Get more to filter duplicates

    if (recentError) {
      console.error('Error fetching recent searches:', recentError)
      return NextResponse.json(
        { error: 'Failed to fetch recent searches' },
        { status: 500 }
      )
    }

    // Deduplicate by query
    const uniqueSearches = Array.from(
      new Map((recentSearches || []).map(s => [s.query, s])).values()
    ).slice(0, limit)

    return NextResponse.json({
      recentSearches: uniqueSearches,
    })
  } catch (error) {
    console.error('Recent searches API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}