// app/api/files/upload/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.ms-excel',
  'text/csv',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const collectionId = formData.get('collectionId') as string
    const description = formData.get('description') as string

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed', allowedTypes: ALLOWED_FILE_TYPES },
        { status: 400 }
      )
    }

    // Generate unique file path
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath)

    // Create database record
    const { data: fileRecord, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: filePath,
        public_url: urlData.publicUrl,
        collection_id: collectionId || null,
        description: description || null,
        processing_status: 'pending',
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error creating file record:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('user-files').remove([filePath])
      return NextResponse.json(
        { error: 'Failed to create file record' },
        { status: 500 }
      )
    }

    // Start processing in background (if needed)
    // This could trigger text extraction, thumbnail generation, etc.
    await processFileInBackground(supabase, fileRecord.id, file.type)

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: fileRecord,
    })
  } catch (error) {
    console.error('File upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Background processing function
async function processFileInBackground(
  supabase: any,
  fileId: string,
  fileType: string
) {
  try {
    // Update status to processing
    await supabase
      .from('uploaded_files')
      .update({ processing_status: 'processing' })
      .eq('id', fileId)

    // Add processing logic here based on file type
    // For example: text extraction, thumbnail generation, etc.

    // Update status to completed
    await supabase
      .from('uploaded_files')
      .update({
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', fileId)
  } catch (error) {
    console.error('Error processing file:', error)
    // Update status to failed
    await supabase
      .from('uploaded_files')
      .update({
        processing_status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', fileId)
  }
}