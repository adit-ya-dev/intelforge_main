import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/[id] - Get single report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Report not found", details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
        lastGenerated: data.last_generated,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/reports/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/reports/[id] - Update report
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.widgets !== undefined) updateData.widgets = body.widgets;
    if (body.layout !== undefined) updateData.layout = body.layout;
    if (body.filters !== undefined) updateData.filters = body.filters;
    if (body.styling !== undefined) updateData.styling = body.styling;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.lastGenerated !== undefined)
      updateData.last_generated = body.lastGenerated;

    const { data, error } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update report", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
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
        lastGenerated: data.last_generated,
      },
      message: "Report updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT /api/reports/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[id] - Delete report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete report", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/reports/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}