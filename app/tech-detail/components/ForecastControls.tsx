"use client";

import { useState } from "react";
import { ForecastModel } from "@/types/tech-detail";
import {
  Play,
  Settings,
  Info,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface ForecastControlsProps {
  model: ForecastModel;
  onForecastRun: (model: string, scenario: string) => void;
}

export default function ForecastControls({
  model,
  onForecastRun,
}: ForecastControlsProps) {
  const [selectedModel, setSelectedModel] = useState<string>("ml-ensemble");
  const [selectedScenario, setSelectedScenario] = useState<string>("baseline");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showInputSources, setShowInputSources] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const modelOptions = [
    {
      value: "ml-ensemble",
      label: "ML Ensemble",
      description: "Combines multiple machine learning models for robust predictions",
    },
    {
      value: "s-curve",
      label: "S-Curve Fitting",
      description: "Classic technology adoption curve model",
    },
    {
      value: "expert-hybrid",
      label: "Expert Hybrid",
      description: "Blends ML predictions with expert assessments",
    },
  ];

  const scenarioOptions = [
    {
      value: "optimistic",
      label: "Optimistic",
      description: "Best-case scenario with favorable conditions",
      color: "text-green-500",
    },
    {
      value: "baseline",
      label: "Baseline",
      description: "Most likely scenario based on current trends",
      color: "text-blue-500",
    },
    {
      value: "pessimistic",
      label: "Pessimistic",
      description: "Conservative scenario with potential setbacks",
      color: "text-orange-500",
    },
  ];

  const handleRunForecast = async () => {
    setIsRunning(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onForecastRun(selectedModel, selectedScenario);
    setIsRunning(false);
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const currentScenario = model.scenarios.find(
    (s) => s.scenario === selectedScenario
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Forecast Controls
          </h2>
          <p className="text-sm text-muted-foreground">
            Re-run forecasts with different models and scenarios
          </p>
        </div>

        <button
          onClick={handleRunForecast}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isRunning
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isRunning ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Run Forecast</span>
            </>
          )}
        </button>
      </div>

      {/* Current Model Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Current Model</span>
          </div>
          <div className="font-semibold text-foreground">{model.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            v{model.version}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Accuracy Score</span>
          </div>
          <div className={`text-2xl font-bold ${getAccuracyColor(model.accuracy.score)}`}>
            {model.accuracy.score}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            ±{model.accuracy.historicalError}% error
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Updated</span>
          </div>
          <div className="font-semibold text-foreground">
            {new Date(model.lastRun).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(model.lastRun).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-4 mb-6">
        <label className="text-sm font-semibold text-foreground block">
          Forecast Model
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {modelOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedModel(option.value)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedModel === option.value
                  ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                  : "bg-card border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="font-medium text-foreground mb-1">
                {option.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="space-y-4 mb-6">
        <label className="text-sm font-semibold text-foreground block">
          Scenario
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarioOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedScenario(option.value)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedScenario === option.value
                  ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                  : "bg-card border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className={`font-medium mb-1 ${option.color}`}>
                {option.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scenario Details */}
      {currentScenario && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {currentScenario.scenario.charAt(0).toUpperCase() +
              currentScenario.scenario.slice(1)}{" "}
            Scenario Predictions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {currentScenario.predictions.map((pred, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {pred.date}
                </div>
                <div className="text-lg font-bold text-foreground">
                  TRL {pred.trl}
                </div>
                {pred.marketSize && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ${pred.marketSize}B market
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border">
            <div className="text-xs font-medium text-foreground mb-2">
              Key Assumptions:
            </div>
            <ul className="space-y-1">
              {currentScenario.keyAssumptions.slice(0, 3).map((assumption, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Model Explanation */}
      <div className="border-t border-border pt-6">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full mb-4"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              Why This Forecast?
            </h3>
          </div>
          {showExplanation ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {showExplanation && (
          <div className="space-y-6">
            {/* Top Drivers */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Top Drivers
              </h4>
              <div className="space-y-3">
                {model.explanation.topDrivers.map((driver, idx) => (
                  <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-foreground">
                        {driver.factor}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          driver.impact > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {driver.impact > 0 ? "+" : ""}
                        {driver.impact}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${
                          driver.impact > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.abs(driver.impact)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {driver.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Methodology
              </h4>
              <p className="text-sm text-muted-foreground">
                {model.explanation.methodology}
              </p>
            </div>

            {/* Limitations */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Known Limitations
              </h4>
              <ul className="space-y-2">
                {model.explanation.limitations.map((limitation, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Input Sources */}
      <div className="border-t border-border pt-6 mt-6">
        <button
          onClick={() => setShowInputSources(!showInputSources)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-base font-semibold text-foreground">
            Input Sources ({model.inputSources.length})
          </h3>
          {showInputSources ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {showInputSources && (
          <div className="space-y-2">
            {model.inputSources.map((input) => (
              <div
                key={input.sourceId}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm mb-1">
                    {input.sourceId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {input.contribution}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {Math.round(input.weight * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">weight</div>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}