// app/api/admin-ingestion/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const connectorId = searchParams.get('connector_id');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('ingestion_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (level && level !== 'all') {
      query = query.eq('level', level);
    }

    if (connectorId) {
      query = query.eq('connector_id', connectorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch logs', details: error.message },
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

    const logData = {
      level: body.level,
      connector_id: body.connector_id,
      message: body.message,
      details: body.details || null,
      document_id: body.document_id || null,
      retryable: body.retryable || false,
      retry_count: body.retry_count || 0,
      max_retries: body.max_retries || 3,
    };

    const { data, error } = await supabase
      .from('ingestion_logs')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('Error creating log:', error);
      return NextResponse.json(
        { error: 'Failed to create log', details: error.message },
        { status: 500 }
      );
    }

    // Update connector error count if level is error
    if (body.level === 'error' && body.connector_id) {
      const { data: connector } = await supabase
        .from('data_connectors')
        .select('error_count')
        .eq('id', body.connector_id)
        .single();

      if (connector) {
        await supabase
          .from('data_connectors')
          .update({ error_count: connector.error_count + 1 })
          .eq('id', body.connector_id);
      }
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