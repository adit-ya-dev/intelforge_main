import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("active");

    let query = supabase
      .from("scheduled_runs")
      .select("*")
      .order("created_at", { ascending: false });

    if (isActive === "true") {
      query = query.eq("is_active", true);
    }

    const { data: runs, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch scheduled runs", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ runs: runs || [] });
  } catch (error: any) {
    console.error("Error fetching scheduled runs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: run, error } = await supabase
      .from("scheduled_runs")
      .insert([
        {
          name: body.name,
          model_id: body.modelId,
          tech_ids: body.techIds,
          scenario: body.scenario,
          parameters: body.parameters,
          schedule: body.schedule,
          notifications: body.notifications,
          is_active: true,
          created_by: body.createdBy || "system",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create scheduled run", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ run }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating scheduled run:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}