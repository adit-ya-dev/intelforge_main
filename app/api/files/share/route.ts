// app/api/files/share/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

// POST - Create shareable link
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { file_id, expires_in_days = 7, allow_download = true, password } = body

    // Validate input
    if (!file_id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Verify file ownership
    const { data: file, error: fileError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', file_id)
      .eq('user_id', user.id)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Generate unique share token
    const shareToken = randomBytes(32).toString('hex')

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expires_in_days)

    // Create share record
    const { data: share, error: shareError } = await supabase
      .from('file_shares')
      .insert({
        file_id,
        user_id: user.id,
        share_token: shareToken,
        expires_at: expiresAt.toISOString(),
        allow_download,
        password: password || null,
        access_count: 0,
      })
      .select()
      .single()

    if (shareError) {
      console.error('Error creating share:', shareError)
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      )
    }

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/shared/${shareToken}`

    return NextResponse.json({
      message: 'Share link created successfully',
      share: {
        ...share,
        share_url: shareUrl,
      },
    })
  } catch (error) {
    console.error('File share API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get user's shares
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get('file_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('file_shares')
      .select(`
        *,
        uploaded_files (
          id,
          file_name,
          file_type,
          file_size
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)

    if (fileId) {
      query = query.eq('file_id', fileId)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: shares, error: sharesError, count } = await query

    if (sharesError) {
      console.error('Error fetching shares:', sharesError)
      return NextResponse.json(
        { error: 'Failed to fetch shares' },
        { status: 500 }
      )
    }

    // Add share URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const sharesWithUrls = (shares || []).map(share => ({
      ...share,
      share_url: `${baseUrl}/shared/${share.share_token}`,
      is_expired: new Date(share.expires_at) < new Date(),
    }))

    return NextResponse.json({
      shares: sharesWithUrls,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('File shares list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Revoke share
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const shareId = searchParams.get('id')

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Delete share
    const { error: deleteError } = await supabase
      .from('file_shares')
      .delete()
      .eq('id', shareId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting share:', deleteError)
      return NextResponse.json(
        { error: 'Failed to revoke share' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Share revoked successfully' })
  } catch (error) {
    console.error('Share revoke API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}