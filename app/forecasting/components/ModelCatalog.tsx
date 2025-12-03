"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  GitCompare,
  ChevronRight,
} from "lucide-react";
import type { ModelCatalogItem } from "@/types/forecasting";

interface ModelCatalogProps {
  models: ModelCatalogItem[];
  selectedModelId: string | null;
  onSelectModel: (modelId: string) => void;
  onCompareModels?: (modelIds: string[]) => void;
}

export default function ModelCatalog({
  models,
  selectedModelId,
  onSelectModel,
  onCompareModels,
}: ModelCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "training":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "deprecated":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "training":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "failed":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "deprecated":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default:
        return "";
    }
  };

  const getTypeIcon = (type: string) => {
    return <BarChart3 className="h-4 w-4" />;
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      searchQuery === "" ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || model.type === filterType;
    const matchesStatus = filterStatus === "all" || model.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCompareToggle = (modelId: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const handleStartComparison = () => {
    if (selectedForComparison.length >= 2 && onCompareModels) {
      onCompareModels(selectedForComparison);
    }
  };

  const uniqueTypes = Array.from(new Set(models.map((m) => m.type)));
  const uniqueStatuses = Array.from(new Set(models.map((m) => m.status)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Model Catalog</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <button
          onClick={() => {
            if (compareMode && selectedForComparison.length >= 2) {
              handleStartComparison();
            }
            setCompareMode(!compareMode);
          }}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            compareMode
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted"
          }`}
        >
          <GitCompare className="h-4 w-4" />
          {compareMode
            ? `Compare (${selectedForComparison.length})`
            : "Compare Models"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className={`bg-card border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedModelId === model.id
                ? "border-primary shadow-md"
                : "border-border"
            } ${!model.isPublished ? "opacity-60" : ""}`}
            onClick={() => !compareMode && onSelectModel(model.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(model.type)}
                  <h3 className="font-semibold">{model.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">v{model.version}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                      model.status
                    )}`}
                  >
                    {model.status}
                  </span>
                </div>
              </div>
              {compareMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompareToggle(model.id);
                  }}
                  className={`p-1.5 rounded ${
                    selectedForComparison.includes(model.id)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {model.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
                <div className="text-lg font-bold">{model.accuracy}%</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <BarChart3 className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Usage</span>
                </div>
                <div className="text-lg font-bold">
                  {model.usageCount > 1000
                    ? `${(model.usageCount / 1000).toFixed(1)}k`
                    : model.usageCount}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {model.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {model.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                  +{model.tags.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span>By {model.createdBy}</span>
              {!compareMode && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  Select <ChevronRight className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No models found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {compareMode && selectedForComparison.length > 0 && (
        <div className="sticky bottom-4 bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {selectedForComparison.length} model{selectedForComparison.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedForComparison.length < 2
                  ? "Select at least 2 models to compare"
                  : "Ready to compare"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCompareMode(false);
                  setSelectedForComparison([]);
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartComparison}
                disabled={selectedForComparison.length < 2}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}