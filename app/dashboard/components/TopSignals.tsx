// app/dashboard/components/TopSignals.tsx
"use client";

import React, { useEffect, useState } from "react";

export type Signal = {
  id: string;
  title: string;
  score?: number;
  description?: string;
  date?: string;
};

export type TopSignalsProps = {
  signals?: Signal[] | null;
  limit?: number;
};

export default function TopSignals({ signals: propSignals, limit = 8 }: TopSignalsProps) {
  const [signals, setSignals] = useState<Signal[]>(propSignals ?? []);
  const [loading, setLoading] = useState<boolean>(!Array.isArray(propSignals) || propSignals.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If prop signals provided → no fetch needed
    if (Array.isArray(propSignals) && propSignals.length > 0) {
      setSignals(propSignals);
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchSignals() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/dashboard/signals?limit=${limit}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        const data = Array.isArray(payload?.data) ? payload.data : [];

        if (active) {
          setSignals(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message ?? "Failed to load");
          setSignals([]);
          setLoading(false);
        }
      }
    }

    fetchSignals();
    return () => { active = false };
  }, [propSignals, limit]);

  return (
    <section className="w-full mt-4" aria-live="polite">
      <div className="rounded-lg border p-4 md:p-5 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg md:text-xl font-semibold">Top Signals</h3>
          <div className="text-sm text-muted-foreground">{signals.length} items</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-pulse text-sm text-muted-foreground">Loading signals…</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-4">
            <div className="text-sm text-destructive mb-1">Failed to load: {error}</div>
            <div className="text-xs text-muted-foreground">Check /api/dashboard/signals</div>
          </div>
        )}

        {/* No Data → Show Placeholder */}
        {!loading && !error && signals.length === 0 && (
          <div className="text-sm text-muted-foreground py-3">
            No signals available. Add mock data or check your API response.
          </div>
        )}

        {/* Actual Compact Signal Cards */}
        {!loading && !error && signals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {signals.map((s) => (
              <article
                key={s.id}
                className="p-2.5 rounded-md border bg-background/50 hover:shadow-md transition-all"
                style={{ minHeight: 56 }} // **Reduced card height**
              >
                {/* Title + Date */}
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm leading-tight">{s.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{s.date ?? ""}</span>
                </div>

                {/* Description */}
                {s.description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {s.description}
                  </p>
                )}

                {/* Score */}
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs font-semibold">{s.score ?? "—"}</span>
                  <span className="text-[10px] text-green-400">▲</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
