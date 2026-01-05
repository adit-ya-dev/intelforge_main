// Forecasting & Models Type Definitions

export type ModelType = "arima" | "diffusion" | "ensemble" | "llm-trend" | "hybrid";


export type ModelStatus = "ready" | "training" | "failed" | "deprecated";


export type JobStatus = "pending" | "running" | "completed" | "failed" | "cancelled";


export type ScenarioType = "conservative" | "baseline" | "optimistic" | "custom";


export interface ModelCatalogItem {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  description: string;
  status: ModelStatus;
  lastTrained: string;
  accuracy: number; // 0-100
  usageCount: number;
  createdBy: string;
  isPublished: boolean;
  tags: string[];
}

export interface ModelDetail {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  description: string;
  longDescription: string;
  status: ModelStatus;
  
  // Training Information
  training: {
    lastTrained: string;
    trainingDuration: string;
    datasetSize: number;
    dataSources: string[];
    features: string[];
    hyperparameters: Record<string, any>;
  };
  
  // Performance Metrics
  performance: {
    accuracy: number;
    mae: number; // Mean Absolute Error
    rmse: number; // Root Mean Square Error
    r2Score: number;
    confidenceInterval: [number, number];
    validationSamples: number;
  };
  
  // Metadata
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModified: string;
    approvedBy?: string;
    approvalDate?: string;
    usageCount: number;
    avgRunTime: string;
  };
  
  // Provenance
  provenance: {
    codeVersion: string;
    repository: string;
    commit: string;
    dependencies: Record<string, string>;
    environment: Record<string, string>;
  };
  
  tags: string[];
  isPublished: boolean;
  changelog: ModelChangelogEntry[];
}

export interface ModelChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  author: string;
}

export interface ScenarioParameters {
  horizon: number; // years
  investmentMultiplier: number; // 0.5 - 2.0
  adoptionFactor: number; // 0.5 - 2.0
  regulatoryShock: number; // -1.0 to 1.0
  marketSize?: number;
  customParams?: Record<string, any>;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  parameters: ScenarioParameters;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  usageCount: number;
}

export interface ForecastRunRequest {
  modelId: string;
  techIds: string[];
  scenario: ScenarioType | "custom";
  parameters: ScenarioParameters;
  randomSeed?: number;
  comments?: string;
  assumptions?: string[];
}

export interface ForecastJob {
  id: string;
  modelId: string;
  modelName: string;
  status: JobStatus;
  progress: number; // 0-100
  techIds: string[];
  scenario: ScenarioType | "custom";
  parameters: ScenarioParameters;
  
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  
  estimatedTimeRemaining?: string;
  errorMessage?: string;
  
  // For tracking
  randomSeed: number;
  environment: Record<string, string>;
}

export interface ForecastResult {
  jobId: string;
  modelId: string;
  techId: string;
  techName: string;
  scenario: ScenarioType | "custom";
  
  // Time series predictions
  predictions: ForecastPrediction[];
  
  // Key metrics
  metrics: {
    finalTRL: number;
    peakAdoption: number;
    peakAdoptionYear: number;
    marketSizeYear5: number; // in billions
    breakEvenYear?: number;
    confidenceScore: number; // 0-100
  };
  
  // Uncertainty
  uncertainty: {
    upper: number[];
    lower: number[];
    confidenceLevel: number; // e.g., 95
  };
  
  // Explainability
  explainability: FeatureImportance[];
  topInfluencingSources: InfluencingSource[];
  
  generatedAt: string;
  computeTime: string;
}

export interface ForecastPrediction {
  year: number;
  date: string;
  trl: number;
  adoptionShare: number; // 0-100 percentage
  marketSize: number; // in billions
  confidence: number; // 0-100
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0-1
  impact: "positive" | "negative" | "neutral";
  description: string;
}

export interface InfluencingSource {
  sourceId: string;
  sourceType: string;
  title: string;
  weight: number; // 0-1
  contribution: string;
  shapValue: number; // SHAP-like value
}

export interface ComparisonResult {
  techId: string;
  techName: string;
  models: {
    modelId: string;
    modelName: string;
    predictions: ForecastPrediction[];
    metrics: any;
  }[];
}

export interface ExportOptions {
  format: "csv" | "json" | "pdf" | "pptx";
  includeCharts: boolean;
  includeExplainability: boolean;
  includeRawData: boolean;
  includeMetadata: boolean;
}

export interface ScheduledRun {
  id: string;
  name: string;
  modelId: string;
  techIds: string[];
  scenario: ScenarioType;
  parameters: ScenarioParameters;
  
  schedule: {
    frequency: "daily" | "weekly" | "monthly";
    dayOfWeek?: number; // 0-6
    dayOfMonth?: number; // 1-31
    time: string; // HH:mm
    timezone: string;
  };
  
  notifications: {
    email?: string[];
    slack?: string;
  };
  
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalWorkflow {
  id: string;
  forecastJobId: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  approvalLevel: "analyst" | "manager" | "executive";
}

export interface ModelComparison {
  techId: string;
  models: {
    modelId: string;
    modelName: string;
    version: string;
    predictions: number[];
    metrics: Record<string, number>;
  }[];
  years: number[];
}

// API Response Types
export interface ModelsListResponse {
  models: ModelCatalogItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ModelDetailResponse {
  model: ModelDetail;
}

export interface ForecastRunResponse {
  jobId: string;
  status: JobStatus;
  estimatedTime: string;
}

export interface JobStatusResponse {
  job: ForecastJob;
}

export interface JobResultResponse {
  results: ForecastResult[];
  comparison?: ComparisonResult;
}

// UI State Types
export interface ModelFilters {
  types: ModelType[];
  status: ModelStatus[];
  minAccuracy: number;
  searchQuery: string;
  tags: string[];
}

export interface ScenarioBuilderState {
  selectedPreset: string | null;
  parameters: ScenarioParameters;
  isCustom: boolean;
  assumptions: string[];
  comments: string;
}




export interface RunPanelState {
  selectedModel: string | null;
  selectedTechs: string[];
  scenario: ScenarioType | "custom";
  isBatch: boolean;
  isRunning: boolean;
  currentJob: ForecastJob | null;
}

