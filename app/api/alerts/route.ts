// app/api/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const severity = searchParams.get('severity');

    let query = supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (state && state !== 'all') {
      query = query.eq('state', state);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alerts', details: error.message },
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

    const alertData = {
      name: body.name,
      description: body.description,
      severity: body.severity || 'medium',
      state: 'active',
      trigger_type: body.triggerType || body.trigger_type,
      conditions: body.conditions || [],
      frequency: body.frequency || 'daily',
      delivery_channels: body.deliveryChannels || body.delivery_channels || [],
      dedup_rules: body.dedupRules || body.dedup_rules || {
        enabled: true,
        window: 60,
        field: 'title',
      },
      throttle: body.throttle || {
        enabled: false,
        suppressionWindow: 30,
        maxEventsPerWindow: 5,
      },
      team_subscriptions: body.teamSubscriptions || body.team_subscriptions || [],
      created_by: body.createdBy || body.created_by || 'user-1',
      trigger_count: 0,
      estimated_noise: body.estimatedNoise || body.estimated_noise || 15,
    };

    const { data, error } = await supabase
      .from('alerts')
      .insert([alertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return NextResponse.json(
        { error: 'Failed to create alert', details: error.message },
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