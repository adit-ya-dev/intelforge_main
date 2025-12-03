// app/api/admin-ingestion/throughput/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // Fetch pipeline runs in the time range
    const { data: runs, error } = await supabase
      .from('pipeline_runs')
      .select('start_time, documents_processed, throughput, status')
      .gte('start_time', startTime.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching throughput data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch throughput data', details: error.message },
        { status: 500 }
      );
    }

    // Group by hour and calculate metrics
    const throughputMap = new Map<string, {
      documentsProcessed: number;
      throughput: number;
      count: number;
    }>();

    runs?.forEach(run => {
      const hourKey = new Date(run.start_time).toISOString().slice(0, 13) + ':00:00.000Z';
      const existing = throughputMap.get(hourKey) || {
        documentsProcessed: 0,
        throughput: 0,
        count: 0,
      };

      throughputMap.set(hourKey, {
        documentsProcessed: existing.documentsProcessed + run.documents_processed,
        throughput: existing.throughput + run.throughput,
        count: existing.count + 1,
      });
    });

    // Convert to array format
    const throughputData = Array.from(throughputMap.entries()).map(([timestamp, data]) => ({
      timestamp,
      documentsPerSecond: data.count > 0 ? data.throughput / data.count : 0,
      bytesPerSecond: data.documentsProcessed * 1024, // Rough estimate
      activeConnectors: data.count,
    }));

    // Fill in missing hours with zeros
    const result: any[] = [];
    const now = new Date();
    for (let i = hours - 1; i >= 0; i--) {
      const hourTime = new Date(now);
      hourTime.setHours(hourTime.getHours() - i);
      const hourKey = hourTime.toISOString().slice(0, 13) + ':00:00.000Z';

      const existing = throughputData.find(d => d.timestamp === hourKey);
      result.push(existing || {
        timestamp: hourKey,
        documentsPerSecond: 0,
        bytesPerSecond: 0,
        activeConnectors: 0,
      });
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}