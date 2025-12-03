import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/onboarding/domains - Get available domains
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    // Fetch all domains
    const { data: domains, error: domainsError } = await supabase
      .from("onboarding_domains")
      .select("*")
      .order("name");

    if (domainsError) {
      console.error("Database error:", domainsError);
      return NextResponse.json(
        { error: "Failed to fetch domains", details: domainsError.message },
        { status: 500 }
      );
    }

    // Fetch user's selected domains
    const { data: userDomains, error: userDomainsError } = await supabase
      .from("onboarding_user_domains")
      .select("domain_id")
      .eq("user_id", userId);

    if (userDomainsError) {
      console.error("Database error:", userDomainsError);
      return NextResponse.json(
        { error: "Failed to fetch user domains", details: userDomainsError.message },
        { status: 500 }
      );
    }

    const selectedDomainIds = new Set(
      userDomains?.map((ud) => ud.domain_id) || []
    );

    // Transform to API format
    const transformedDomains = (domains || []).map((domain) => ({
      id: domain.id,
      name: domain.name,
      category: domain.category,
      description: domain.description,
      icon: domain.icon,
      selected: selectedDomainIds.has(domain.id),
      technologyCount: domain.technology_count,
    }));

    return NextResponse.json({ domains: transformedDomains });
  } catch (error: any) {
    console.error("Error in GET /api/onboarding/domains:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/onboarding/domains - Update user's selected domains
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.userId || "default-user";
    const domainIds = body.domainIds || [];

    if (!Array.isArray(domainIds)) {
      return NextResponse.json(
        { error: "domainIds must be an array" },
        { status: 400 }
      );
    }

    // Delete existing selections
    const { error: deleteError } = await supabase
      .from("onboarding_user_domains")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to clear existing domains", details: deleteError.message },
        { status: 500 }
      );
    }

    // Insert new selections
    if (domainIds.length > 0) {
      const insertData = domainIds.map((domainId) => ({
        user_id: userId,
        domain_id: domainId,
      }));

      const { error: insertError } = await supabase
        .from("onboarding_user_domains")
        .insert(insertData);

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save domains", details: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Domains updated successfully",
      count: domainIds.length,
    });
  } catch (error: any) {
    console.error("Error in POST /api/onboarding/domains:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}