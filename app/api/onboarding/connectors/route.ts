import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/onboarding/connectors - Get available connectors
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    // Fetch all connector presets
    const { data: presets, error: presetsError } = await supabase
      .from("onboarding_connector_presets")
      .select("*")
      .order("recommended", { ascending: false });

    if (presetsError) {
      console.error("Database error:", presetsError);
      return NextResponse.json(
        { error: "Failed to fetch connectors", details: presetsError.message },
        { status: 500 }
      );
    }

    // Fetch user's enabled connectors
    const { data: userConnectors, error: userConnectorsError } = await supabase
      .from("onboarding_user_connectors")
      .select("*")
      .eq("user_id", userId);

    if (userConnectorsError) {
      console.error("Database error:", userConnectorsError);
      return NextResponse.json(
        {
          error: "Failed to fetch user connectors",
          details: userConnectorsError.message,
        },
        { status: 500 }
      );
    }

    const userConnectorMap = new Map(
      userConnectors?.map((uc) => [uc.connector_id, uc]) || []
    );

    // Transform to API format
    const connectors = (presets || []).map((preset) => {
      const userConn = userConnectorMap.get(preset.id);
      return {
        id: preset.id,
        name: preset.name,
        provider: preset.provider,
        description: preset.description,
        category: preset.category,
        recommended: preset.recommended,
        requiresAuth: preset.requires_auth,
        enabled: !!userConn?.enabled,
        apiKey: userConn?.api_key ? "****" : null,
      };
    });

    return NextResponse.json({ connectors });
  } catch (error: any) {
    console.error("Error in GET /api/onboarding/connectors:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/onboarding/connectors - Enable/update connector
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.userId || "default-user";
    const connectorId = body.connectorId;
    const enabled = body.enabled !== undefined ? body.enabled : true;
    const apiKey = body.apiKey;

    if (!connectorId) {
      return NextResponse.json(
        { error: "Missing required field: connectorId" },
        { status: 400 }
      );
    }

    // Check if connector exists in presets
    const { data: preset, error: presetError } = await supabase
      .from("onboarding_connector_presets")
      .select("*")
      .eq("id", connectorId)
      .single();

    if (presetError || !preset) {
      return NextResponse.json(
        { error: "Connector not found" },
        { status: 404 }
      );
    }

    // Check if user connector exists
    const { data: existing, error: existingError } = await supabase
      .from("onboarding_user_connectors")
      .select("*")
      .eq("user_id", userId)
      .eq("connector_id", connectorId)
      .maybeSingle();

    if (existingError) {
      console.error("Database error:", existingError);
      return NextResponse.json(
        {
          error: "Failed to check existing connector",
          details: existingError.message,
        },
        { status: 500 }
      );
    }

    if (existing) {
      // Update existing
      const updateData: any = {
        enabled,
        updated_at: new Date().toISOString(),
      };
      if (apiKey !== undefined) updateData.api_key = apiKey;

      const { data, error } = await supabase
        .from("onboarding_user_connectors")
        .update(updateData)
        .eq("user_id", userId)
        .eq("connector_id", connectorId)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to update connector", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        connector: {
          id: data.connector_id,
          enabled: data.enabled,
        },
        message: "Connector updated successfully",
      });
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("onboarding_user_connectors")
        .insert({
          user_id: userId,
          connector_id: connectorId,
          enabled,
          api_key: apiKey || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to add connector", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          connector: {
            id: data.connector_id,
            enabled: data.enabled,
          },
          message: "Connector added successfully",
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error in POST /api/onboarding/connectors:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}