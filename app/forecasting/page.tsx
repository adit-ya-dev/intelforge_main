"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ModelCatalog from "./components/ModelCatalog";
import ModelDetailPanel from "./components/Modeldetailpanel";
import ScenarioBuilder from "./components/Scenariobuilder";
import RunPanel from "./components/Runpanel";
import ResultViewer from "./components/Resultviewer";
import ExplainabilityPanel from "./components/Explainabilitypanel";
import ModelComparison from "./components/Modelcomparison";
import ScheduledRunsManager from "./components/Scheduledrunsmanager";
import ExportSchedulePanel from "./components/Exportschedulepanel";
import SimpleLoadingState from "./components/Loadingstate";

import {
  fetchModels,
  fetchModelDetail,
  fetchScenarioPresets,
  createForecastJob,
  fetchJobStatus,
  fetchJobResults,
  incrementModelUsage,
} from "@/lib/forecasting-api";

import type {
  ModelCatalogItem,
  ModelDetail,
  ScenarioPreset,
  ScenarioParameters,
  ForecastJob,
  ForecastResult,
} from "@/types/forecasting";

export default function ForecastingModelsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Models
  const [models, setModels] = useState<ModelCatalogItem[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [modelDetail, setModelDetail] = useState<ModelDetail | null>(null);
  const [loadingModelDetail, setLoadingModelDetail] = useState(false);
  
  // Scenarios
  const [scenarioPresets, setScenarioPresets] = useState<ScenarioPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>("preset-002");
  const [scenarioParams, setScenarioParams] = useState<ScenarioParameters>({
    horizon: 10,
    investmentMultiplier: 1.0,
    adoptionFactor: 1.0,
    regulatoryShock: 0.0,
  });
  
  // Run State
  const [selectedTechs, setSelectedTechs] = useState<string[]>(["tech-001"]);
  const [currentJob, setCurrentJob] = useState<ForecastJob | null>(null);
  const [results, setResults] = useState<ForecastResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Comparison
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedModels, setComparedModels] = useState<string[]>([]);
  
  // View State
  const [activeView, setActiveView] = useState<"catalog" | "detail" | "results">("catalog");

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch models from API
        const modelsData = await fetchModels({ 
          status: "ready", 
          pageSize: 50 
        });
        
        // Fetch scenario presets from API
        const presetsData = await fetchScenarioPresets(true);
        
        setModels(modelsData.models || []);
        setScenarioPresets(presetsData.presets || []);
        
        // Auto-select first published model
        const defaultModel = modelsData.models?.find((m: ModelCatalogItem) => m.is_published);
        if (defaultModel) {
          setSelectedModelId(defaultModel.id);
        }
      } catch (error: any) {
        console.error("Error loading forecasting data:", error);
        setError(error.message || "Failed to load forecasting data");
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Load model detail when selected
  useEffect(() => {
    if (selectedModelId) {
      loadModelDetail();
    }
  }, [selectedModelId]);

  const loadModelDetail = async () => {
    if (!selectedModelId) return;
    
    setLoadingModelDetail(true);
    try {
      const detail = await fetchModelDetail(selectedModelId);
      
      // Transform API response to match ModelDetail type
      const transformedModel: ModelDetail = {
        ...detail.model,
        training: detail.model.training || {
          lastTrained: detail.model.last_trained,
          trainingDuration: detail.model.training_duration || "N/A",
          datasetSize: detail.model.dataset_size || 0,
          dataSources: detail.model.data_sources || [],
          features: detail.model.features || [],
          hyperparameters: detail.model.hyperparameters || {},
        },
        performance: detail.model.performance || {
          accuracy: detail.model.accuracy,
          mae: detail.model.mae || 0,
          rmse: detail.model.rmse || 0,
          r2Score: detail.model.r2_score || 0,
          confidenceInterval: detail.model.confidence_interval || [0, 100],
          validationSamples: detail.model.validation_samples || 0,
        },
        metadata: detail.model.metadata || {
          createdBy: detail.model.created_by,
          createdAt: detail.model.created_at,
          lastModified: detail.model.last_modified,
          approvedBy: detail.model.approved_by,
          approvalDate: detail.model.approval_date,
          usageCount: detail.model.usage_count,
          avgRunTime: detail.model.avg_run_time || "N/A",
        },
        provenance: detail.model.provenance || {
          codeVersion: detail.model.version,
          repository: detail.model.repository || "",
          commit: detail.model.commit || "",
          dependencies: detail.model.dependencies || {},
          environment: detail.model.environment || {},
        },
        changelog: detail.model.changelog || [],
      };
      
      setModelDetail(transformedModel);
    } catch (error) {
      console.error("Error loading model detail:", error);
    }
    setLoadingModelDetail(false);
  };

  // Load scenario preset
  useEffect(() => {
    if (selectedPreset && scenarioPresets.length > 0) {
      const preset = scenarioPresets.find(p => p.id === selectedPreset);
      if (preset) {
        setScenarioParams(preset.parameters);
      }
    }
  }, [selectedPreset, scenarioPresets]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setActiveView("detail");
  };

  const handleRunForecast = async () => {
    if (!selectedModelId) return;
    
    setIsRunning(true);
    setActiveView("results");
    setError(null);
    
    try {
      // Create forecast job
      const jobResponse = await createForecastJob({
        modelId: selectedModelId,
        techIds: selectedTechs,
        scenario: selectedPreset || "custom",
        parameters: scenarioParams,
        createdBy: "current-user",
      });
      
      // Increment model usage count
      await incrementModelUsage(selectedModelId);
      
      // Poll for job status
      const jobId = jobResponse.jobId;
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetchJobStatus(jobId);
          const job = statusResponse.job;
          
          setCurrentJob(job);
          
          if (job.status === "completed") {
            clearInterval(pollInterval);
            
            // Fetch results
            const resultsResponse = await fetchJobResults(jobId);
            setResults(resultsResponse.results);
            setIsRunning(false);
          } else if (job.status === "failed" || job.status === "cancelled") {
            clearInterval(pollInterval);
            setIsRunning(false);
            setError(job.error_message || "Job failed");
          }
        } catch (error: any) {
          console.error("Error polling job status:", error);
          clearInterval(pollInterval);
          setIsRunning(false);
          setError(error.message || "Failed to check job status");
        }
      }, 1000); // Poll every second
      
      // Set timeout to stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isRunning) {
          setIsRunning(false);
          setError("Job timed out");
        }
      }, 5 * 60 * 1000);
      
    } catch (error: any) {
      console.error("Error running forecast:", error);
      setIsRunning(false);
      setError(error.message || "Failed to run forecast");
    }
  };

  const handleCompareModels = (modelIds: string[]) => {
    setComparedModels(modelIds);
    setComparisonMode(true);
  };

  if (loading) {
    return (
      <SimpleLoadingState
        message="Loading Forecasting Models"
        subtext="Gathering model catalog and configurations..."
        steps={[
          "Loading model catalog",
          "Fetching scenario presets",
          "Preparing workspace",
          "Ready to forecast",
        ]}
      />
    );
  }

  if (error && models.length === 0) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Failed to Load Data</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Back to Dashboard</span>
              <span className="xs:hidden">Back</span>
            </button>

            {/* View Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("catalog")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "catalog"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Models
              </button>
              <button
                onClick={() => setActiveView("detail")}
                disabled={!selectedModelId}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "detail"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                Configure
              </button>
              <button
                onClick={() => setActiveView("results")}
                disabled={results.length === 0}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "results"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Catalog View */}
        {activeView === "catalog" && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Forecasting & Models
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Run and inspect forecasting models to produce scenario outcomes with full governance and explainability
              </p>
            </div>

            <ModelCatalog
              models={models}
              selectedModelId={selectedModelId}
              onSelectModel={handleModelSelect}
              onCompareModels={handleCompareModels}
            />

            <ScheduledRunsManager />
          </div>
        )}

        {/* Detail/Configuration View */}
        {activeView === "detail" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Model Detail */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {loadingModelDetail ? (
                <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading model details...</p>
                  </div>
                </div>
              ) : modelDetail ? (
                <ModelDetailPanel model={modelDetail} />
              ) : (
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-muted-foreground text-center">No model selected</p>
                </div>
              )}
            </div>

            {/* Right Column - Configuration & Run */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <ScenarioBuilder
                presets={scenarioPresets}
                selectedPreset={selectedPreset}
                parameters={scenarioParams}
                onPresetChange={setSelectedPreset}
                onParametersChange={setScenarioParams}
              />

              <RunPanel
                selectedModel={modelDetail}
                selectedTechs={selectedTechs}
                scenario={selectedPreset || "custom"}
                parameters={scenarioParams}
                isRunning={isRunning}
                currentJob={currentJob}
                onRun={handleRunForecast}
                onTechsChange={setSelectedTechs}
              />
            </div>
          </div>
        )}

        {/* Results View */}
        {activeView === "results" && (
          <div className="space-y-4 sm:space-y-6">
            {isRunning ? (
              <SimpleLoadingState
                message="Running Forecast"
                subtext={`Processing ${selectedTechs.length} technolog${selectedTechs.length > 1 ? "ies" : "y"}...`}
                steps={[
                  "Initializing model",
                  "Loading historical data",
                  "Computing predictions",
                  "Generating insights",
                ]}
                zIndex={10}
              />
            ) : comparisonMode && comparedModels.length > 1 ? (
              <ModelComparison
                techId={selectedTechs[0]}
                modelIds={comparedModels}
                onClose={() => setComparisonMode(false)}
              />
            ) : results.length > 0 ? (
              <>
                {results.map((result, idx) => (
                  <ResultViewer
                    key={idx}
                    result={result}
                  />
                ))}

                {results[0]?.explainability && (
                  <ExplainabilityPanel
                    modelName={modelDetail?.name || ""}
                    prediction={`Peak adoption: ${results[0].metrics.peakAdoptionYear}`}
                    confidence={results[0].metrics.confidenceScore}
                  />
                )}

                <ExportSchedulePanel />
              </>
            ) : (
              <div className="flex items-center justify-center py-12 bg-card border border-border rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No results yet. Configure and run a forecast to see predictions.
                  </p>
                  <button
                    onClick={() => setActiveView("detail")}
                    className="text-primary hover:underline"
                  >
                    Go to Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}