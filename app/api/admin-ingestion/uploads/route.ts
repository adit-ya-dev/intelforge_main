// app/api/admin-ingestion/uploads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('document_uploads')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching uploads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch uploads', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const uploadData = {
      file_name: body.file_name,
      file_type: body.file_type,
      file_size: body.file_size,
      status: 'uploading',
      progress: 0,
      documents_extracted: 0,
      mapping_template: body.mapping_template || null,
      errors: [],
    };

    const { data, error } = await supabase
      .from('document_uploads')
      .insert([uploadData])
      .select()
      .single();

    if (error) {
      console.error('Error creating upload:', error);
      return NextResponse.json(
        { error: 'Failed to create upload', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}