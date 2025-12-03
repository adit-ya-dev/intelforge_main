// app/api/admin-ingestion/connectors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query = supabase
      .from('data_connectors')
      .select('*')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching connectors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch connectors', details: error.message },
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

    // Calculate next sync time
    const nextSync = new Date();
    nextSync.setMinutes(nextSync.getMinutes() + (body.polling_interval || 60));

    const connectorData = {
      name: body.name,
      type: body.type,
      provider: body.provider,
      status: 'configuring',
      api_endpoint: body.api_endpoint || '',
      description: body.description || null,
      icon: body.icon || '📄',
      requires_auth: body.requires_auth || false,
      auth_type: body.auth_type || null,
      polling_interval: body.polling_interval || 60,
      next_sync: nextSync.toISOString(),
      config: body.config || {},
      capabilities: body.capabilities || [],
      health_score: 100,
    };

    const { data, error } = await supabase
      .from('data_connectors')
      .insert([connectorData])
      .select()
      .single();

    if (error) {
      console.error('Error creating connector:', error);
      return NextResponse.json(
        { error: 'Failed to create connector', details: error.message },
        { status: 500 }
      );
    }

    // Create initial log entry
    await supabase.from('ingestion_logs').insert([
      {
        level: 'info',
        connector_id: data.id,
        message: `Connector "${data.name}" created successfully`,
        retryable: false,
        retry_count: 0,
        max_retries: 3,
      },
    ]);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}