// app/api/alerts/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'user-1'; // Default user

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Create default preferences if none exist
        const defaultPrefs = {
          user_id: userId,
          enable_in_app: true,
          enable_email: true,
          enable_slack: false,
          quiet_hours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
            timezone: 'UTC',
          },
          severity_filters: {
            critical: true,
            high: true,
            medium: true,
            low: true,
          },
          digest_mode: {
            enabled: false,
            frequency: 'daily',
            time: '09:00',
          },
        };

        const { data: newPrefs, error: createError } = await supabase
          .from('notification_preferences')
          .insert([defaultPrefs])
          .select()
          .single();

        if (createError) {
          console.error('Error creating default preferences:', createError);
          return NextResponse.json(
            { error: 'Failed to create preferences', details: createError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ data: newPrefs }, { status: 200 });
      }

      console.error('Error fetching preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences', details: error.message },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || body.user_id || 'user-1';

    const prefsData = {
      user_id: userId,
      enable_in_app: body.enableInApp !== undefined ? body.enableInApp : body.enable_in_app,
      enable_email: body.enableEmail !== undefined ? body.enableEmail : body.enable_email,
      enable_slack: body.enableSlack !== undefined ? body.enableSlack : body.enable_slack,
      quiet_hours: body.quietHours || body.quiet_hours,
      severity_filters: body.severityFilters || body.severity_filters,
      digest_mode: body.digestMode || body.digest_mode,
    };

    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert([prefsData], { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update preferences', details: error.message },
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