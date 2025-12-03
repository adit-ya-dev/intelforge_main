import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/schedules - Get scheduled reports
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";
    const enabled = searchParams.get("enabled");

    let query = supabase
      .from("scheduled_reports")
      .select("*")
      .eq("created_by", userId)
      .order("next_run", { ascending: true });

    if (enabled !== null) {
      query = query.eq("enabled", enabled === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch schedules", details: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const schedules = (data || []).map((schedule) => ({
      id: schedule.id,
      reportId: schedule.report_id,
      reportName: schedule.report_name,
      enabled: schedule.enabled,
      recurrence: schedule.recurrence,
      schedule: schedule.schedule,
      recipients: schedule.recipients,
      deliveryChannels: schedule.delivery_channels,
      exportFormat: schedule.export_format,
      nextRun: schedule.next_run,
      lastRun: schedule.last_run,
      createdAt: schedule.created_at,
      updatedAt: schedule.updated_at,
    }));

    return NextResponse.json({ schedules });
  } catch (error: any) {
    console.error("Error in GET /api/reports/schedules:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reports/schedules - Create schedule
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    if (!body.reportId || !body.recurrence) {
      return NextResponse.json(
        { error: "Missing required fields: reportId, recurrence" },
        { status: 400 }
      );
    }

    // Get the report name
    const { data: report } = await supabase
      .from("reports")
      .select("name")
      .eq("id", body.reportId)
      .single();

    // Calculate next run time based on recurrence
    const nextRun = calculateNextRun(body.recurrence, body.schedule);

    const { data, error } = await supabase
      .from("scheduled_reports")
      .insert({
        report_id: body.reportId,
        report_name: report?.name || "Untitled Report",
        enabled: body.enabled !== undefined ? body.enabled : true,
        recurrence: body.recurrence,
        schedule: body.schedule,
        recipients: body.recipients || [],
        delivery_channels: body.deliveryChannels || [],
        export_format: body.exportFormat || "pdf",
        next_run: nextRun,
        created_by: body.createdBy || "default-user",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create schedule", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        schedule: {
          id: data.id,
          reportId: data.report_id,
          reportName: data.report_name,
          enabled: data.enabled,
          recurrence: data.recurrence,
          schedule: data.schedule,
          recipients: data.recipients,
          deliveryChannels: data.delivery_channels,
          exportFormat: data.export_format,
          nextRun: data.next_run,
          lastRun: data.last_run,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        message: "Schedule created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/reports/schedules:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate next run time
function calculateNextRun(
  recurrence: string,
  schedule: any
): string {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(":").map(Number);

  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  // If time has passed today, move to next occurrence
  if (nextRun <= now) {
    switch (recurrence) {
      case "daily":
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case "weekly":
        const daysUntilNext =
          (schedule.dayOfWeek - nextRun.getDay() + 7) % 7 || 7;
        nextRun.setDate(nextRun.getDate() + daysUntilNext);
        break;
      case "monthly":
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(schedule.dayOfMonth);
        break;
      case "quarterly":
        nextRun.setMonth(nextRun.getMonth() + 3);
        nextRun.setDate(schedule.dayOfMonth);
        break;
    }
  }

  return nextRun.toISOString();
}