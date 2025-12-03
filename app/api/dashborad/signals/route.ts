// app/api/dashboard/signals/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock signals data
const mockSignals = [
  {
    id: 'signal-1',
    type: 'breakthrough',
    title: 'Quantum Error Correction Breakthrough',
    tech: 'Quantum Computing',
    importance: 'high',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 'Q-factor: 0.97',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-2',
    type: 'funding',
    title: 'Series C Funding Round',
    tech: 'Solid-State Batteries',
    importance: 'high',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: '$150M',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-3',
    type: 'patent',
    title: 'Novel CRISPR Delivery Method',
    tech: 'Gene Editing',
    importance: 'medium',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 'US Patent',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-4',
    type: 'publication',
    title: 'Nature: Neural Interface Study',
    tech: 'BCI Technology',
    importance: 'high',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: '1,200 citations',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-5',
    type: 'breakthrough',
    title: 'Room-Temp Superconductor Discovery',
    tech: 'Materials Science',
    importance: 'high',
    date: new Date().toISOString().split('T')[0],
    value: 'Peer-reviewed',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-6',
    type: 'funding',
    title: 'Government Grant Awarded',
    tech: 'Fusion Energy',
    importance: 'medium',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: '$75M',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-7',
    type: 'patent',
    title: 'Advanced Battery Chemistry',
    tech: 'Energy Storage',
    importance: 'medium',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 'EP Patent',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'signal-8',
    type: 'publication',
    title: 'AI Safety Framework Published',
    tech: 'Artificial Intelligence',
    importance: 'high',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 'arXiv',
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const importance = searchParams.get('importance');
    const limit = parseInt(searchParams.get('limit') || '8');

    // Try to fetch from Supabase, fallback to mock data
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        let query = supabase
          .from('signals')
          .select('*')
          .order('date', { ascending: false })
          .order('importance', { ascending: false })
          .limit(limit);

        if (type && type !== 'all') {
          query = query.eq('type', type);
        }

        if (importance) {
          query = query.eq('importance', importance);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          return NextResponse.json({ data }, { status: 200 });
        }
      }
    } catch (dbError) {
      console.log('Supabase not available, using mock data');
    }

    // Fallback to mock data with filtering
    let filteredData = [...mockSignals];
    
    if (type && type !== 'all') {
      filteredData = filteredData.filter(s => s.type === type);
    }
    
    if (importance) {
      filteredData = filteredData.filter(s => s.importance === importance);
    }
    
    filteredData = filteredData.slice(0, limit);

    return NextResponse.json({ data: filteredData }, { status: 200 });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    
    // Even on error, return mock data
    return NextResponse.json({ data: mockSignals.slice(0, 8) }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const signalData = {
      type: body.type,
      title: body.title,
      tech: body.tech,
      importance: body.importance || 'medium',
      date: body.date || new Date().toISOString().split('T')[0],
      value: body.value || null,
      metadata: body.metadata || {},
    };

    const { data, error } = await supabase
      .from('signals')
      .insert([signalData])
      .select()
      .single();

    if (error) {
      console.error('Error creating signal:', error);
      return NextResponse.json(
        { error: 'Failed to create signal', details: error.message },
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