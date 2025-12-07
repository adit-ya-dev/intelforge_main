// app/api/admin-ingestion/connectors/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-admin-ingestion";

/**
 * Helper to safely resolve context.params which may be either
 * a plain object or a Promise depending on Next's internal typing.
 */
async function resolveParams(context: any) {
  const maybeParams = context?.params;
  if (!maybeParams) return undefined;

  // If params is a Promise, await it; otherwise use it directly.
  const resolved = maybeParams instanceof Promise ? await maybeParams : maybeParams;
  return resolved;
}

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await resolveParams(context);
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("data_connectors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // handle not found error or other DB error
      if ((error as any).code === "PGRST116") {
        return NextResponse.json({ error: "Connector not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to fetch connector", details: (error as any).message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await resolveParams(context);
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from("data_connectors")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update connector", details: (error as any).message },
        { status: 500 }
      );
    }

    // Log the update (best-effort; do not fail the request if logging fails)
    try {
      await supabase.from("ingestion_logs").insert([
        {
          level: "info",
          connector_id: id,
          message: `Connector "${(data as any)?.name ?? id}" updated`,
          retryable: false,
          retry_count: 0,
          max_retries: 3,
        },
      ]);
    } catch (logErr) {
      console.warn("Failed to write ingestion log:", logErr);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await resolveParams(context);
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    // First, get the connector name for logging (optional)
    const { data: connector, error: fetchErr } = await supabase
      .from("data_connectors")
      .select("name")
      .eq("id", id)
      .single();

    if (fetchErr && (fetchErr as any).code !== "PGRST116") {
      // non-not-found fetch error
      return NextResponse.json(
        { error: "Failed to fetch connector for deletion", details: (fetchErr as any).message },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("data_connectors").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete connector", details: (error as any).message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Connector "${(connector as any)?.name ?? id}" deleted successfully` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
