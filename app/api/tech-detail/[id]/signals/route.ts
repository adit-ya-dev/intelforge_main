// app/api/tech-detail/[id]/signals/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve signal data for technology
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

    // Get all signal datapoints for this technology
    const { data: signals, error } = await supabase
      .from('signal_datapoints')
      .select('*')
      .eq('technology_id', id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching signals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch signals' },
        { status: 500 }
      )
    }

    // Group signals by type
    const groupedSignals: any = {
      patents: { timeseries: [], total: 0, growth: 0 },
      papers: { timeseries: [], total: 0, citations: 0 },
      funding: { timeseries: [], totalAmount: 0, rounds: 0 },
      google_trends: { timeseries: [], currentInterest: 0 },
      startups: { timeseries: [], total: 0, activeCount: 0 },
    }

    signals?.forEach((signal: any) => {
      const dataPoint = {
        date: signal.date,
        value: parseFloat(signal.value),
        confidence: signal.confidence,
      }

      if (groupedSignals[signal.signal_type]) {
        groupedSignals[signal.signal_type].timeseries.push(dataPoint)
      }
    })

    // Calculate totals and growth for each signal type
    Object.keys(groupedSignals).forEach((signalType) => {
      const timeseries = groupedSignals[signalType].timeseries
      if (timeseries.length > 0) {
        const latestValue = timeseries[timeseries.length - 1].value
        const previousValue = timeseries.length > 1 ? timeseries[timeseries.length - 2].value : 0

        if (signalType === 'patents') {
          groupedSignals[signalType].total = latestValue
          groupedSignals[signalType].growth = previousValue > 0 
            ? ((latestValue - previousValue) / previousValue * 100).toFixed(1)
            : 0
        } else if (signalType === 'papers') {
          groupedSignals[signalType].total = latestValue
          groupedSignals[signalType].citations = latestValue * 28 // Approximate
        } else if (signalType === 'funding') {
          groupedSignals[signalType].totalAmount = latestValue
          groupedSignals[signalType].rounds = timeseries.length
        } else if (signalType === 'google_trends') {
          groupedSignals[signalType].currentInterest = latestValue
        } else if (signalType === 'startups') {
          groupedSignals[signalType].total = latestValue
          groupedSignals[signalType].activeCount = Math.floor(latestValue * 0.8)
        }
      }
    })

    return NextResponse.json({
      techId: id,
      signals: groupedSignals,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Signals API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}