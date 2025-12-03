import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/onboarding/watchlist - Get user's watchlist
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    const { data, error } = await supabase
      .from("onboarding_watchlist")
      .select("*")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch watchlist", details: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const items = (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      addedAt: item.added_at,
      lastActivity: item.last_activity,
      activityCount: item.activity_count,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Error in GET /api/onboarding/watchlist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/onboarding/watchlist - Add item to watchlist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const userId = body.userId || "default-user";

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: name, type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("onboarding_watchlist")
      .insert({
        user_id: userId,
        name: body.name,
        type: body.type,
        description: body.description || "",
        activity_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to add item", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        item: {
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description,
          addedAt: data.added_at,
          lastActivity: data.last_activity,
          activityCount: data.activity_count,
        },
        message: "Item added successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/onboarding/watchlist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/onboarding/watchlist - Remove item from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const itemId = searchParams.get("itemId");
    const userId = searchParams.get("userId") || "default-user";

    if (!itemId) {
      return NextResponse.json(
        { error: "Missing required parameter: itemId" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("onboarding_watchlist")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to remove item", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Item removed successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/onboarding/watchlist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}