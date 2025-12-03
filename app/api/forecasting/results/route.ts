import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const modelId = searchParams.get("modelId");
    const techId = searchParams.get("techId");

    let query = supabase
      .from("forecast_results")
      .select("*")
      .order("generated_at", { ascending: false });

    if (jobId) {
      query = query.eq("job_id", jobId);
    }
    if (modelId) {
      query = query.eq("model_id", modelId);
    }
    if (techId) {
      query = query.eq("tech_id", techId);
    }

    const { data: results, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch results", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: results || [] });
  } catch (error: any) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}