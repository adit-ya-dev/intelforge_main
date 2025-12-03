// app/api/files/collections/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List collections
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get collections with file counts
    const { data: collections, error: collectionsError, count } = await supabase
      .from('file_collections')
      .select(`
        *,
        file_count:uploaded_files(count)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError)
      return NextResponse.json(
        { error: 'Failed to fetch collections' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      collections: collections || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Collections list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create collection
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, color } = body

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    // Create collection
    const { data: collection, error: insertError } = await supabase
      .from('file_collections')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description || null,
        color: color || '#3b82f6',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating collection:', insertError)
      return NextResponse.json(
        { error: 'Failed to create collection', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Collection created successfully',
      collection,
    })
  } catch (error) {
    console.error('Collection create API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update collection
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, color } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    if (name !== undefined) updates.name = name.trim()
    if (description !== undefined) updates.description = description
    if (color !== undefined) updates.color = color

    // Update collection
    const { data: collection, error: updateError } = await supabase
      .from('file_collections')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating collection:', updateError)
      return NextResponse.json(
        { error: 'Failed to update collection' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Collection updated successfully',
      collection,
    })
  } catch (error) {
    console.error('Collection update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete collection
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const collectionId = searchParams.get('id')

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    // Check if collection has files
    const { data: files, error: filesError } = await supabase
      .from('uploaded_files')
      .select('id')
      .eq('collection_id', collectionId)
      .limit(1)

    if (filesError) {
      console.error('Error checking collection files:', filesError)
    }

    // If collection has files, unassign them
    if (files && files.length > 0) {
      await supabase
        .from('uploaded_files')
        .update({ collection_id: null })
        .eq('collection_id', collectionId)
    }

    // Delete collection
    const { error: deleteError } = await supabase
      .from('file_collections')
      .delete()
      .eq('id', collectionId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting collection:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete collection' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Collection delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}