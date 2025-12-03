import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports - Get all reports for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";
    const status = searchParams.get("status");

    let query = supabase
      .from("reports")
      .select("*")
      .eq("created_by", userId)
      .order("updated_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch reports", details: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const reports = (data || []).map((report) => ({
      id: report.id,
      name: report.name,
      description: report.description,
      type: report.type,
      templateId: report.template_id,
      widgets: report.widgets,
      layout: report.layout,
      filters: report.filters,
      styling: report.styling,
      createdBy: report.created_by,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      status: report.status,
      lastGenerated: report.last_generated,
    }));

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error("Error in GET /api/reports:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create new report
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.createdBy || "default-user";

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: name, type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        name: body.name,
        description: body.description || "",
        type: body.type,
        template_id: body.templateId,
        widgets: body.widgets || [],
        layout: body.layout || { columns: 12, rows: 12 },
        filters: body.filters || {},
        styling: body.styling || {
          theme: "light",
          primaryColor: "#3b82f6",
        },
        created_by: userId,
        status: body.status || "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create report", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        report: {
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type,
          templateId: data.template_id,
          widgets: data.widgets,
          layout: data.layout,
          filters: data.filters,
          styling: data.styling,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          status: data.status,
        },
        message: "Report created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/reports:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}