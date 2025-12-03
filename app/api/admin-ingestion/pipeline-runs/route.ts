// app/api/admin-ingestion/pipeline-runs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const connectorId = searchParams.get('connector_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('pipeline_runs')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (connectorId) {
      query = query.eq('connector_id', connectorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pipeline runs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch pipeline runs', details: error.message },
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

    const runData = {
      connector_id: body.connector_id,
      connector_name: body.connector_name,
      status: 'running',
      documents_queued: body.documents_queued || 0,
      documents_processed: 0,
      documents_failed: 0,
      error_messages: [],
      throughput: 0,
      memory_usage: 0,
      cpu_usage: 0,
    };

    const { data, error } = await supabase
      .from('pipeline_runs')
      .insert([runData])
      .select()
      .single();

    if (error) {
      console.error('Error creating pipeline run:', error);
      return NextResponse.json(
        { error: 'Failed to create pipeline run', details: error.message },
        { status: 500 }
      );
    }

    // Create log entry
    await supabase.from('ingestion_logs').insert([
      {
        level: 'info',
        connector_id: body.connector_id,
        message: `Pipeline run started for "${body.connector_name}"`,
        retryable: false,
        retry_count: 0,
        max_retries: 3,
      },
    ]);

    // Update connector last_sync
    await supabase
      .from('data_connectors')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', body.connector_id);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}