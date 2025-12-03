import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/templates - Get all report templates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    let query = supabase
      .from("report_templates")
      .select("*")
      .order("usage_count", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch templates", details: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const templates = (data || []).map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      type: template.type,
      thumbnail: template.thumbnail,
      widgets: template.widgets,
      category: template.category,
      usageCount: template.usage_count,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    }));

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error("Error in GET /api/reports/templates:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports/templates - Create custom template
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: name, type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("report_templates")
      .insert({
        name: body.name,
        description: body.description || "",
        type: body.type,
        thumbnail: body.thumbnail || "",
        widgets: body.widgets || [],
        category: body.category || "custom",
        usage_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create template", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        template: {
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type,
          thumbnail: data.thumbnail,
          widgets: data.widgets,
          category: data.category,
          usageCount: data.usage_count,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        message: "Template created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/reports/templates:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}