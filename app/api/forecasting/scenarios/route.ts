import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get("public");

    let query = supabase
      .from("scenario_presets")
      .select("*")
      .order("usage_count", { ascending: false });

    if (isPublic === "true") {
      query = query.eq("is_public", true);
    }

    const { data: presets, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch presets", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ presets: presets || [] });
  } catch (error: any) {
    console.error("Error fetching presets:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: preset, error } = await supabase
      .from("scenario_presets")
      .insert([
        {
          name: body.name,
          type: body.type,
          description: body.description,
          parameters: body.parameters,
          created_by: body.createdBy || "system",
          is_public: body.isPublic || false,
          usage_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create preset", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ preset }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating preset:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}