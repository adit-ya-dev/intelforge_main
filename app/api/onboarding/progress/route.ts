import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/onboarding/progress - Get user's onboarding progress
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    const { data, error } = await supabase
      .from("onboarding_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch progress", details: error.message },
        { status: 500 }
      );
    }

    // If no progress exists, create default
    if (!data) {
      const defaultProgress = {
        user_id: userId,
        current_step: 1,
        completed_steps: [],
        is_complete: false,
        skipped: false,
        total_steps: 6,
      };

      const { data: newData, error: insertError } = await supabase
        .from("onboarding_progress")
        .insert(defaultProgress)
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to create progress", details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        progress: {
          currentStep: newData.current_step,
          totalSteps: newData.total_steps,
          completedSteps: newData.completed_steps,
          isComplete: newData.is_complete,
          skipped: newData.skipped,
        },
      });
    }

    return NextResponse.json({
      progress: {
        currentStep: data.current_step,
        totalSteps: data.total_steps,
        completedSteps: data.completed_steps,
        isComplete: data.is_complete,
        skipped: data.skipped,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/onboarding/progress:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/onboarding/progress - Update onboarding progress
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.userId || "default-user";

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.currentStep !== undefined)
      updateData.current_step = body.currentStep;
    if (body.completedSteps !== undefined)
      updateData.completed_steps = body.completedSteps;
    if (body.isComplete !== undefined)
      updateData.is_complete = body.isComplete;
    if (body.skipped !== undefined) updateData.skipped = body.skipped;

    const { data, error } = await supabase
      .from("onboarding_progress")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update progress", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      progress: {
        currentStep: data.current_step,
        totalSteps: data.total_steps,
        completedSteps: data.completed_steps,
        isComplete: data.is_complete,
        skipped: data.skipped,
      },
      message: "Progress updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT /api/onboarding/progress:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}