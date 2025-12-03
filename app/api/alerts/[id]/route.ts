// app/api/alerts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Alert not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch alert', details: error.message },
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

    // Handle camelCase to snake_case conversion for common fields
    const updates: any = {};
    
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.severity !== undefined) updates.severity = body.severity;
    if (body.state !== undefined) updates.state = body.state;
    if (body.triggerType !== undefined) updates.trigger_type = body.triggerType;
    if (body.trigger_type !== undefined) updates.trigger_type = body.trigger_type;
    if (body.conditions !== undefined) updates.conditions = body.conditions;
    if (body.frequency !== undefined) updates.frequency = body.frequency;
    if (body.deliveryChannels !== undefined) updates.delivery_channels = body.deliveryChannels;
    if (body.delivery_channels !== undefined) updates.delivery_channels = body.delivery_channels;
    if (body.dedupRules !== undefined) updates.dedup_rules = body.dedupRules;
    if (body.dedup_rules !== undefined) updates.dedup_rules = body.dedup_rules;
    if (body.throttle !== undefined) updates.throttle = body.throttle;
    if (body.teamSubscriptions !== undefined) updates.team_subscriptions = body.teamSubscriptions;
    if (body.team_subscriptions !== undefined) updates.team_subscriptions = body.team_subscriptions;
    if (body.estimatedNoise !== undefined) updates.estimated_noise = body.estimatedNoise;
    if (body.estimated_noise !== undefined) updates.estimated_noise = body.estimated_noise;
    if (body.lastTriggered !== undefined) updates.last_triggered = body.lastTriggered;
    if (body.last_triggered !== undefined) updates.last_triggered = body.last_triggered;
    if (body.triggerCount !== undefined) updates.trigger_count = body.triggerCount;
    if (body.trigger_count !== undefined) updates.trigger_count = body.trigger_count;

    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update alert', details: error.message },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete alert', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Alert deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}