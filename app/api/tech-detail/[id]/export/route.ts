// app/api/tech-detail/[id]/export/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Generate and download report
export async function POST(
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
    const body = await request.json()
    const {
      format,
      includeCharts,
      includeSources,
      includeTimeline,
      includeForecast,
      maxSources,
    } = body

    // Validate format
    if (!['pdf', 'pptx', 'docx', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      )
    }

    // Get technology data
    const { data: tech, error: techError } = await supabase
      .from('technologies')
      .select('*')
      .eq('id', id)
      .single()

    if (techError) {
      console.error('Error fetching technology:', techError)
      return NextResponse.json(
        { error: 'Technology not found' },
        { status: 404 }
      )
    }

    // Gather all requested data
    const exportData: any = {
      metadata: tech,
      generatedAt: new Date().toISOString(),
      generatedBy: user.email,
    }

    if (includeSources) {
      const { data: sources } = await supabase
        .from('technology_sources')
        .select('*')
        .eq('technology_id', id)
        .limit(maxSources || 20)

      exportData.sources = sources
    }

    if (includeTimeline) {
      const { data: timeline } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('technology_id', id)
        .order('date', { ascending: true })

      exportData.timeline = timeline
    }

    if (includeForecast) {
      const { data: forecast } = await supabase
        .from('forecast_models')
        .select('*')
        .eq('technology_id', id)
        .order('last_run', { ascending: false })
        .limit(1)
        .single()

      exportData.forecast = forecast
    }

    // For JSON format, return data directly
    if (format === 'json') {
      return NextResponse.json(exportData)
    }

    // For other formats (PDF, PPTX, DOCX), in production you would:
    // 1. Use a library like pdfkit, officegen, or docx
    // 2. Generate the document
    // 3. Return as file download
    
    // For now, return success message with data
    return NextResponse.json({
      message: `Export initiated for format: ${format}`,
      exportId: `export-${Date.now()}`,
      format,
      dataIncluded: {
        charts: includeCharts,
        sources: includeSources,
        timeline: includeTimeline,
        forecast: includeForecast,
      },
      // In production, this would be a download URL
      downloadUrl: `/api/exports/export-${Date.now()}.${format}`,
    })
  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}