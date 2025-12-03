// app/api/tech-detail/[id]/comments/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List comments
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

    // Get comments with user info
    const { data: comments, error } = await supabase
      .from('technology_comments')
      .select(`
        *,
        user:auth.users(id, email)
      `)
      .eq('technology_id', id)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment: any) => {
        const { data: replies } = await supabase
          .from('technology_comments')
          .select(`
            *,
            user:auth.users(id, email)
          `)
          .eq('parent_comment_id', comment.id)
          .order('created_at', { ascending: true })

        return {
          ...comment,
          replies: replies || [],
        }
      })
    )

    return NextResponse.json({
      techId: id,
      comments: commentsWithReplies,
    })
  } catch (error) {
    console.error('Comments GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create comment
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
    const { content, parentCommentId, attachedSourceIds } = body

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const { data: comment, error } = await supabase
      .from('technology_comments')
      .insert({
        technology_id: id,
        user_id: user.id,
        content: content.trim(),
        parent_comment_id: parentCommentId || null,
        attached_source_ids: attachedSourceIds || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Comment created successfully',
      comment,
    })
  } catch (error) {
    console.error('Comments POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update comment
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { commentId, content, isPinned } = body

    const updates: any = {}
    if (content !== undefined) updates.content = content
    if (isPinned !== undefined) updates.is_pinned = isPinned

    const { data: comment, error } = await supabase
      .from('technology_comments')
      .update(updates)
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json(
        { error: 'Failed to update comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Comment updated successfully',
      comment,
    })
  } catch (error) {
    console.error('Comments PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('technology_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Comments DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}