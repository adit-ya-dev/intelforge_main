import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports/metrics - Get report metrics for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    // Get total reports
    const { count: totalReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId);

    // Get active schedules
    const { count: activeSchedules } = await supabase
      .from("scheduled_reports")
      .select("*", { count: "exact", head: true })
      .eq("created_by", userId)
      .eq("enabled", true);

    // Get generated this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count: generatedThisMonth } = await supabase
      .from("generated_reports")
      .select("*", { count: "exact", head: true })
      .eq("generated_by", userId)
      .gte("generated_at", firstDayOfMonth.toISOString());

    // Get total downloads (sum of all download counts)
    const { data: downloadData } = await supabase
      .from("generated_reports")
      .select("download_count")
      .eq("generated_by", userId);

    const totalDownloads = downloadData?.reduce(
      (sum, item) => sum + item.download_count,
      0
    ) || 0;

    // Calculate average generation time (mock for now)
    const avgGenerationTime = 12.4;

    // Calculate storage used
    const { data: storageData } = await supabase
      .from("generated_reports")
      .select("file_size")
      .eq("generated_by", userId);

    const storageUsed =
      storageData?.reduce((sum, item) => sum + (item.file_size || 0), 0) || 0;
    const storageUsedMB = storageUsed / (1024 * 1024);

    const metrics = {
      totalReports: totalReports || 0,
      activeSchedules: activeSchedules || 0,
      generatedThisMonth: generatedThisMonth || 0,
      totalDownloads,
      avgGenerationTime,
      storageUsed: Math.round(storageUsedMB * 10) / 10,
    };

    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error("Error in GET /api/reports/metrics:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}