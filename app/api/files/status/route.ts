// app/api/files/status/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Get file processing status
export async function GET(request: NextRequest) {
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

    // Get file with processing status
    const { data: file, error: fileError } = await supabase
      .from('uploaded_files')
      .select('id, file_name, processing_status, processed_at, error_message, metadata')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      file,
      status: file.processing_status,
      processedAt: file.processed_at,
      error: file.error_message,
    })
  } catch (error) {
    console.error('File status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update file processing status (internal use)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, processing_status, error_message, metadata } = body

    if (!id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = { updated_at: new Date().toISOString() }
    if (processing_status !== undefined) {
      updates.processing_status = processing_status
      if (processing_status === 'completed') {
        updates.processed_at = new Date().toISOString()
      }
    }
    if (error_message !== undefined) updates.error_message = error_message
    if (metadata !== undefined) updates.metadata = metadata

    // Update file
    const { data: file, error: updateError } = await supabase
      .from('uploaded_files')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating file status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update file status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'File status updated successfully',
      file,
    })
  } catch (error) {
    console.error('File status update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}