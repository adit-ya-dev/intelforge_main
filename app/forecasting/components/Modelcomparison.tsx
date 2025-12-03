"use client";

import { useState } from "react";
import {
  X,
  TrendingUp,
  BarChart3,
  Activity,
  Info,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getMockModelsList, getMockJobResult } from "@/lib/forecasting-mock-data";

interface ModelComparisonProps {
  techId: string;
  modelIds: string[];
  onClose: () => void;
}

export default function ModelComparison({ techId, modelIds, onClose }: ModelComparisonProps) {
  const [activeTab, setActiveTab] = useState<"predictions" | "metrics" | "accuracy">("predictions");

  // Get model details
  const allModels = getMockModelsList().models;
  const models = modelIds.map((id) => allModels.find((m) => m.id === id)).filter(Boolean);

  // Generate comparison data
  const mockResults = getMockJobResult("job-comparison");
  const predictions = mockResults.results[0].predictions;

  // Create chart data with predictions from each model
  const chartData = predictions.map((pred) => {
    const dataPoint: any = {
      year: pred.year,
    };

    models.forEach((model, idx) => {
      if (model) {
        // Add some variance to simulate different model predictions
        const variance = (idx - 1) * 5 + Math.random() * 3;
        dataPoint[model.name] = Math.max(0, Math.min(100, pred.adoptionShare + variance));
      }
    });

    return dataPoint;
  });

  // Metrics comparison data
  const metricsComparison = models.map((model) => {
    if (!model) return null;
    return {
      name: model.name,
      accuracy: model.accuracy,
      peakAdoption: 70 + Math.random() * 20,
      marketSize: 40 + Math.random() * 30,
      confidence: 75 + Math.random() * 15,
    };
  }).filter(Boolean);

  // Color palette for models
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold">Model Comparison</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Comparing {models.length} models for {techId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Download comparison"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Model Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {models.map((model, idx) => (
            model && (
              <div key={model.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="text-sm font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  v{model.version}
                </span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("predictions")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "predictions"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4" />
            Predictions
          </div>
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "metrics"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Key Metrics
          </div>
        </button>
        <button
          onClick={() => setActiveTab("accuracy")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "accuracy"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Accuracy
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "predictions" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Adoption Forecast Comparison</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="year"
                      stroke="#888"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#888"
                      style={{ fontSize: "12px" }}
                      label={{
                        value: "Adoption Share (%)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "#888" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    {models.map((model, idx) => (
                      model && (
                        <Line
                          key={model.id}
                          type="monotone"
                          dataKey={model.name}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Divergence Analysis */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Divergence Analysis</h4>
                  <p className="text-sm text-blue-300">
                    Models show {models.length > 2 ? "moderate" : "low"} divergence in peak adoption
                    timing (±2 years) but agree on overall trajectory. Greatest variance occurs in
                    years 2028-2032 due to different assumptions about breakthrough likelihood.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Metrics Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricsComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="name"
                      stroke="#888"
                      style={{ fontSize: "11px" }}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#3b82f6" name="Model Accuracy %" />
                    <Bar dataKey="peakAdoption" fill="#8b5cf6" name="Peak Adoption %" />
                    <Bar dataKey="confidence" fill="#ec4899" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold">Metric</th>
                    {models.map((model) => (
                      model && (
                        <th key={model.id} className="text-center py-3 px-2 text-sm font-semibold">
                          {model.name}
                        </th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 text-muted-foreground">Model Accuracy</td>
                    {models.map((model) => (
                      model && (
                        <td key={model.id} className="text-center py-3 px-2 font-medium">
                          {model.accuracy}%
                        </td>
                      )
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 text-muted-foreground">Peak Adoption (2034)</td>
                    {models.map((model, idx) => (
                      model && (
                        <td key={model.id} className="text-center py-3 px-2 font-medium">
                          {(70 + Math.random() * 20).toFixed(0)}%
                        </td>
                      )
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 text-muted-foreground">Market Size (Y5)</td>
                    {models.map((model) => (
                      model && (
                        <td key={model.id} className="text-center py-3 px-2 font-medium">
                          ${(40 + Math.random() * 20).toFixed(1)}B
                        </td>
                      )
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-muted-foreground">Confidence</td>
                    {models.map((model) => (
                      model && (
                        <td key={model.id} className="text-center py-3 px-2 font-medium">
                          {(75 + Math.random() * 15).toFixed(0)}%
                        </td>
                      )
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "accuracy" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Historical Accuracy Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model, idx) => (
                  model && (
                    <div
                      key={model.id}
                      className="p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[idx % colors.length] }}
                        />
                        <h4 className="font-semibold">{model.name}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Overall Accuracy:</span>
                          <span className="font-medium">{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">MAE:</span>
                          <span className="font-medium">{(2 + Math.random()).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">RMSE:</span>
                          <span className="font-medium">{(3 + Math.random() * 2).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">R² Score:</span>
                          <span className="font-medium">
                            {(0.85 + Math.random() * 0.1).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Usage Count:</span>
                          <span className="font-medium">{model.usageCount}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">Validation</div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Recommendation</h4>
                  <p className="text-sm text-green-300">
                    {models[0]?.name} shows the highest accuracy ({models[0]?.accuracy}%) and most
                    consistent performance across validation sets. Consider using it for
                    production forecasts. {models[1]?.name} offers complementary insights with
                    different methodological assumptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border p-4 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Comparison shows how different models predict the same
          technology's trajectory. Differences highlight model assumptions and methodologies.
          Consider ensemble approaches for robust forecasting.
        </p>
      </div>
    </div>
  );
}