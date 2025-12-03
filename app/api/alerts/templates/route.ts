// app/api/alerts/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const popularOnly = searchParams.get('popular') === 'true';

    let query = supabase
      .from('alert_templates')
      .select('*')
      .order('popular', { ascending: false })
      .order('name', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (popularOnly) {
      query = query.eq('popular', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
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

    const templateData = {
      name: body.name,
      description: body.description,
      category: body.category,
      trigger_type: body.triggerType || body.trigger_type,
      default_conditions: body.defaultConditions || body.default_conditions || [],
      recommended_frequency: body.recommendedFrequency || body.recommended_frequency,
      icon: body.icon || '📄',
      popular: body.popular || false,
    };

    const { data, error } = await supabase
      .from('alert_templates')
      .insert([templateData])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Failed to create template', details: error.message },
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