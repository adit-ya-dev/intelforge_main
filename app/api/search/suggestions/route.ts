// app/api/search/suggestions/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Get search suggestions/autocomplete
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      // Return trending/popular searches if no query
      const { data: trending, error: trendingError } = await supabase
        .from('search_suggestions')
        .select('*')
        .eq('type', 'trending')
        .order('popularity', { ascending: false })
        .limit(limit)

      if (trendingError) {
        console.error('Error fetching trending searches:', trendingError)
        return NextResponse.json({ suggestions: [] })
      }

      return NextResponse.json({
        suggestions: trending || [],
        type: 'trending',
      })
    }

    // Get suggestions based on query
    const { data: suggestions, error: suggestionsError } = await supabase
      .from('search_suggestions')
      .select('*')
      .ilike('suggestion', `%${query}%`)
      .order('popularity', { ascending: false })
      .limit(limit)

    if (suggestionsError) {
      console.error('Error fetching suggestions:', suggestionsError)
      return NextResponse.json({ suggestions: [] })
    }

    // Also get user's recent searches matching the query
    const { data: recentSearches, error: recentError } = await supabase
      .from('search_history')
      .select('query, created_at')
      .eq('user_id', user.id)
      .ilike('query', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentError) {
      console.error('Error fetching recent searches:', recentError)
    }

    // Combine and deduplicate suggestions
    const combinedSuggestions = [
      ...(recentSearches || []).map(s => ({
        suggestion: s.query,
        type: 'recent' as const,
        popularity: 0,
      })),
      ...(suggestions || []),
    ]

    // Remove duplicates
    const uniqueSuggestions = Array.from(
      new Map(combinedSuggestions.map(s => [s.suggestion.toLowerCase(), s])).values()
    ).slice(0, limit)

    return NextResponse.json({
      suggestions: uniqueSuggestions,
      query,
    })
  } catch (error) {
    console.error('Search suggestions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update suggestion popularity (called after user selects a suggestion)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { suggestion } = body

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion is required' },
        { status: 400 }
      )
    }

    // Increment popularity or create new suggestion
    const { data: existing, error: fetchError } = await supabase
      .from('search_suggestions')
      .select('*')
      .eq('suggestion', suggestion)
      .single()

    if (existing) {
      // Increment popularity
      const { error: updateError } = await supabase
        .from('search_suggestions')
        .update({ popularity: existing.popularity + 1 })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Error updating suggestion:', updateError)
      }
    } else {
      // Create new suggestion
      const { error: insertError } = await supabase
        .from('search_suggestions')
        .insert({
          suggestion,
          type: 'user_generated',
          popularity: 1,
        })

      if (insertError) {
        console.error('Error creating suggestion:', insertError)
      }
    }

    return NextResponse.json({ message: 'Suggestion updated successfully' })
  } catch (error) {
    console.error('Search suggestions update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}