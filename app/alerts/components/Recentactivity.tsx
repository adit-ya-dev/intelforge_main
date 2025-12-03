// app/alerts/components/RecentActivity.tsx
'use client';

import { Clock } from 'lucide-react';
import type { TriggeredEvent } from '@/types/alerts';

interface RecentActivityProps {
  events: TriggeredEvent[];
  limit?: number;
}

export default function RecentActivity({ events, limit = 10 }: RecentActivityProps) {
  const recentEvents = events.slice(0, limit);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest alert triggers
        </p>
      </div>

      {recentEvents.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentEvents.map((event) => (
            <div key={event.id} className="p-3 rounded-lg border">
              <p className="font-medium text-sm">{event.alertName}</p>
              <p className="text-xs text-muted-foreground">
                {event.matchedDocuments.length} documents matched
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}