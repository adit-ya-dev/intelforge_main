"use client";

import { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Target,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  Download,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ForecastResult {
  id: string;
  techName: string;
  model: string;
  timestamp: string;
  status: "success" | "partial" | "failed";
  confidence: number;
  timeHorizon: string;
  predictions: {
    adoptionRate2025: number;
    adoptionRate2030: number;
    adoptionRate2035: number;
    peakYear: number;
    marketSize2030: number;
    trlProgression: { year: number; trl: number }[];
  };
  insights: {
    type: "opportunity" | "risk" | "trend";
    title: string;
    description: string;
    confidence: number;
  }[];
  uncertainties: {
    factor: string;
    impact: "high" | "medium" | "low";
    description: string;
  }[];
}

interface ResultViewerProps {
  result: ForecastResult;
  onExport?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export default function ResultViewer({
  result,
  onExport,
  onShare,
  onSave,
}: ResultViewerProps) {
  const [expandedSection, setExpandedSection] = useState<string>("overview");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Complete";
      case "partial":
        return "Partial Results";
      case "failed":
        return "Failed";
      default:
        return "";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "trend":
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(result.status)}
              <h2 className="text-2xl font-bold">{result.techName}</h2>
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                {result.model}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(result.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {result.timeHorizon}
              </span>
              <span className="flex items-center gap-1">
                Status: {getStatusText(result.status)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Save results"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              onClick={onShare}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Share results"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Confidence</span>
            <span className="text-sm font-bold">{result.confidence}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">2025 Adoption</span>
          </div>
          <div className="text-2xl font-bold">
            {result.predictions.adoptionRate2025}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Early adopters phase
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">2030 Adoption</span>
          </div>
          <div className="text-2xl font-bold">
            {result.predictions.adoptionRate2030}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Mainstream adoption
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Peak Year</span>
          </div>
          <div className="text-2xl font-bold">{result.predictions.peakYear}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Maximum adoption
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Market Size 2030</span>
          </div>
          <div className="text-2xl font-bold">
            ${result.predictions.marketSize2030}B
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Estimated TAM
          </div>
        </div>
      </div>

      {/* TRL Progression */}
      <div className="bg-card border border-border rounded-lg p-6">
        <button
          onClick={() => toggleSection("trl")}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="text-lg font-semibold">TRL Progression Forecast</h3>
          {expandedSection === "trl" ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSection === "trl" && (
          <div className="space-y-3">
            {result.predictions.trlProgression.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className="text-sm font-medium text-muted-foreground min-w-[60px]">
                  {item.year}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      {item.trl}
                    </div>
                    <span className="text-sm font-medium">TRL {item.trl}</span>
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(item.trl / 9) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <button
          onClick={() => toggleSection("insights")}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="text-lg font-semibold">Key Insights</h3>
          {expandedSection === "insights" ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSection === "insights" && (
          <div className="space-y-3">
            {result.insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uncertainties */}
      <div className="bg-card border border-border rounded-lg p-6">
        <button
          onClick={() => toggleSection("uncertainties")}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="text-lg font-semibold">Uncertainty Factors</h3>
          {expandedSection === "uncertainties" ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSection === "uncertainties" && (
          <div className="space-y-3">
            {result.uncertainties.map((uncertainty, idx) => (
              <div
                key={idx}
                className="p-4 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{uncertainty.factor}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getImpactColor(
                          uncertainty.impact
                        )}`}
                      >
                        {uncertainty.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {uncertainty.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          <strong>Note:</strong> These forecasts are generated using {result.model}{" "}
          and are based on historical data, current trends, and expert models.
          Actual outcomes may vary due to unforeseen factors and market dynamics.
        </p>
      </div>
    </div>
  );
}