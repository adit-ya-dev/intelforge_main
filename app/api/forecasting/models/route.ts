import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const tags = searchParams.get("tags");

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from("forecasting_models")
      .select("*", { count: "exact" });

    // Apply filters
    if (type) {
      query = query.eq("type", type);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (tags) {
      const tagArray = tags.split(",");
      query = query.contains("tags", tagArray);
    }

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    // Order by usage count and last trained
    query = query.order("usage_count", { ascending: false });

    const { data: models, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch models", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      models: models || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (error: any) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: model, error } = await supabase
      .from("forecasting_models")
      .insert([
        {
          name: body.name,
          type: body.type,
          version: body.version,
          description: body.description,
          long_description: body.longDescription,
          status: "training",
          tags: body.tags || [],
          created_by: body.createdBy || "system",
          is_published: false,
          accuracy: 0,
          usage_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create model", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ model }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}