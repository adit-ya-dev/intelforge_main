"use client";

import { useState } from "react";
import { Sliders, Save, RotateCcw } from "lucide-react";
import type { ScenarioPreset, ScenarioParameters } from "@/types/forecasting";

interface ScenarioBuilderProps {
  presets: ScenarioPreset[];
  selectedPreset: string | null;
  parameters: ScenarioParameters;
  onPresetChange: (presetId: string | null) => void;
  onParametersChange: (params: ScenarioParameters) => void;
}

export default function ScenarioBuilder({
  presets,
  selectedPreset,
  parameters,
  onPresetChange,
  onParametersChange,
}: ScenarioBuilderProps) {
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [newAssumption, setNewAssumption] = useState("");

  const handleSliderChange = (key: keyof ScenarioParameters, value: number) => {
    onParametersChange({ ...parameters, [key]: value });
    // Mark as custom when any slider changes
    if (selectedPreset && selectedPreset !== "custom") {
      onPresetChange("custom");
    }
  };

  const resetToDefault = () => {
    onParametersChange({
      horizon: 10,
      investmentMultiplier: 1.0,
      adoptionFactor: 1.0,
      regulatoryShock: 0.0,
    });
    onPresetChange("preset-002"); // Baseline
  };

  const addAssumption = () => {
    if (newAssumption.trim()) {
      setAssumptions([...assumptions, newAssumption.trim()]);
      setNewAssumption("");
    }
  };

  const getPresetColor = (type: string) => {
    switch (type) {
      case "conservative":
        return "border-orange-500/30 bg-orange-500/5";
      case "baseline":
        return "border-blue-500/30 bg-blue-500/5";
      case "optimistic":
        return "border-green-500/30 bg-green-500/5";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Scenario Builder</h2>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Scenario Presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.filter(p => p.isPublic).map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                selectedPreset === preset.id
                  ? getPresetColor(preset.type) + " ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <div className="font-medium text-sm text-foreground mb-1">{preset.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {preset.description}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Used {preset.usageCount} times
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-6">
        {/* Horizon */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Forecast Horizon
            </label>
            <span className="text-sm font-bold text-primary">{parameters.horizon} years</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={parameters.horizon}
            onChange={(e) => handleSliderChange("horizon", parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 year</span>
            <span>10 years</span>
            <span>20 years</span>
          </div>
        </div>

        {/* Investment Multiplier */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Investment Multiplier
            </label>
            <span className="text-sm font-bold text-primary">
              {parameters.investmentMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={parameters.investmentMultiplier}
            onChange={(e) => handleSliderChange("investmentMultiplier", parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.5x (Low funding)</span>
            <span>1.0x (Baseline)</span>
            <span>2.0x (High funding)</span>
          </div>
        </div>

        {/* Adoption Factor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Adoption Factor
            </label>
            <span className="text-sm font-bold text-primary">
              {parameters.adoptionFactor.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={parameters.adoptionFactor}
            onChange={(e) => handleSliderChange("adoptionFactor", parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.5x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>2.0x (Rapid)</span>
          </div>
        </div>

        {/* Regulatory Shock */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Regulatory Environment
            </label>
            <span
              className={`text-sm font-bold ${
                parameters.regulatoryShock > 0.3
                  ? "text-green-500"
                  : parameters.regulatoryShock < -0.3
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {parameters.regulatoryShock > 0
                ? `+${parameters.regulatoryShock.toFixed(1)}`
                : parameters.regulatoryShock.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.1"
            value={parameters.regulatoryShock}
            onChange={(e) => handleSliderChange("regulatoryShock", parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>-1.0 (Hostile)</span>
            <span>0.0 (Neutral)</span>
            <span>+1.0 (Favorable)</span>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="mt-6 pt-6 border-t border-border">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Key Assumptions (Optional)
        </label>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAssumption}
            onChange={(e) => setNewAssumption(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addAssumption()}
            placeholder="Add an assumption..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
          />
          <button
            onClick={addAssumption}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Add
          </button>
        </div>

        {assumptions.length > 0 && (
          <div className="space-y-2">
            {assumptions.map((assumption, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm bg-muted/50 px-3 py-2 rounded"
              >
                <span className="text-primary mt-0.5">•</span>
                <span className="flex-1 text-foreground">{assumption}</span>
                <button
                  onClick={() => setAssumptions(assumptions.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Preset (Future Feature) */}
      <div className="mt-6 pt-6 border-t border-border">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted transition-colors">
          <Save className="h-4 w-4" />
          Save as Custom Preset
        </button>
      </div>
    </div>
  );
}