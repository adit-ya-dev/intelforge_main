// app/api/tech-detail/[id]/watch/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST - Watch technology
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
    const { alertFrequency } = body

    // Check if already watching
    const { data: existing } = await supabase
      .from('user_watches')
      .select('id')
      .eq('user_id', user.id)
      .eq('technology_id', id)
      .single()

    if (existing) {
      // Update existing watch
      const { data: watch, error } = await supabase
        .from('user_watches')
        .update({ alert_frequency: alertFrequency || 'none' })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating watch:', error)
        return NextResponse.json(
          { error: 'Failed to update watch' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Watch updated successfully',
        watch,
      })
    }

    // Create new watch
    const { data: watch, error } = await supabase
      .from('user_watches')
      .insert({
        user_id: user.id,
        technology_id: id,
        alert_frequency: alertFrequency || 'none',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating watch:', error)
      return NextResponse.json(
        { error: 'Failed to create watch' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Watch created successfully',
      watch,
    })
  } catch (error) {
    console.error('Watch POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Unwatch technology
export async function DELETE(
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

    const { error } = await supabase
      .from('user_watches')
      .delete()
      .eq('user_id', user.id)
      .eq('technology_id', id)

    if (error) {
      console.error('Error deleting watch:', error)
      return NextResponse.json(
        { error: 'Failed to delete watch' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Watch deleted successfully',
    })
  } catch (error) {
    console.error('Watch DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}