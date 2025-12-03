"use client";

import { useState } from "react";
import { Play, Pause, CheckCircle2, Loader2, Search } from "lucide-react";
import type { ModelDetail, ScenarioParameters, ForecastJob } from "@/types/forecasting";

interface RunPanelProps {
  selectedModel: ModelDetail | null;
  selectedTechs: string[];
  scenario: string;
  parameters: ScenarioParameters;
  isRunning: boolean;
  currentJob: ForecastJob | null;
  onRun: () => void;
  onTechsChange: (techIds: string[]) => void;
}

// Mock available technologies
const availableTechs = [
  { id: "tech-001", name: "Solid-State Battery", trl: 6 },
  { id: "tech-002", name: "Hydrogen Fuel Cells", trl: 7 },
  { id: "tech-003", name: "Quantum Computing", trl: 4 },
  { id: "tech-004", name: "CRISPR Gene Editing", trl: 8 },
  { id: "tech-005", name: "Advanced Nuclear", trl: 5 },
];

export default function RunPanel({
  selectedModel,
  selectedTechs,
  scenario,
  parameters,
  isRunning,
  currentJob,
  onRun,
  onTechsChange,
}: RunPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchMode, setBatchMode] = useState(false);

  const filteredTechs = availableTechs.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTech = (techId: string) => {
    if (selectedTechs.includes(techId)) {
      onTechsChange(selectedTechs.filter((id) => id !== techId));
    } else {
      if (batchMode || selectedTechs.length === 0) {
        onTechsChange([...selectedTechs, techId]);
      } else {
        onTechsChange([techId]);
      }
    }
  };

  const canRun = selectedModel && selectedTechs.length > 0 && !isRunning;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Run Forecast</h2>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={batchMode}
            onChange={(e) => setBatchMode(e.target.checked)}
            className="rounded border-border"
          />
          Batch Mode
        </label>
      </div>

      {/* Technology Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Select Technology {batchMode ? "(Multiple)" : "(Single)"}
        </label>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm"
          />
        </div>

        {/* Technology List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTechs.map((tech) => {
            const isSelected = selectedTechs.includes(tech.id);
            return (
              <button
                key={tech.id}
                onClick={() => toggleTech(tech.id)}
                disabled={isRunning}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-muted-foreground/30"
                } ${isRunning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-foreground">{tech.name}</div>
                    <div className="text-xs text-muted-foreground">TRL {tech.trl}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Run Configuration Summary */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Configuration Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Model:</span>
            <div className="font-medium text-foreground truncate">
              {selectedModel?.name || "None"}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Technologies:</span>
            <div className="font-medium text-foreground">{selectedTechs.length} selected</div>
          </div>
          <div>
            <span className="text-muted-foreground">Scenario:</span>
            <div className="font-medium text-foreground capitalize">{scenario}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Horizon:</span>
            <div className="font-medium text-foreground">{parameters.horizon} years</div>
          </div>
        </div>
      </div>

      {/* Progress (if running) */}
      {isRunning && currentJob && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-sm font-medium text-blue-500">Running Forecast...</span>
            </div>
            <span className="text-sm text-muted-foreground">{currentJob.progress}%</span>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${currentJob.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Processing {selectedTechs.length} technologies...</span>
            <span>Est. {currentJob.estimatedTimeRemaining} remaining</span>
          </div>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={onRun}
        disabled={!canRun}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
          canRun
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Running...</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>Run Forecast</span>
          </>
        )}
      </button>

      {/* Validation Messages */}
      {!selectedModel && (
        <p className="text-xs text-orange-500 mt-3 text-center">
          Please select a model from the catalog
        </p>
      )}
      {selectedModel && selectedTechs.length === 0 && (
        <p className="text-xs text-orange-500 mt-3 text-center">
          Please select at least one technology
        </p>
      )}

      {/* Estimated Cost (Future Feature) */}
      {canRun && (
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Estimated compute time: ~{selectedModel?.metadata.avgRunTime || "2m"} per technology
        </div>
      )}
    </div>
  );
}