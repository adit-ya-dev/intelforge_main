import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/onboarding/checklist - Get user's checklist
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    const { data, error } = await supabase
      .from("onboarding_checklist")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch checklist", details: error.message },
        { status: 500 }
      );
    }

    // If no checklist exists, create default
    if (!data) {
      const defaultChecklist = {
        user_id: userId,
        items: [
          {
            id: "check-1",
            label: "Complete profile information",
            completed: false,
            optional: false,
            helpText: "Add your name, role, and organization",
          },
          {
            id: "check-2",
            label: "Select at least 3 domains of interest",
            completed: false,
            optional: false,
            helpText: "Choose technology areas to monitor",
            action: "SELECT_DOMAINS",
          },
          {
            id: "check-3",
            label: "Enable recommended data connectors",
            completed: false,
            optional: false,
            helpText: "Connect to patent and research databases",
            action: "CONFIGURE_CONNECTORS",
          },
          {
            id: "check-4",
            label: "Add 5+ items to watchlist",
            completed: false,
            optional: false,
            helpText: "Track specific technologies or organizations",
            action: "BUILD_WATCHLIST",
          },
          {
            id: "check-5",
            label: "Set up your first alert",
            completed: false,
            optional: true,
            helpText: "Get notified about important changes",
            action: "CREATE_ALERT",
          },
          {
            id: "check-6",
            label: "Run a sample search",
            completed: false,
            optional: true,
            helpText: "Try one of our recommended searches",
            action: "RUN_SEARCH",
          },
        ],
        progress: 0,
      };

      const { data: newData, error: insertError } = await supabase
        .from("onboarding_checklist")
        .insert(defaultChecklist)
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          {
            error: "Failed to create checklist",
            details: insertError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        checklist: {
          id: newData.id,
          items: newData.items,
          progress: newData.progress,
        },
      });
    }

    return NextResponse.json({
      checklist: {
        id: data.id,
        items: data.items,
        progress: data.progress,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/onboarding/checklist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/onboarding/checklist - Update checklist
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.userId || "default-user";
    const items = body.items;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Missing or invalid field: items" },
        { status: 400 }
      );
    }

    // Calculate progress
    const completedCount = items.filter((item: any) => item.completed).length;
    const progress = (completedCount / items.length) * 100;

    const { data, error } = await supabase
      .from("onboarding_checklist")
      .update({
        items,
        progress,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update checklist", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checklist: {
        id: data.id,
        items: data.items,
        progress: data.progress,
      },
      message: "Checklist updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT /api/onboarding/checklist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}