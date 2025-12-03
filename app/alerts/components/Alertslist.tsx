// app/alerts/components/AlertsList.tsx
'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Bell,
  BellOff,
  ChevronDown,
  Clock,
  Edit2,
  MoreVertical,
  Pause,
  Play,
  Trash2,
} from 'lucide-react';
import { Alert, AlertSeverity, AlertState } from '@/types/alerts';

interface AlertsListProps {
  alerts: Alert[];
  onEditAlert: (alert: Alert) => void;
  onDeleteAlert: (alertId: string) => void;
  onToggleState: (alertId: string, state: AlertState) => void;
  onViewHistory: (alertId: string) => void;
}

export default function AlertsList({
  alerts,
  onEditAlert,
  onDeleteAlert,
  onToggleState,
  onViewHistory,
}: AlertsListProps) {
  const [filter, setFilter] = useState<'all' | AlertState>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastTriggered' | 'severity'>('lastTriggered');

  const filteredAlerts = alerts.filter(
    (alert) => filter === 'all' || alert.state === filter
  );

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'severity') {
      const severityOrder: Record<AlertSeverity, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    if (sortBy === 'lastTriggered') {
      if (!a.lastTriggered) return 1;
      if (!b.lastTriggered) return -1;
      return new Date(b.lastTriggered).getTime() - new Date(a.lastTriggered).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={alerts.length}
          >
            All Alerts
          </FilterButton>
          <FilterButton
            active={filter === 'active'}
            onClick={() => setFilter('active')}
            count={alerts.filter((a) => a.state === 'active').length}
          >
            Active
          </FilterButton>
          <FilterButton
            active={filter === 'muted'}
            onClick={() => setFilter('muted')}
            count={alerts.filter((a) => a.state === 'muted').length}
          >
            Muted
          </FilterButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="lastTriggered">Last Triggered</option>
            <option value="name">Name</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {sortedAlerts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'Create your first alert to start monitoring'
                : `No ${filter} alerts`}
            </p>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onEdit={() => onEditAlert(alert)}
              onDelete={() => onDeleteAlert(alert.id)}
              onToggleState={() =>
                onToggleState(
                  alert.id,
                  alert.state === 'active' ? 'muted' : 'active'
                )
              }
              onViewHistory={() => onViewHistory(alert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, count, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border hover:bg-accent'
      }`}
    >
      {children} <span className="ml-1.5 opacity-70">({count})</span>
    </button>
  );
}

interface AlertCardProps {
  alert: Alert;
  onEdit: () => void;
  onDelete: () => void;
  onToggleState: () => void;
  onViewHistory: () => void;
}

function AlertCard({
  alert,
  onEdit,
  onDelete,
  onToggleState,
  onViewHistory,
}: AlertCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const severityColors: Record<AlertSeverity, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              {alert.state === 'active' ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <h3 className="font-semibold truncate">{alert.name}</h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium border ${
                severityColors[alert.severity]
              }`}
            >
              {alert.severity}
            </span>
            {alert.state !== 'active' && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                {alert.state}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {alert.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="capitalize">{alert.frequency}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{alert.triggerCount} triggers</span>
            </div>
            {alert.lastTriggered && (
              <div className="flex items-center gap-1.5">
                <span>Last: {getTimeSince(alert.lastTriggered)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span>Noise: {alert.estimatedNoise}%</span>
            </div>
            <div className="flex items-center gap-1">
              {alert.deliveryChannels.map((channel) =>
                channel.enabled ? (
                  <span
                    key={channel.channel}
                    className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase"
                  >
                    {channel.channel}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-lg border border-border bg-card shadow-lg">
              <div className="p-1">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Alert
                </button>
                <button
                  onClick={() => {
                    onToggleState();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                >
                  {alert.state === 'active' ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Mute Alert
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Activate Alert
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewHistory();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                >
                  <Clock className="h-4 w-4" />
                  View History
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 text-sm text-left"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}