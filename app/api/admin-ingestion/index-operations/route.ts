// app/api/admin-ingestion/index-operations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('index_operations')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching index operations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch index operations', details: error.message },
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

    const operationData = {
      type: body.type,
      status: 'pending',
      affected_documents: 0,
      progress: 0,
    };

    const { data, error } = await supabase
      .from('index_operations')
      .insert([operationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating index operation:', error);
      return NextResponse.json(
        { error: 'Failed to create index operation', details: error.message },
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