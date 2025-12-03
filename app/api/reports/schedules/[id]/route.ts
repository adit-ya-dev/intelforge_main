import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/schedules/[id] - Get single schedule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("scheduled_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Schedule not found", details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("Error in GET /api/reports/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/reports/schedules/[id] - Update schedule
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

    if (body.enabled !== undefined) updateData.enabled = body.enabled;
    if (body.recurrence !== undefined) updateData.recurrence = body.recurrence;
    if (body.schedule !== undefined) updateData.schedule = body.schedule;
    if (body.recipients !== undefined) updateData.recipients = body.recipients;
    if (body.deliveryChannels !== undefined)
      updateData.delivery_channels = body.deliveryChannels;
    if (body.exportFormat !== undefined)
      updateData.export_format = body.exportFormat;

    // Recalculate next run if schedule changed
    if (body.recurrence || body.schedule) {
      const currentData = await supabase
        .from("scheduled_reports")
        .select("recurrence, schedule")
        .eq("id", id)
        .single();

      const recurrence = body.recurrence || currentData.data?.recurrence;
      const schedule = body.schedule || currentData.data?.schedule;

      updateData.next_run = calculateNextRun(recurrence, schedule);
    }

    const { data, error } = await supabase
      .from("scheduled_reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update schedule", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
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
      message: "Schedule updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT /api/reports/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/schedules/[id] - Delete schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { error } = await supabase
      .from("scheduled_reports")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete schedule", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/reports/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate next run time
function calculateNextRun(recurrence: string, schedule: any): string {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(":").map(Number);

  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

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