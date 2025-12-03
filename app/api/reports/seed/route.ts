import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if data already exists
    const { count: templateCount } = await supabase
      .from("report_templates")
      .select("*", { count: "exact", head: true });

    if (templateCount && templateCount > 0) {
      return NextResponse.json(
        {
          message: "Database already seeded",
          templateCount,
        },
        { status: 200 }
      );
    }

    // Seed Report Templates
    const templates = [
      {
        id: "template-001",
        name: "Executive Brief",
        description: "High-level overview with key metrics and trends",
        type: "executive-brief",
        thumbnail: "/templates/executive-brief.png",
        category: "standard",
        usage_count: 142,
        widgets: [
          {
            id: "w1",
            type: "metric",
            title: "Total Technologies",
            config: { label: "Technologies", value: 247 },
            position: { x: 0, y: 0, width: 3, height: 2 },
          },
          {
            id: "w2",
            type: "metric",
            title: "Active Signals",
            config: { label: "Signals This Month", value: 89 },
            position: { x: 3, y: 0, width: 3, height: 2 },
          },
          {
            id: "w3",
            type: "chart",
            title: "Technology Growth",
            config: { type: "line", dataSource: "growth-over-time" },
            position: { x: 0, y: 2, width: 6, height: 4 },
          },
        ],
      },
      {
        id: "template-002",
        name: "Patent Snapshot",
        description: "Patent analysis with citation networks and trends",
        type: "patent-snapshot",
        thumbnail: "/templates/patent-snapshot.png",
        category: "standard",
        usage_count: 98,
        widgets: [
          {
            id: "w4",
            type: "metric",
            title: "Total Patents",
            config: { label: "Patents Tracked", value: 1847 },
            position: { x: 0, y: 0, width: 3, height: 2 },
          },
          {
            id: "w5",
            type: "chart",
            title: "Patent Filings Over Time",
            config: { type: "area", dataSource: "patent-timeline" },
            position: { x: 0, y: 2, width: 9, height: 4 },
          },
          {
            id: "w6",
            type: "table",
            title: "Top Patent Holders",
            config: { dataSource: "patent-holders" },
            position: { x: 0, y: 6, width: 9, height: 4 },
          },
        ],
      },
      {
        id: "template-003",
        name: "TRL Progress Report",
        description:
          "Technology readiness level tracking and maturity analysis",
        type: "trl-progress",
        thumbnail: "/templates/trl-progress.png",
        category: "standard",
        usage_count: 76,
        widgets: [
          {
            id: "w7",
            type: "chart",
            title: "TRL Distribution",
            config: { type: "bar", dataSource: "trl-distribution" },
            position: { x: 0, y: 0, width: 6, height: 4 },
          },
          {
            id: "w8",
            type: "chart",
            title: "TRL Progress",
            config: { type: "line", dataSource: "trl-over-time" },
            position: { x: 6, y: 0, width: 6, height: 4 },
          },
        ],
      },
      {
        id: "template-004",
        name: "Technology Landscape",
        description: "Comprehensive view of technology domains and trends",
        type: "custom",
        thumbnail: "/templates/tech-landscape.png",
        category: "standard",
        usage_count: 54,
        widgets: [
          {
            id: "w9",
            type: "map",
            title: "Geographic Distribution",
            config: { dataSource: "tech-locations" },
            position: { x: 0, y: 0, width: 12, height: 6 },
          },
          {
            id: "w10",
            type: "table",
            title: "Top Technologies",
            config: { dataSource: "technologies" },
            position: { x: 0, y: 6, width: 12, height: 4 },
          },
        ],
      },
    ];

    const { error: templatesError } = await supabase
      .from("report_templates")
      .insert(templates);

    if (templatesError) {
      console.error("Error seeding templates:", templatesError);
      return NextResponse.json(
        { error: "Failed to seed templates", details: templatesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        templatesCreated: templates.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in seed endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}