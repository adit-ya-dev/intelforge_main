import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/generated - Get generated report versions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");
    const userId = searchParams.get("userId") || "default-user";

    let query = supabase
      .from("generated_reports")
      .select("*")
      .eq("generated_by", userId)
      .order("generated_at", { ascending: false });

    if (reportId) {
      query = query.eq("report_id", reportId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch generated reports", details: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const reports = (data || []).map((report) => ({
      id: report.id,
      reportId: report.report_id,
      reportName: report.report_name,
      version: report.version,
      format: report.format,
      status: report.status,
      fileUrl: report.file_url,
      fileSize: report.file_size,
      generatedAt: report.generated_at,
      generatedBy: report.generated_by,
      downloadCount: report.download_count,
      comments: report.comments,
      metadata: report.metadata,
    }));

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error("Error in GET /api/reports/generated:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports/generated - Create generated report version
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    if (!body.reportId || !body.format) {
      return NextResponse.json(
        { error: "Missing required fields: reportId, format" },
        { status: 400 }
      );
    }

    // Get the report name
    const { data: report } = await supabase
      .from("reports")
      .select("name")
      .eq("id", body.reportId)
      .single();

    // Get the next version number
    const { data: versions } = await supabase
      .from("generated_reports")
      .select("version")
      .eq("report_id", body.reportId)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

    const { data, error } = await supabase
      .from("generated_reports")
      .insert({
        report_id: body.reportId,
        report_name: report?.name || "Untitled Report",
        version: nextVersion,
        format: body.format,
        status: body.status || "generating",
        file_url: body.fileUrl,
        file_size: body.fileSize,
        generated_by: body.generatedBy || "default-user",
        download_count: 0,
        comments: [],
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create generated report", details: error.message },
        { status: 500 }
      );
    }

    // Update the parent report's last_generated timestamp
    await supabase
      .from("reports")
      .update({ last_generated: new Date().toISOString() })
      .eq("id", body.reportId);

    return NextResponse.json(
      {
        report: {
          id: data.id,
          reportId: data.report_id,
          reportName: data.report_name,
          version: data.version,
          format: data.format,
          status: data.status,
          fileUrl: data.file_url,
          fileSize: data.file_size,
          generatedAt: data.generated_at,
          generatedBy: data.generated_by,
          downloadCount: data.download_count,
          comments: data.comments,
          metadata: data.metadata,
        },
        message: "Report generated successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/reports/generated:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/reports/generated/[id] - Update generated report (comments, downloads)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (body.comments !== undefined) updateData.comments = body.comments;
    if (body.downloadCount !== undefined)
      updateData.download_count = body.downloadCount;
    if (body.status !== undefined) updateData.status = body.status;

    const { data, error } = await supabase
      .from("generated_reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update generated report", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      report: {
        id: data.id,
        reportId: data.report_id,
        reportName: data.report_name,
        version: data.version,
        format: data.format,
        status: data.status,
        fileUrl: data.file_url,
        fileSize: data.file_size,
        generatedAt: data.generated_at,
        generatedBy: data.generated_by,
        downloadCount: data.download_count,
        comments: data.comments,
        metadata: data.metadata,
      },
      message: "Generated report updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT /api/reports/generated:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/generated - Delete generated report
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("generated_reports")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete generated report", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Generated report deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/reports/generated:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}