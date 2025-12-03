// app/api/search/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface SearchFilters {
  domain?: string[]
  trl?: string[]
  dateRange?: { from?: string; to?: string }
  country?: string[]
  sourceType?: string[]
  organization?: string[]
  fundingRange?: { min?: number; max?: number }
  confidence?: [number, number]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      query, 
      semantic = true, 
      filters = {}, 
      page = 1, 
      size = 20, 
      sortBy = 'relevance' 
    } = body

    // Validate input
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Save search to history
    await supabase.from('search_history').insert({
      user_id: user.id,
      query,
      search_mode: semantic ? 'semantic' : 'keyword',
      filters,
      result_count: 0, // Will update later
    })

    // Build base query
    let searchQuery = supabase
      .from('technology_data')
      .select('*', { count: 'exact' })

    // Apply filters
    const typedFilters = filters as SearchFilters

    if (typedFilters.domain && typedFilters.domain.length > 0) {
      searchQuery = searchQuery.in('domain', typedFilters.domain)
    }

    if (typedFilters.country && typedFilters.country.length > 0) {
      searchQuery = searchQuery.in('country', typedFilters.country)
    }

    if (typedFilters.sourceType && typedFilters.sourceType.length > 0) {
      searchQuery = searchQuery.in('type', typedFilters.sourceType)
    }

    if (typedFilters.trl && typedFilters.trl.length > 0) {
      // TRL filter mapping
      const trlRanges: number[] = []
      typedFilters.trl.forEach(range => {
        if (range.includes('1-3')) trlRanges.push(1, 2, 3)
        if (range.includes('4-6')) trlRanges.push(4, 5, 6)
        if (range.includes('7-9')) trlRanges.push(7, 8, 9)
      })
      if (trlRanges.length > 0) {
        searchQuery = searchQuery.in('trl', trlRanges)
      }
    }

    if (typedFilters.dateRange?.from) {
      searchQuery = searchQuery.gte('date', typedFilters.dateRange.from)
    }

    if (typedFilters.dateRange?.to) {
      searchQuery = searchQuery.lte('date', typedFilters.dateRange.to)
    }

    if (typedFilters.organization && typedFilters.organization.length > 0) {
      searchQuery = searchQuery.in('organization', typedFilters.organization)
    }

    if (typedFilters.fundingRange?.min !== undefined) {
      searchQuery = searchQuery.gte('funding_amount', typedFilters.fundingRange.min)
    }

    if (typedFilters.fundingRange?.max !== undefined) {
      searchQuery = searchQuery.lte('funding_amount', typedFilters.fundingRange.max)
    }

    // Search logic
    if (semantic) {
      // Semantic search using text search with ranking
      searchQuery = searchQuery
        .textSearch('fts', query, {
          type: 'websearch',
          config: 'english',
        })
    } else {
      // Keyword search using ilike
      searchQuery = searchQuery.or(
        `title.ilike.%${query}%,snippet.ilike.%${query}%,abstract.ilike.%${query}%,tags.cs.{${query}}`
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        searchQuery = searchQuery.order('date', { ascending: false })
        break
      case 'trl':
        searchQuery = searchQuery.order('trl', { ascending: false, nullsLast: true })
        break
      case 'citations':
        searchQuery = searchQuery.order('citations', { ascending: false, nullsLast: true })
        break
      case 'relevance':
      default:
        if (semantic) {
          searchQuery = searchQuery.order('relevance_score', { ascending: false })
        }
        break
    }

    // Pagination
    const from = (page - 1) * size
    const to = from + size - 1
    searchQuery = searchQuery.range(from, to)

    // Execute query
    const { data: results, error: searchError, count } = await searchQuery

    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json(
        { error: 'Failed to execute search', details: searchError.message },
        { status: 500 }
      )
    }

    // Update search history with result count
    await supabase
      .from('search_history')
      .update({ result_count: count || 0 })
      .eq('user_id', user.id)
      .eq('query', query)
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json({
      results: results || [],
      total: count || 0,
      page,
      size,
      totalPages: Math.ceil((count || 0) / size),
      hasMore: (count || 0) > page * size,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}