// app/admin-ingestion/page.tsx
"use client";

import { useState } from "react";
import {
  Home,
  Plug,
  Settings,
  Upload,
  Database,
  Key,
  ScrollText,
  Plus,
} from "lucide-react";

import ConnectorsCatalog from "./components/ConnectorsCatalog";
import PipelineDashboard from "./components/PipelineDashboard";
import ManualIngest from "./components/ManualIngest";
import IndexControls from "./components/IndexControls";
import SecretsManager from "./components/SecretsManager";
import IngestionLogs from "./components/IngestionLogs";
import ConnectorSetupWizard from "./components/ConnectorSetupWizard";
import PipelineMetricsCard from "./components/PipelineMetricsCard";

export default function AdminIngestionPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "connectors" | "pipeline" | "manual" | "index" | "secrets" | "logs"
  >("overview");

  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [selectedConnectorTemplate, setSelectedConnectorTemplate] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "connectors", label: "Connectors", icon: Plug },
    { id: "pipeline", label: "Pipeline", icon: Settings },
    { id: "manual", label: "Manual Upload", icon: Upload },
    { id: "index", label: "Index Control", icon: Database },
    { id: "secrets", label: "API Keys", icon: Key },
    { id: "logs", label: "Logs", icon: ScrollText },
  ];

  const handleAddConnector = (templateId: string) => {
    setSelectedConnectorTemplate(templateId);
    setShowSetupWizard(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Data Ingestion & Pipeline
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage data sources, monitor pipeline health, and control ingestion processes
            </p>
          </div>

          <button
            onClick={() => setShowSetupWizard(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Connector
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex gap-8" aria-label="Ingestion tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid gap-8">
              <PipelineMetricsCard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PipelineDashboard />
                <IngestionLogs limit={5} />
              </div>
            </div>
          )}

          {activeTab === "connectors" && (
            <ConnectorsCatalog onAddConnector={handleAddConnector} />
          )}
          {activeTab === "pipeline" && <PipelineDashboard />}
          {activeTab === "manual" && <ManualIngest />}
          {activeTab === "index" && <IndexControls />}
          {activeTab === "secrets" && <SecretsManager />}
          {activeTab === "logs" && <IngestionLogs />}
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <ConnectorSetupWizard
          templateId={selectedConnectorTemplate}
          onClose={() => {
            setShowSetupWizard(false);
            setSelectedConnectorTemplate(null);
          }}
        />
      )}
    </div>
  );
}