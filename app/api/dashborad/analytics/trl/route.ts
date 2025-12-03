// app/api/dashboard/analytics/trl/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock TRL distribution data
const mockTRLData = [
  {
    id: 'trl-1',
    trl_level: 'TRL 1-3',
    name: 'Research',
    value: 245,
    color: '#ef4444',
    percentage: 18.50
  },
  {
    id: 'trl-2',
    trl_level: 'TRL 4-6',
    name: 'Development',
    value: 582,
    color: '#f59e0b',
    percentage: 43.90
  },
  {
    id: 'trl-3',
    trl_level: 'TRL 7-8',
    name: 'Demonstration',
    value: 358,
    color: '#3b82f6',
    percentage: 27.00
  },
  {
    id: 'trl-4',
    trl_level: 'TRL 9',
    name: 'Deployment',
    value: 142,
    color: '#10b981',
    percentage: 10.70
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
          .from('trl_distribution')
          .select('*')
          .order('trl_level', { ascending: true });

        if (!error && data && data.length > 0) {
          return NextResponse.json({ data }, { status: 200 });
        }
      }
    } catch (dbError) {
      console.log('Supabase not available, using mock data');
    }

    // Fallback to mock data
    return NextResponse.json({ data: mockTRLData }, { status: 200 });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Even on error, return mock data
    return NextResponse.json({ data: mockTRLData }, { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Update TRL distribution
    const updates = body.distribution || [];
    
    const promises = updates.map((item: any) =>
      supabase
        .from('trl_distribution')
        .update({
          value: item.value,
          percentage: item.percentage,
        })
        .eq('trl_level', item.trl_level)
    );

    await Promise.all(promises);

    // Fetch updated data
    const { data, error } = await supabase
      .from('trl_distribution')
      .select('*')
      .order('trl_level', { ascending: true });

    if (error) {
      console.error('Error fetching updated TRL distribution:', error);
      return NextResponse.json(
        { error: 'Failed to fetch updated TRL distribution', details: error.message },
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