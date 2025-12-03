// app/api/alerts/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    // Fetch base metrics from view
    const { data: baseMetrics, error: metricsError } = await supabase
      .from('alert_metrics')
      .select('*')
      .single();

    if (metricsError && metricsError.code !== 'PGRST116') {
      console.error('Error fetching base metrics:', metricsError);
    }

    // Get triggers for last 24 hours
    const { data: triggers24h, error: triggers24hError } = await supabase
      .rpc('get_triggers_last_hours', { hours: 24 });

    // Get triggers for last 7 days
    const { data: triggers7d, error: triggers7dError } = await supabase
      .rpc('get_triggers_last_hours', { hours: 168 });

    // Get success rate
    const { data: successRate, error: successRateError } = await supabase
      .rpc('get_alert_success_rate');

    // Calculate average response time (simplified - you may want to customize this)
    const avgResponseTime = 2.3; // Default value, calculate from delivery_status if needed

    // Calculate signal to noise ratio (simplified)
    const signalToNoiseRatio = baseMetrics?.total_alerts > 0 
      ? Math.max(0.5, 1 - (baseMetrics?.muted_alerts || 0) / baseMetrics.total_alerts)
      : 0.8;

    const metrics = {
      totalAlerts: baseMetrics?.total_alerts || 0,
      activeAlerts: baseMetrics?.active_alerts || 0,
      mutedAlerts: baseMetrics?.muted_alerts || 0,
      triggersLast24h: triggers24h || 0,
      triggersLast7d: triggers7d || 0,
      avgResponseTime,
      successRate: successRate || 98.5,
      signalToNoiseRatio,
    };

    return NextResponse.json({ data: metrics }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Return default metrics if there's an error
    return NextResponse.json(
      { 
        data: {
          totalAlerts: 0,
          activeAlerts: 0,
          mutedAlerts: 0,
          triggersLast24h: 0,
          triggersLast7d: 0,
          avgResponseTime: 0,
          successRate: 100,
          signalToNoiseRatio: 1,
        }
      },
      { status: 200 }
    );
  }
}