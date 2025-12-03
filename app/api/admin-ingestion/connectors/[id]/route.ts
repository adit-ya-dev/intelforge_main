// app/api/admin-ingestion/connectors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('data_connectors')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Connector not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch connector', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('data_connectors')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update connector', details: error.message },
        { status: 500 }
      );
    }

    // Log the update
    await supabase.from('ingestion_logs').insert([
      {
        level: 'info',
        connector_id: params.id,
        message: `Connector "${data.name}" updated`,
        retryable: false,
        retry_count: 0,
        max_retries: 3,
      },
    ]);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the connector name for logging
    const { data: connector } = await supabase
      .from('data_connectors')
      .select('name')
      .eq('id', params.id)
      .single();

    const { error } = await supabase
      .from('data_connectors')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete connector', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Connector "${connector?.name}" deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}