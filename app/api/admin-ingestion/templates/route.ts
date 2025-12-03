// app/api/admin-ingestion/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const popularOnly = searchParams.get('popular') === 'true';

    let query = supabase
      .from('connector_templates')
      .select('*')
      .order('popular', { ascending: false })
      .order('name', { ascending: true });

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
      type: body.type,
      provider: body.provider,
      description: body.description || null,
      required_fields: body.required_fields || [],
      optional_fields: body.optional_fields || [],
      default_config: body.default_config || {},
      documentation_url: body.documentation_url || null,
      popular: body.popular || false,
    };

    const { data, error } = await supabase
      .from('connector_templates')
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