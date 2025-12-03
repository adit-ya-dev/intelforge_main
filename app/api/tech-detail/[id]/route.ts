// app/api/tech-detail/[id]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Retrieve technology detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get technology metadata
    const { data: technology, error: techError } = await supabase
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

    // Get TRL history
    const { data: trlHistory, error: trlError } = await supabase
      .from('trl_history')
      .select('*')
      .eq('technology_id', id)
      .order('date', { ascending: true })

    if (trlError) {
      console.error('Error fetching TRL history:', trlError)
    }

    // Check if user is watching this technology
    const { data: watchData } = await supabase
      .from('user_watches')
      .select('id')
      .eq('user_id', user.id)
      .eq('technology_id', id)
      .single()

    // Get related technologies count
    const { count: relatedCount } = await supabase
      .from('technology_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('source_technology_id', id)

    // Get source count
    const { count: sourceCount } = await supabase
      .from('technology_sources')
      .select('*', { count: 'exact', head: true })
      .eq('technology_id', id)

    // Build response
    const response = {
      metadata: {
        id: technology.id,
        name: technology.name,
        canonicalSummary: technology.canonical_summary,
        domains: technology.domains || [],
        currentTRL: technology.current_trl,
        confidence: technology.confidence,
        lastUpdated: technology.updated_at,
        isWatched: !!watchData,
        relatedTechCount: relatedCount || 0,
        sourceCount: sourceCount || 0,
      },
      trlHistory: (trlHistory || []).map(entry => ({
        trl: entry.trl,
        date: entry.date,
        confidence: entry.confidence,
        evidenceIds: entry.evidence_ids || [],
        reasoning: entry.reasoning,
        keyMilestones: entry.key_milestones || [],
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Tech detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update technology metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { name, canonicalSummary, domains, currentTRL, confidence } = body

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    if (name !== undefined) updates.name = name
    if (canonicalSummary !== undefined) updates.canonical_summary = canonicalSummary
    if (domains !== undefined) updates.domains = domains
    if (currentTRL !== undefined) updates.current_trl = currentTRL
    if (confidence !== undefined) updates.confidence = confidence

    // Update technology
    const { data: technology, error: updateError } = await supabase
      .from('technologies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating technology:', updateError)
      return NextResponse.json(
        { error: 'Failed to update technology' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Technology updated successfully',
      technology,
    })
  } catch (error) {
    console.error('Tech update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}