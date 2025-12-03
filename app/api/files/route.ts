// app/api/files/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List user's files
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const collectionId = searchParams.get('collectionId')
    const fileType = searchParams.get('type')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    let query = supabase
      .from('uploaded_files')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    // Apply filters
    if (collectionId) {
      query = query.eq('collection_id', collectionId)
    }

    if (fileType) {
      query = query.ilike('file_type', `${fileType}%`)
    }

    if (search) {
      query = query.or(
        `file_name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data: files, error: filesError, count } = await query

    if (filesError) {
      console.error('Error fetching files:', filesError)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    // Get file statistics
    const { data: stats, error: statsError } = await supabase
      .from('uploaded_files')
      .select('file_size, file_type')
      .eq('user_id', user.id)

    let totalSize = 0
    const typeCounts: Record<string, number> = {}

    if (stats && !statsError) {
      stats.forEach(file => {
        totalSize += file.file_size || 0
        const category = file.file_type?.split('/')[0] || 'other'
        typeCounts[category] = (typeCounts[category] || 0) + 1
      })
    }

    return NextResponse.json({
      files: files || [],
      total: count || 0,
      limit,
      offset,
      stats: {
        totalFiles: count || 0,
        totalSize,
        typeCounts,
      },
    })
  } catch (error) {
    console.error('Files list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete file
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Get file record
    const { data: file, error: fetchError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user-files')
      .remove([file.storage_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting file record:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('File delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update file metadata
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, file_name, description, collection_id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    if (file_name !== undefined) updates.file_name = file_name
    if (description !== undefined) updates.description = description
    if (collection_id !== undefined) updates.collection_id = collection_id

    // Update file
    const { data: file, error: updateError } = await supabase
      .from('uploaded_files')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating file:', updateError)
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'File updated successfully',
      file,
    })
  } catch (error) {
    console.error('File update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}