// app/api/files/download/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - Download file
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

    // Get signed URL for download
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('user-files')
      .createSignedUrl(file.storage_path, 60) // Valid for 60 seconds

    if (urlError || !signedUrlData) {
      console.error('Error creating signed URL:', urlError)
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      )
    }

    // Update download count
    await supabase
      .from('uploaded_files')
      .update({
        download_count: (file.download_count || 0) + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', fileId)

    // Return download URL
    return NextResponse.json({
      downloadUrl: signedUrlData.signedUrl,
      file: {
        id: file.id,
        name: file.file_name,
        type: file.file_type,
        size: file.file_size,
      },
    })
  } catch (error) {
    console.error('File download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}