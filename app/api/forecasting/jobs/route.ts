import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    let query = supabase
      .from("forecast_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (jobId) {
      query = query.eq("id", jobId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data: jobs, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch jobs", details: error.message },
        { status: 500 }
      );
    }

    if (jobId && jobs && jobs.length > 0) {
      return NextResponse.json({ job: jobs[0] });
    }

    return NextResponse.json({ jobs: jobs || [] });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get model info
    const { data: model, error: modelError } = await supabase
      .from("forecasting_models")
      .select("name, version")
      .eq("id", body.modelId)
      .single();

    if (modelError) {
      return NextResponse.json(
        { error: "Model not found", details: modelError.message },
        { status: 404 }
      );
    }

    // Create job
    const { data: job, error } = await supabase
      .from("forecast_jobs")
      .insert([
        {
          model_id: body.modelId,
          model_name: model.name,
          status: "pending",
          progress: 0,
          tech_ids: body.techIds,
          scenario: body.scenario,
          parameters: body.parameters,
          created_by: body.createdBy || "system",
          random_seed: body.randomSeed || Math.floor(Math.random() * 10000),
          environment: {
            python_version: "3.11.4",
            model_version: model.version,
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create job", details: error.message },
        { status: 500 }
      );
    }

    // Simulate job execution (in production, this would trigger actual forecast)
    setTimeout(async () => {
      await updateJobProgress(job.id);
    }, 100);

    return NextResponse.json(
      {
        jobId: job.id,
        status: "pending",
        estimatedTime: "2-3 minutes",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to simulate job progress
async function updateJobProgress(jobId: string) {
  const progressSteps = [10, 25, 40, 55, 70, 85, 100];
  
  for (const progress of progressSteps) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const updateData: any = {
      progress,
      updated_at: new Date().toISOString(),
    };

    if (progress === 10) {
      updateData.status = "running";
      updateData.started_at = new Date().toISOString();
    }

    if (progress === 100) {
      updateData.status = "completed";
      updateData.completed_at = new Date().toISOString();
    }

    await supabase
      .from("forecast_jobs")
      .update(updateData)
      .eq("id", jobId);

    // Generate results when job completes
    if (progress === 100) {
      await generateForecastResults(jobId);
    }
  }
}

// Helper function to generate forecast results
async function generateForecastResults(jobId: string) {
  const { data: job } = await supabase
    .from("forecast_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) return;

  const currentYear = 2025;
  const predictions = [];

  // Generate predictions for each year
  for (let i = 0; i <= 10; i++) {
    predictions.push({
      year: currentYear + i,
      date: `${currentYear + i}-01-01`,
      trl: Math.min(4 + i * 0.4, 9),
      adoptionShare: Math.min(5 + i * 8.5, 85),
      marketSize: Math.min(10 + i * 6.2, 78),
      confidence: Math.max(95 - i * 2, 75),
    });
  }

  const featureImportance = [
    {
      feature: "Patent Filing Rate",
      importance: 0.35,
      impact: "positive",
      description: "Strong increase in patent filings indicates active innovation",
    },
    {
      feature: "Research Publication Velocity",
      importance: 0.28,
      impact: "positive",
      description: "Rapid growth in peer-reviewed publications",
    },
    {
      feature: "Venture Capital Investment",
      importance: 0.22,
      impact: "positive",
      description: "Growing VC interest indicates market confidence",
    },
  ];

  // Insert result
  await supabase.from("forecast_results").insert([
    {
      job_id: jobId,
      model_id: job.model_id,
      tech_id: job.tech_ids[0],
      tech_name: "Technology Name", // Would come from tech database
      scenario: job.scenario,
      predictions,
      metrics: {
        finalTRL: 8.4,
        peakAdoption: 85,
        peakAdoptionYear: 2034,
        marketSizeYear5: 52.4,
        breakEvenYear: 2029,
        confidenceScore: 87,
      },
      uncertainty: {
        upper: predictions.map((p: any) => p.adoptionShare * 1.15),
        lower: predictions.map((p: any) => p.adoptionShare * 0.85),
        confidenceLevel: 95,
      },
      explainability: featureImportance,
      top_influencing_sources: [],
      compute_time: "1m 45s",
    },
  ]);
}