// app/api/search/history/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve search history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get search history
    const { data: history, error: historyError, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (historyError) {
      console.error('Error fetching search history:', historyError)
      return NextResponse.json(
        { error: 'Failed to fetch search history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      history: history || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Search history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Clear search history
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

    if (searchId) {
      // Delete specific search
      const { error: deleteError } = await supabase
        .from('search_history')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Error deleting search:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete search' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'Search deleted successfully' })
    } else {
      // Clear all history
      const { error: deleteError } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Error clearing search history:', deleteError)
        return NextResponse.json(
          { error: 'Failed to clear search history' },
          { status: 500 }
        )
      }

      return NextResponse.json({ message: 'Search history cleared successfully' })
    }
  } catch (error) {
    console.error('Search history delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}