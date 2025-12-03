import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if data already exists
    const { count: domainCount } = await supabase
      .from("onboarding_domains")
      .select("*", { count: "exact", head: true });

    if (domainCount && domainCount > 0) {
      return NextResponse.json(
        {
          message: "Database already seeded",
          domainCount,
        },
        { status: 200 }
      );
    }

    // Seed Domains
    const domains = [
      {
        id: "dom-001",
        name: "Artificial Intelligence",
        category: "Computing",
        description:
          "Machine learning, neural networks, NLP, computer vision",
        icon: "ai",
        technology_count: 1250,
      },
      {
        id: "dom-002",
        name: "Quantum Computing",
        category: "Computing",
        description: "Quantum processors, algorithms, error correction",
        icon: "quantum",
        technology_count: 450,
      },
      {
        id: "dom-003",
        name: "Biotechnology",
        category: "Life Sciences",
        description: "Gene editing, synthetic biology, drug discovery",
        icon: "biotech",
        technology_count: 890,
      },
      {
        id: "dom-004",
        name: "Clean Energy",
        category: "Energy",
        description: "Solar, wind, batteries, hydrogen, carbon capture",
        icon: "energy",
        technology_count: 780,
      },
      {
        id: "dom-005",
        name: "Robotics",
        category: "Engineering",
        description: "Autonomous systems, industrial robots, drones",
        icon: "robotics",
        technology_count: 620,
      },
      {
        id: "dom-006",
        name: "Blockchain",
        category: "Computing",
        description: "Distributed ledgers, smart contracts, Web3",
        icon: "blockchain",
        technology_count: 340,
      },
      {
        id: "dom-007",
        name: "Advanced Materials",
        category: "Materials Science",
        description: "Graphene, metamaterials, nanocomposites",
        icon: "materials",
        technology_count: 520,
      },
      {
        id: "dom-008",
        name: "Space Technology",
        category: "Aerospace",
        description: "Satellites, launch systems, space exploration",
        icon: "space",
        technology_count: 280,
      },
    ];

    const { error: domainsError } = await supabase
      .from("onboarding_domains")
      .insert(domains);

    if (domainsError) {
      console.error("Error seeding domains:", domainsError);
      return NextResponse.json(
        { error: "Failed to seed domains", details: domainsError.message },
        { status: 500 }
      );
    }

    // Seed Connector Presets
    const connectorPresets = [
      {
        id: "conn-001",
        name: "USPTO Patents",
        provider: "USPTO",
        description: "US patent database with full-text search",
        category: "Patents",
        recommended: true,
        requires_auth: true,
      },
      {
        id: "conn-002",
        name: "arXiv Research",
        provider: "arXiv",
        description: "Open-access scientific papers",
        category: "Research",
        recommended: true,
        requires_auth: false,
      },
      {
        id: "conn-003",
        name: "Crunchbase",
        provider: "Crunchbase",
        description: "Startup funding and investor data",
        category: "Funding",
        recommended: true,
        requires_auth: true,
      },
      {
        id: "conn-004",
        name: "PubMed",
        provider: "NIH",
        description: "Biomedical research literature",
        category: "Research",
        recommended: false,
        requires_auth: false,
      },
      {
        id: "conn-005",
        name: "European Patents",
        provider: "EPO",
        description: "European patent database",
        category: "Patents",
        recommended: false,
        requires_auth: true,
      },
      {
        id: "conn-006",
        name: "IEEE Xplore",
        provider: "IEEE",
        description: "Technical literature in engineering and technology",
        category: "Research",
        recommended: false,
        requires_auth: true,
      },
    ];

    const { error: connectorsError } = await supabase
      .from("onboarding_connector_presets")
      .insert(connectorPresets);

    if (connectorsError) {
      console.error("Error seeding connectors:", connectorsError);
      return NextResponse.json(
        {
          error: "Failed to seed connectors",
          details: connectorsError.message,
        },
        { status: 500 }
      );
    }

    // Seed Watchlist Suggestions
    const watchlistSuggestions = [
      {
        id: "watch-001",
        name: "GPT Language Models",
        type: "technology",
        description: "Large language models for text generation",
        user_id: "suggestions",
        activity_count: 45,
      },
      {
        id: "watch-002",
        name: "OpenAI",
        type: "organization",
        description: "Leading AI research organization",
        user_id: "suggestions",
        activity_count: 128,
      },
      {
        id: "watch-003",
        name: "CRISPR",
        type: "technology",
        description: "Gene editing technology",
        user_id: "suggestions",
        activity_count: 67,
      },
      {
        id: "watch-004",
        name: "quantum supremacy",
        type: "keyword",
        description: "Quantum computing milestone",
        user_id: "suggestions",
        activity_count: 23,
      },
      {
        id: "watch-005",
        name: "Solid State Batteries",
        type: "technology",
        description: "Next-generation battery technology",
        user_id: "suggestions",
        activity_count: 89,
      },
      {
        id: "watch-006",
        name: "Tesla",
        type: "organization",
        description: "Electric vehicles and energy storage",
        user_id: "suggestions",
        activity_count: 234,
      },
    ];

    const { error: watchlistError } = await supabase
      .from("onboarding_watchlist")
      .insert(watchlistSuggestions);

    if (watchlistError) {
      console.error("Error seeding watchlist:", watchlistError);
      return NextResponse.json(
        {
          error: "Failed to seed watchlist",
          details: watchlistError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Database seeded successfully",
        domainsCreated: domains.length,
        connectorsCreated: connectorPresets.length,
        watchlistSuggestionsCreated: watchlistSuggestions.length,
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