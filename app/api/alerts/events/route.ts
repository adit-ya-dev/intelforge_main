// app/api/alerts/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('alert_id');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('triggered_events')
      .select('*')
      .order('triggered_at', { ascending: false })
      .limit(limit);

    if (alertId) {
      query = query.eq('alert_id', alertId);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { data, error} = await query;

    if (error) {
      console.error('Error fetching triggered events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events', details: error.message },
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

    const eventData = {
      alert_id: body.alertId || body.alert_id,
      alert_name: body.alertName || body.alert_name,
      severity: body.severity,
      matched_documents: body.matchedDocuments || body.matched_documents || [],
      evidence_snapshot: body.evidenceSnapshot || body.evidence_snapshot,
      actions_performed: body.actionsPerformed || body.actions_performed || [],
      delivery_status: body.deliveryStatus || body.delivery_status || [],
    };

    const { data, error } = await supabase
      .from('triggered_events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating triggered event:', error);
      return NextResponse.json(
        { error: 'Failed to create event', details: error.message },
        { status: 500 }
      );
    }

    // Update alert trigger count and last_triggered
    if (data.alert_id) {
      await supabase.rpc('increment', { 
        row_id: data.alert_id, 
        x: 1 
      });
      
      await supabase
        .from('alerts')
        .update({ 
          last_triggered: new Date().toISOString(),
          trigger_count: supabase.sql`trigger_count + 1`
        })
        .eq('id', data.alert_id);
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