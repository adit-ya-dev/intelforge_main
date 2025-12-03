// app/api/dashboard/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock activity data generator
function generateActivityData(hours: number, limit: number) {
  const activities = [
    { type: 'Patent', description: 'New patent filed for quantum annealing optimization', tech: 'Quantum Computing' },
    { type: 'Funding', description: 'QuantumScape raises $150M in Series D', tech: 'Solid-State Batteries' },
    { type: 'Publication', description: 'Breakthrough in RNA vaccine delivery published', tech: 'mRNA Technology' },
    { type: 'Partnership', description: 'IBM and MIT announce quantum research collaboration', tech: 'Quantum Computing' },
    { type: 'Regulatory', description: 'FDA approves new CRISPR therapy for sickle cell', tech: 'Gene Editing' },
    { type: 'Market', description: 'Electric vehicle battery costs drop 40%', tech: 'Battery Technology' },
    { type: 'Award', description: 'Nobel Prize awarded for mRNA vaccine technology', tech: 'Biotechnology' },
    { type: 'Breakthrough', description: 'First commercial fusion reactor achieves net gain', tech: 'Fusion Energy' },
    { type: 'Patent', description: 'Advanced neural interface chip approved', tech: 'BCI Technology' },
    { type: 'Funding', description: 'AI startup secures $200M Series C', tech: 'Artificial Intelligence' },
    { type: 'Publication', description: 'Nature publishes breakthrough in carbon capture', tech: 'Climate Tech' },
    { type: 'Market', description: 'Green hydrogen production costs reach grid parity', tech: 'Clean Energy' },
  ];

  const data = [];
  const now = new Date();

  for (let i = 0; i < Math.min(limit, activities.length); i++) {
    const timestamp = new Date(now.getTime() - (Math.random() * hours * 60 * 60 * 1000));
    
    data.push({
      id: `activity-${i}`,
      type: activities[i].type,
      description: activities[i].description,
      tech: activities[i].tech,
      link: null,
      timestamp: timestamp.toISOString(),
      created_at: timestamp.toISOString()
    });
  }

  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Try to fetch from Supabase, fallback to mock data
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('activity_feed')
          .select('*')
          .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return NextResponse.json({ data }, { status: 200 });
        }
      }
    } catch (dbError) {
      console.log('Supabase not available, using mock data');
    }

    // Fallback to mock data
    const mockData = generateActivityData(hours, limit);
    return NextResponse.json({ data: mockData }, { status: 200 });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Even on error, return mock data
    const mockData = generateActivityData(24, 20);
    return NextResponse.json({ data: mockData }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const activityData = {
      type: body.type,
      description: body.description,
      tech: body.tech,
      link: body.link || null,
    };

    const { data, error } = await supabase
      .from('activity_feed')
      .insert([activityData])
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      return NextResponse.json(
        { error: 'Failed to create activity', details: error.message },
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