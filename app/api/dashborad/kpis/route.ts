// app/api/dashboard/kpis/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock KPI data
const mockKPIs = [
  {
    id: 'kpi-1',
    metric_key: 'technologies',
    label: 'Technologies Tracked',
    value: '2,547',
    change_value: 12.5,
    change_label: '+12.5% from last month',
    icon: 'Activity',
    trend: 'up',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'kpi-2',
    metric_key: 'signals',
    label: 'Emerging Signals',
    value: '847',
    change_value: 8.3,
    change_label: '+8.3% this week',
    icon: 'TrendingUp',
    trend: 'up',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'kpi-3',
    metric_key: 'patents',
    label: 'Patent Filings',
    value: '1,234',
    change_value: 15.2,
    change_label: '+15.2% vs last period',
    icon: 'FileText',
    trend: 'up',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'kpi-4',
    metric_key: 'funding',
    label: 'Total Funding',
    value: '$2.4B',
    change_value: 22.8,
    change_label: '+22.8% this quarter',
    icon: 'DollarSign',
    trend: 'up',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'kpi-5',
    metric_key: 'trl_avg',
    label: 'Avg TRL',
    value: '6.2',
    change_value: 0.3,
    change_label: '+0.3 this month',
    icon: 'Target',
    trend: 'up',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from Supabase, fallback to mock data
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('dashboard_kpis')
          .select('*')
          .order('metric_key', { ascending: true });

        if (!error && data && data.length > 0) {
          return NextResponse.json({ data }, { status: 200 });
        }
      }
    } catch (dbError) {
      console.log('Supabase not available, using mock data');
    }

    // Fallback to mock data
    return NextResponse.json({ data: mockKPIs }, { status: 200 });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Even on error, return mock data
    return NextResponse.json({ data: mockKPIs }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to refresh KPIs in Supabase, fallback to mock data
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try to call refresh function
        const { error: refreshError } = await supabase.rpc('refresh_dashboard_kpis');

        if (refreshError) {
          console.error('Error refreshing KPIs:', refreshError);
        }

        // Fetch updated KPIs
        const { data, error } = await supabase
          .from('dashboard_kpis')
          .select('*')
          .order('metric_key', { ascending: true });

        if (!error && data && data.length > 0) {
          return NextResponse.json({ data }, { status: 200 });
        }
      }
    } catch (dbError) {
      console.log('Supabase not available, using mock data');
    }

    // Fallback to mock data
    return NextResponse.json({ data: mockKPIs }, { status: 200 });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Even on error, return mock data
    return NextResponse.json({ data: mockKPIs }, { status: 200 });
  }
}