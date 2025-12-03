// app/api/admin-ingestion/pipeline-runs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('pipeline_runs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Pipeline run not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch pipeline run', details: error.message },
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

    // Calculate duration if status is completed/failed
    if (body.status === 'completed' || body.status === 'failed') {
      const { data: run } = await supabase
        .from('pipeline_runs')
        .select('start_time')
        .eq('id', params.id)
        .single();

      if (run) {
        const endTime = new Date();
        const startTime = new Date(run.start_time);
        body.end_time = endTime.toISOString();
        body.duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      }
    }

    const { data, error } = await supabase
      .from('pipeline_runs')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update pipeline run', details: error.message },
        { status: 500 }
      );
    }

    // Update connector documents count if completed
    if (data.status === 'completed' && data.connector_id) {
      const { data: connector } = await supabase
        .from('data_connectors')
        .select('total_documents, documents_today')
        .eq('id', data.connector_id)
        .single();

      if (connector) {
        await supabase
          .from('data_connectors')
          .update({
            total_documents: connector.total_documents + data.documents_processed,
            documents_today: connector.documents_today + data.documents_processed,
          })
          .eq('id', data.connector_id);
      }
    }

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
    const { error } = await supabase
      .from('pipeline_runs')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete pipeline run', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Pipeline run deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}