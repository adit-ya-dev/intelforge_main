// Mock Data for Forecasting & Models

import type {
  ModelCatalogItem,
  ModelDetail,
  ScenarioPreset,
  ForecastJob,
  ForecastResult,
  ScheduledRun,
  ModelsListResponse,
  ModelDetailResponse,
  JobStatusResponse,
  JobResultResponse,
  ForecastPrediction,
  FeatureImportance,
  InfluencingSource,
} from "@/types/forecasting";

// Mock Models List
export function getMockModelsList(): ModelsListResponse {
  const models: ModelCatalogItem[] = [
    {
      id: "model-001",
      name: "TechGrowth Pro",
      type: "ensemble",
      version: "2.1.0",
      description: "Ensemble model combining S-curve diffusion with patent velocity indicators",
      status: "ready",
      lastTrained: "2025-11-15T10:30:00Z",
      accuracy: 87.5,
      usageCount: 1247,
      createdBy: "Dr. Sarah Chen",
      isPublished: true,
      tags: ["production", "high-accuracy", "ensemble"],
    },
    {
      id: "model-002",
      name: "Bass Model Enhanced",
      type: "diffusion",
      version: "1.8.3",
      description: "Classic Bass diffusion model enhanced with funding signals",
      status: "ready",
      lastTrained: "2025-11-10T14:20:00Z",
      accuracy: 82.3,
      usageCount: 892,
      createdBy: "Michael Torres",
      isPublished: true,
      tags: ["production", "diffusion", "validated"],
    },
    {
      id: "model-003",
      name: "S-Curve Predictor",
      type: "arima",
      version: "3.0.1",
      description: "ARIMA-based time series forecasting with TRL progression modeling",
      status: "ready",
      lastTrained: "2025-11-18T09:15:00Z",
      accuracy: 84.7,
      usageCount: 634,
      createdBy: "Dr. Sarah Chen",
      isPublished: true,
      tags: ["production", "time-series"],
    },
    {
      id: "model-004",
      name: "LLM Trend Analyzer",
      type: "llm-trend",
      version: "1.2.0",
      description: "Large language model analyzing publication abstracts for trend signals",
      status: "training",
      lastTrained: "2025-11-01T16:45:00Z",
      accuracy: 79.1,
      usageCount: 156,
      createdBy: "Alex Kim",
      isPublished: false,
      tags: ["experimental", "nlp", "beta"],
    },
    {
      id: "model-005",
      name: "Hybrid Prophet",
      type: "hybrid",
      version: "2.3.2",
      description: "Hybrid model combining Prophet with custom innovation indicators",
      status: "ready",
      lastTrained: "2025-11-12T11:00:00Z",
      accuracy: 85.9,
      usageCount: 423,
      createdBy: "Jennifer Park",
      isPublished: true,
      tags: ["production", "hybrid"],
    },
    {
      id: "model-006",
      name: "Legacy ARIMA v1",
      type: "arima",
      version: "1.0.0",
      description: "Original ARIMA model - deprecated in favor of v3",
      status: "deprecated",
      lastTrained: "2024-08-20T10:00:00Z",
      accuracy: 71.2,
      usageCount: 2341,
      createdBy: "System",
      isPublished: false,
      tags: ["deprecated", "legacy"],
    },
  ];

  return {
    models,
    total: models.length,
    page: 1,
    pageSize: 20,
  };
}

// Mock Model Detail
export function getMockModelDetail(modelId: string): ModelDetailResponse {
  const baseModel = getMockModelsList().models.find((m) => m.id === modelId);

  if (!baseModel) {
    throw new Error(`Model ${modelId} not found`);
  }

  const model: ModelDetail = {
    ...baseModel,
    longDescription: `${baseModel.description}. This model has been extensively validated across multiple technology domains and provides robust forecasting capabilities with comprehensive uncertainty quantification. It incorporates state-of-the-art machine learning techniques and domain-specific knowledge to generate accurate predictions.`,
    
    training: {
      lastTrained: baseModel.lastTrained,
      trainingDuration: "3h 42m",
      datasetSize: 15847,
      dataSources: [
        "USPTO Patent Database",
        "ArXiv Publications",
        "Crunchbase Funding",
        "TechCrunch News",
        "IEEE Xplore",
        "PubMed",
      ],
      features: [
        "patent_filing_velocity",
        "citation_growth_rate",
        "funding_momentum",
        "publication_count",
        "market_sentiment",
        "regulatory_index",
        "competition_density",
        "talent_inflow",
      ],
      hyperparameters: {
        learning_rate: 0.001,
        n_estimators: 500,
        max_depth: 12,
        min_samples_split: 10,
        regularization_alpha: 0.05,
      },
    },
    
    performance: {
      accuracy: baseModel.accuracy,
      mae: 2.3,
      rmse: 3.7,
      r2Score: 0.89,
      confidenceInterval: [82.1, 92.9],
      validationSamples: 3169,
    },
    
    metadata: {
      createdBy: baseModel.createdBy,
      createdAt: "2024-08-15T10:00:00Z",
      lastModified: baseModel.lastTrained,
      approvedBy: "Dr. Emily Rodriguez",
      approvalDate: "2025-11-16T14:30:00Z",
      usageCount: baseModel.usageCount,
      avgRunTime: "2m 15s",
    },
    
    provenance: {
      codeVersion: baseModel.version,
      repository: "github.com/openpolitica/intelforge-models",
      commit: "a3f7b9c",
      dependencies: {
        "scikit-learn": "1.3.0",
        "pandas": "2.0.3",
        "numpy": "1.24.3",
        "prophet": "1.1.4",
      },
      environment: {
        python_version: "3.11.4",
        os: "Ubuntu 22.04",
        gpu: "NVIDIA A100",
      },
    },
    
    changelog: [
      {
        version: baseModel.version,
        date: baseModel.lastTrained,
        changes: [
          "Improved accuracy by 3.2% through ensemble refinement",
          "Added regulatory shock parameter support",
          "Optimized prediction speed by 40%",
          "Enhanced explainability features",
        ],
        author: baseModel.createdBy,
      },
      {
        version: "2.0.0",
        date: "2025-09-01T10:00:00Z",
        changes: [
          "Major architecture update",
          "Integrated funding signals",
          "Added uncertainty quantification",
        ],
        author: baseModel.createdBy,
      },
    ],
  };

  return { model };
}

// Mock Scenario Presets
export function getMockScenarioPresets(): ScenarioPreset[] {
  return [
    {
      id: "preset-001",
      name: "Conservative Growth",
      type: "conservative",
      description: "Assumes slower adoption, reduced investment, and regulatory headwinds",
      parameters: {
        horizon: 10,
        investmentMultiplier: 0.7,
        adoptionFactor: 0.6,
        regulatoryShock: -0.3,
      },
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      isPublic: true,
      usageCount: 456,
    },
    {
      id: "preset-002",
      name: "Baseline Forecast",
      type: "baseline",
      description: "Standard scenario with current trends continuing at historical rates",
      parameters: {
        horizon: 10,
        investmentMultiplier: 1.0,
        adoptionFactor: 1.0,
        regulatoryShock: 0.0,
      },
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      isPublic: true,
      usageCount: 1823,
    },
    {
      id: "preset-003",
      name: "Optimistic Outlook",
      type: "optimistic",
      description: "Assumes breakthrough innovations, increased funding, and favorable policies",
      parameters: {
        horizon: 10,
        investmentMultiplier: 1.5,
        adoptionFactor: 1.4,
        regulatoryShock: 0.3,
      },
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      isPublic: true,
      usageCount: 687,
    },
    {
      id: "preset-004",
      name: "Rapid Disruption",
      type: "optimistic",
      description: "Aggressive scenario with accelerated timeline and market disruption",
      parameters: {
        horizon: 5,
        investmentMultiplier: 2.0,
        adoptionFactor: 1.8,
        regulatoryShock: 0.5,
      },
      createdBy: "Dr. Sarah Chen",
      createdAt: "2025-06-15T10:00:00Z",
      isPublic: true,
      usageCount: 234,
    },
  ];
}

// Mock Job Status
export function getMockJobStatus(jobId: string): JobStatusResponse {
  const job: ForecastJob = {
    id: jobId,
    modelId: "model-001",
    modelName: "TechGrowth Pro",
    status: "running",
    progress: 65,
    techIds: ["tech-001"],
    scenario: "baseline",
    parameters: {
      horizon: 10,
      investmentMultiplier: 1.0,
      adoptionFactor: 1.0,
      regulatoryShock: 0.0,
    },
    createdBy: "current-user",
    createdAt: "2025-11-20T15:30:00Z",
    startedAt: "2025-11-20T15:30:15Z",
    estimatedTimeRemaining: "45 seconds",
    randomSeed: 42,
    environment: {
      python_version: "3.11.4",
      model_version: "2.1.0",
    },
  };

  return { job };
}

// Mock Job Result
export function getMockJobResult(jobId: string): JobResultResponse {
  const predictions: ForecastPrediction[] = [];
  const currentYear = 2025;

  // Generate 10 years of predictions
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i;
    predictions.push({
      year,
      date: `${year}-01-01`,
      trl: Math.min(4 + i * 0.4, 9),
      adoptionShare: Math.min(5 + i * 8.5, 85),
      marketSize: Math.min(10 + i * 6.2, 78),
      confidence: Math.max(95 - i * 2, 75),
    });
  }

  const featureImportance: FeatureImportance[] = [
    {
      feature: "Patent Filing Rate",
      importance: 0.35,
      impact: "positive",
      description: "Strong increase in patent filings indicates active innovation",
    },
    {
      feature: "Research Publication Velocity",
      importance: 0.28,
      impact: "positive",
      description: "Rapid growth in peer-reviewed publications signals advances",
    },
    {
      feature: "Venture Capital Investment",
      importance: 0.22,
      impact: "positive",
      description: "Growing VC interest indicates market confidence",
    },
    {
      feature: "Technical Barriers",
      importance: 0.18,
      impact: "negative",
      description: "Remaining technical challenges may slow adoption",
    },
    {
      feature: "Regulatory Environment",
      importance: 0.15,
      impact: "neutral",
      description: "Policy landscape is evolving but not yet defined",
    },
  ];

  const influencingSources: InfluencingSource[] = [
    {
      sourceId: "patent-12345",
      sourceType: "patent",
      title: "Quantum Error Correction Method",
      weight: 0.42,
      contribution: "Major breakthrough in error correction",
      shapValue: 2.3,
    },
    {
      sourceId: "paper-67890",
      sourceType: "publication",
      title: "Scalable Quantum Computing Architecture",
      weight: 0.38,
      contribution: "Demonstrated feasibility of large-scale systems",
      shapValue: 1.9,
    },
    {
      sourceId: "funding-11111",
      sourceType: "funding",
      title: "Series C: QuantumTech Inc ($120M)",
      weight: 0.31,
      contribution: "Significant commercial investment signal",
      shapValue: 1.5,
    },
  ];

  const results: ForecastResult[] = [
    {
      jobId,
      modelId: "model-001",
      techId: "tech-001",
      techName: "Quantum Computing",
      scenario: "baseline",
      predictions,
      metrics: {
        finalTRL: 8.4,
        peakAdoption: 85,
        peakAdoptionYear: 2034,
        marketSizeYear5: 52.4,
        breakEvenYear: 2029,
        confidenceScore: 87,
      },
      uncertainty: {
        upper: predictions.map((p) => p.adoptionShare * 1.15),
        lower: predictions.map((p) => p.adoptionShare * 0.85),
        confidenceLevel: 95,
      },
      explainability: featureImportance,
      topInfluencingSources: influencingSources,
      generatedAt: "2025-11-20T15:32:00Z",
      computeTime: "1m 45s",
    },
  ];

  return { results };
}

// Mock Scheduled Runs
export function getMockScheduledRuns(): ScheduledRun[] {
  return [
    {
      id: "sched-001",
      name: "Weekly Quantum Computing Update",
      modelId: "model-001",
      techIds: ["tech-001"],
      scenario: "baseline",
      parameters: {
        horizon: 10,
        investmentMultiplier: 1.0,
        adoptionFactor: 1.0,
        regulatoryShock: 0.0,
      },
      schedule: {
        frequency: "weekly",
        dayOfWeek: 1,
        time: "09:00",
        timezone: "America/New_York",
      },
      notifications: {
        email: ["team@company.com"],
        slack: "#tech-forecasts",
      },
      isActive: true,
      lastRun: "2025-11-18T09:00:00Z",
      nextRun: "2025-11-25T09:00:00Z",
      createdBy: "current-user",
      createdAt: "2025-10-01T10:00:00Z",
    },
    {
      id: "sched-002",
      name: "Monthly AI Market Analysis",
      modelId: "model-002",
      techIds: ["tech-002", "tech-003"],
      scenario: "optimistic",
      parameters: {
        horizon: 5,
        investmentMultiplier: 1.3,
        adoptionFactor: 1.2,
        regulatoryShock: 0.1,
      },
      schedule: {
        frequency: "monthly",
        dayOfMonth: 1,
        time: "10:00",
        timezone: "America/New_York",
      },
      notifications: {
        email: ["executives@company.com"],
      },
      isActive: true,
      lastRun: "2025-11-01T10:00:00Z",
      nextRun: "2025-12-01T10:00:00Z",
      createdBy: "current-user",
      createdAt: "2025-09-15T14:30:00Z",
    },
  ];
}