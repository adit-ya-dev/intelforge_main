// app/api/alerts/watched-technologies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertsEnabled = searchParams.get('alerts_enabled');

    let query = supabase
      .from('watched_technologies')
      .select('*')
      .order('last_update', { ascending: false });

    if (alertsEnabled !== null) {
      query = query.eq('alerts_enabled', alertsEnabled === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching watched technologies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch watched technologies', details: error.message },
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

    const techData = {
      technology_id: body.technologyId || body.technology_id,
      name: body.name,
      domain: body.domain,
      update_count: 0,
      alerts_enabled: body.alertsEnabled !== undefined ? body.alertsEnabled : body.alerts_enabled !== undefined ? body.alerts_enabled : true,
      recent_changes: body.recentChanges || body.recent_changes || [],
    };

    const { data, error } = await supabase
      .from('watched_technologies')
      .insert([techData])
      .select()
      .single();

    if (error) {
      console.error('Error creating watched technology:', error);
      return NextResponse.json(
        { error: 'Failed to create watched technology', details: error.message },
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