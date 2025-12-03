// app/alerts/page.tsx
'use client';

import { useState } from 'react';
import AlertsHeader from './components/Alertsheader';
import AlertsList from './components/Alertslist';
import CreateAlertWizard from './components/Createalertwizard';
import AlertHistory from './components/Alerthistory';
import WatchedTechnologies from './components/Watchedtechnologies';
import NotificationPreferences from './components/Notificationpreferences';
import RecentActivity from './components/Recentactivity';
import {
  mockAlerts,
  mockAlertMetrics,
  mockTriggeredEvents,
  mockWatchedTechnologies,
  mockNotificationPreferences,
} from '@/lib/alerts-mock-data';
import { Alert, AlertState, NotificationPreference } from '@/types/alerts';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [metrics, setMetrics] = useState(mockAlertMetrics);
  const [triggeredEvents, setTriggeredEvents] = useState(mockTriggeredEvents);
  const [watchedTechs, setWatchedTechs] = useState(mockWatchedTechnologies);
  const [preferences, setPreferences] = useState(mockNotificationPreferences);

  // Modal states
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [historyAlertId, setHistoryAlertId] = useState<string | null>(null);
  const [editingAlert, setEditingAlert] = useState<Alert | undefined>(undefined);

  // Handlers
  const handleCreateAlert = () => {
    setEditingAlert(undefined);
    setShowCreateWizard(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    setShowCreateWizard(true);
  };

  const handleSaveAlert = (alertData: Partial<Alert>) => {
    if (editingAlert) {
      // Update existing alert
      setAlerts(
        alerts.map((a) =>
          a.id === editingAlert.id
            ? { ...a, ...alertData, updatedAt: new Date().toISOString() }
            : a
        )
      );
    } else {
      // Create new alert
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        name: alertData.name || '',
        description: alertData.description || '',
        severity: alertData.severity || 'medium',
        state: 'active',
        triggerType: alertData.triggerType || 'query',
        conditions: alertData.conditions || [],
        frequency: alertData.frequency || 'daily',
        deliveryChannels: alertData.deliveryChannels || [],
        dedupRules: alertData.dedupRules || {
          enabled: true,
          window: 60,
          field: 'title',
        },
        throttle: alertData.throttle || {
          enabled: false,
          suppressionWindow: 30,
          maxEventsPerWindow: 5,
        },
        teamSubscriptions: alertData.teamSubscriptions || [],
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        triggerCount: 0,
        estimatedNoise: 15,
      };
      setAlerts([...alerts, newAlert]);
      setMetrics({
        ...metrics,
        totalAlerts: metrics.totalAlerts + 1,
        activeAlerts: metrics.activeAlerts + 1,
      });
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      const alert = alerts.find((a) => a.id === alertId);
      setAlerts(alerts.filter((a) => a.id !== alertId));
      setMetrics({
        ...metrics,
        totalAlerts: metrics.totalAlerts - 1,
        activeAlerts:
          alert?.state === 'active'
            ? metrics.activeAlerts - 1
            : metrics.activeAlerts,
        mutedAlerts:
          alert?.state === 'muted' ? metrics.mutedAlerts - 1 : metrics.mutedAlerts,
      });
    }
  };

  const handleToggleAlertState = (alertId: string, newState: AlertState) => {
    setAlerts(
      alerts.map((a) =>
        a.id === alertId
          ? { ...a, state: newState, updatedAt: new Date().toISOString() }
          : a
      )
    );
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      if (alert.state === 'active' && newState === 'muted') {
        setMetrics({
          ...metrics,
          activeAlerts: metrics.activeAlerts - 1,
          mutedAlerts: metrics.mutedAlerts + 1,
        });
      } else if (alert.state === 'muted' && newState === 'active') {
        setMetrics({
          ...metrics,
          activeAlerts: metrics.activeAlerts + 1,
          mutedAlerts: metrics.mutedAlerts - 1,
        });
      }
    }
  };

  const handleViewHistory = (alertId: string) => {
    setHistoryAlertId(alertId);
  };

  const handleToggleWatchAlerts = (techId: string) => {
    setWatchedTechs(
      watchedTechs.map((tech) =>
        tech.id === techId ? { ...tech, alertsEnabled: !tech.alertsEnabled } : tech
      )
    );
  };

  const handleRemoveWatchedTech = (techId: string) => {
    if (confirm('Remove this technology from your watchlist?')) {
      setWatchedTechs(watchedTechs.filter((tech) => tech.id !== techId));
    }
  };

  const handleAddWatchedTech = () => {
    alert('Add technology feature would integrate with Tech Explorer');
  };

  const handleUpdatePreferences = (newPreferences: NotificationPreference) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Metrics */}
        <AlertsHeader
          metrics={metrics}
          onCreateAlert={handleCreateAlert}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts List */}
          <div className="lg:col-span-2 space-y-6">
            <AlertsList
              alerts={alerts}
              onEditAlert={handleEditAlert}
              onDeleteAlert={handleDeleteAlert}
              onToggleState={handleToggleAlertState}
              onViewHistory={handleViewHistory}
            />
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <RecentActivity events={triggeredEvents} limit={8} />
          </div>
        </div>

        {/* Watched Technologies Section */}
        <WatchedTechnologies
          technologies={watchedTechs}
          onToggleAlerts={handleToggleWatchAlerts}
          onRemove={handleRemoveWatchedTech}
          onAddNew={handleAddWatchedTech}
        />
      </div>

      {/* Modals */}
      {showCreateWizard && (
        <CreateAlertWizard
          onClose={() => {
            setShowCreateWizard(false);
            setEditingAlert(undefined);
          }}
          onSave={handleSaveAlert}
          editingAlert={editingAlert}
        />
      )}

      {showSettings && (
        <NotificationPreferences
          preferences={preferences}
          onUpdate={handleUpdatePreferences}
          onClose={() => setShowSettings(false)}
        />
      )}

      {historyAlertId && (
        <AlertHistory
          alertId={historyAlertId}
          alertName={
            alerts.find((a) => a.id === historyAlertId)?.name || 'Alert History'
          }
          events={triggeredEvents}
          onClose={() => setHistoryAlertId(null)}
        />
      )}
    </div>
  );
}