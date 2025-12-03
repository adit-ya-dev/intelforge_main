// app/api/admin-ingestion/secrets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin-ingestion';
import { createHash } from 'crypto';

// Simple encryption/decryption (in production, use a proper encryption library)
function maskApiKey(key: string): string {
  if (key.length < 10) return '***';
  return `${key.substring(0, 3)}...${key.substring(key.length - 6)}`;
}

function encryptKey(key: string): string {
  // In production, use proper encryption like crypto-js or node:crypto
  // This is a placeholder - DO NOT use in production
  return Buffer.from(key).toString('base64');
}

function decryptKey(encryptedKey: string): string {
  // In production, use proper decryption
  // This is a placeholder - DO NOT use in production
  return Buffer.from(encryptedKey, 'base64').toString('utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('api_secrets')
      .select('id, name, service, created_at, last_used, expires_at, status, permissions, masked, updated_at')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching secrets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch secrets', details: error.message },
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

    const secretData = {
      name: body.name,
      service: body.service,
      encrypted_key: encryptKey(body.key), // Encrypt the key
      masked: maskApiKey(body.key),
      status: 'active',
      permissions: body.permissions || [],
      expires_at: body.expires_at || null,
    };

    const { data, error } = await supabase
      .from('api_secrets')
      .insert([secretData])
      .select('id, name, service, created_at, last_used, expires_at, status, permissions, masked, updated_at')
      .single();

    if (error) {
      console.error('Error creating secret:', error);
      return NextResponse.json(
        { error: 'Failed to create secret', details: error.message },
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