// app/api/admin-ingestion/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    // Fetch pipeline metrics from the view
    const { data: metrics, error: metricsError } = await supabase
      .from('pipeline_metrics')
      .select('*')
      .single();

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      // If view doesn't exist, calculate manually
      const { data: runs } = await supabase
        .from('pipeline_runs')
        .select('*');

      const manualMetrics = {
        total_runs: runs?.length || 0,
        successful_runs: runs?.filter(r => r.status === 'completed').length || 0,
        failed_runs: runs?.filter(r => r.status === 'failed').length || 0,
        average_duration: runs?.reduce((acc, r) => acc + (r.duration || 0), 0) / (runs?.length || 1) || 0,
        total_documents_processed: runs?.reduce((acc, r) => acc + r.documents_processed, 0) || 0,
        avg_throughput: runs?.reduce((acc, r) => acc + r.throughput, 0) / (runs?.length || 1) || 0,
        active_jobs: runs?.filter(r => r.status === 'running').length || 0,
        error_rate: ((runs?.filter(r => r.status === 'failed').length || 0) / (runs?.length || 1)) * 100 || 0,
      };

      return NextResponse.json({ data: manualMetrics }, { status: 200 });
    }

    // Get queue depth
    const { data: runningRuns } = await supabase
      .from('pipeline_runs')
      .select('documents_queued')
      .eq('status', 'running');

    const queueDepth = runningRuns?.reduce((acc, run) => acc + run.documents_queued, 0) || 0;

    // Get processing rate (last hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data: recentRuns } = await supabase
      .from('pipeline_runs')
      .select('documents_processed')
      .gte('start_time', oneHourAgo.toISOString());

    const processingRate = recentRuns?.reduce((acc, run) => acc + run.documents_processed, 0) || 0;

    const enrichedMetrics = {
      ...metrics,
      queueDepth,
      processingRate,
    };

    return NextResponse.json({ data: enrichedMetrics }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}