// app/api/tech-detail/[id]/forecast/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve forecast data
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

    // Get forecast model
    const { data: model, error: modelError } = await supabase
      .from('forecast_models')
      .select('*')
      .eq('technology_id', id)
      .order('last_run', { ascending: false })
      .limit(1)
      .single()

    if (modelError && modelError.code !== 'PGRST116') {
      console.error('Error fetching forecast model:', modelError)
      return NextResponse.json(
        { error: 'Failed to fetch forecast model' },
        { status: 500 }
      )
    }

    // Get S-curve data
    const { data: sCurve, error: sCurveError } = await supabase
      .from('scurve_data')
      .select('*')
      .eq('technology_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (sCurveError && sCurveError.code !== 'PGRST116') {
      console.error('Error fetching S-curve data:', sCurveError)
    }

    // Get hype curve data
    const { data: hypeCurve, error: hypeCurveError } = await supabase
      .from('hypecurve_data')
      .select('*')
      .eq('technology_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (hypeCurveError && hypeCurveError.code !== 'PGRST116') {
      console.error('Error fetching hype curve data:', hypeCurveError)
    }

    return NextResponse.json({
      techId: id,
      model: model || null,
      sCurve: sCurve ? {
        observed: sCurve.observed,
        fitted: sCurve.fitted,
        inflectionPoint: sCurve.inflection_point,
        maturityPhase: sCurve.maturity_phase,
      } : null,
      hypeCurve: hypeCurve ? {
        phases: hypeCurve.phases,
        currentPhase: hypeCurve.current_phase,
        peakDate: hypeCurve.peak_date,
        plateauEstimate: hypeCurve.plateau_estimate,
      } : null,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Forecast API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Run new forecast
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
    const { model, scenario } = body

    // In production, this would trigger actual forecasting logic
    // For now, return a success message
    return NextResponse.json({
      message: 'Forecast initiated',
      techId: id,
      model,
      scenario,
      status: 'processing',
    })
  } catch (error) {
    console.error('Forecast run API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}