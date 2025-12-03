// app/api/search/export/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Export search results
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resultIds, format = 'json' } = body

    // Validate input
    if (!resultIds || !Array.isArray(resultIds) || resultIds.length === 0) {
      return NextResponse.json(
        { error: 'Result IDs are required' },
        { status: 400 }
      )
    }

    // Get results
    const { data: results, error: resultsError } = await supabase
      .from('technology_data')
      .select('*')
      .in('id', resultIds)

    if (resultsError) {
      console.error('Error fetching results for export:', resultsError)
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      )
    }

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'No results found' },
        { status: 404 }
      )
    }

    // Format based on requested format
    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(results[0])
      const csvRows = [
        headers.join(','),
        ...results.map(row =>
          headers
            .map(header => {
              const value = row[header]
              // Escape quotes and wrap in quotes if contains comma
              const stringValue = String(value ?? '')
              return stringValue.includes(',') || stringValue.includes('"')
                ? `"${stringValue.replace(/"/g, '""')}"`
                : stringValue
            })
            .join(',')
        ),
      ]
      const csvContent = csvRows.join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="search-results-${Date.now()}.csv"`,
        },
      })
    } else {
      // Return as JSON
      return NextResponse.json({
        results,
        exportedAt: new Date().toISOString(),
        count: results.length,
      })
    }
  } catch (error) {
    console.error('Search export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}