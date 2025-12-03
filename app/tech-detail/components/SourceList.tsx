"use client";

import { useState } from "react";
import {
  FileText,
  Award,
  Lightbulb,
  Users,
  DollarSign,
  Newspaper,
  ExternalLink,
  Download,
  Quote,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Source, SourceType } from "@/types/tech-detail";

interface SourceListProps {
  sources: Source[];
  selectedSourceIds: string[];
  highlightedEvidenceIds: string[];
  onSourceSelect: (sourceIds: string[]) => void;
}

export default function SourceList({
  sources,
  selectedSourceIds,
  highlightedEvidenceIds,
  onSourceSelect,
}: SourceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<SourceType[]>([]);
  const [selectedConfidence, setSelectedConfidence] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "impact" | "citations">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const getSourceIcon = (type: SourceType) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "patent":
        return <Award className={iconClass} />;
      case "paper":
        return <FileText className={iconClass} />;
      case "demo":
        return <Lightbulb className={iconClass} />;
      case "startup":
        return <Users className={iconClass} />;
      case "funding":
        return <DollarSign className={iconClass} />;
      case "news":
        return <Newspaper className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getSourceColor = (type: SourceType) => {
    switch (type) {
      case "patent":
        return "text-blue-400";
      case "paper":
        return "text-purple-400";
      case "demo":
        return "text-yellow-400";
      case "startup":
        return "text-green-400";
      case "funding":
        return "text-emerald-400";
      case "news":
        return "text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-green-500/10 text-green-500 border-green-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      low: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return colors[confidence as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const toggleTypeFilter = (type: SourceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleConfidenceFilter = (confidence: string) => {
    if (selectedConfidence.includes(confidence)) {
      setSelectedConfidence(selectedConfidence.filter((c) => c !== confidence));
    } else {
      setSelectedConfidence([...selectedConfidence, confidence]);
    }
  };

  // Filter sources
  let filteredSources = sources.filter((source) => {
    const matchesSearch =
      searchQuery === "" ||
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.organization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(source.type);

    const matchesConfidence =
      selectedConfidence.length === 0 ||
      selectedConfidence.includes(source.confidence);

    return matchesSearch && matchesType && matchesConfidence;
  });

  // Sort sources
  filteredSources = [...filteredSources].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "impact":
        comparison = a.impactScore - b.impactScore;
        break;
      case "citations":
        comparison = (a.citationCount || 0) - (b.citationCount || 0);
        break;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  const handleSourceClick = (sourceId: string) => {
    if (selectedSourceIds.includes(sourceId)) {
      onSourceSelect(selectedSourceIds.filter((id) => id !== sourceId));
    } else {
      onSourceSelect([...selectedSourceIds, sourceId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSourceIds.length === filteredSources.length) {
      onSourceSelect([]);
    } else {
      onSourceSelect(filteredSources.map((s) => s.id));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div id="source-list" className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Source List</h2>
          <p className="text-sm text-muted-foreground">
            {filteredSources.length} of {sources.length} sources • {selectedSourceIds.length}{" "}
            selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedSourceIds.length > 0 && (
            <>
              <button className="px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors">
                <Quote className="h-4 w-4 inline mr-1" />
                Cite Selected
              </button>
              <button className="px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors">
                <Download className="h-4 w-4 inline mr-1" />
                Export
              </button>
            </>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors"
          >
            <Filter className="h-4 w-4 inline mr-1" />
            Filters
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sources by title or organization..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            {/* Type Filters */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Source Type
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["patent", "paper", "demo", "startup", "funding", "news"] as SourceType[]
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selectedTypes.includes(type)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {getSourceIcon(type)}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Filters */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Confidence Level
              </label>
              <div className="flex gap-2">
                {["high", "medium", "low"].map((confidence) => (
                  <button
                    key={confidence}
                    onClick={() => toggleConfidenceFilter(confidence)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selectedConfidence.includes(confidence)
                        ? getConfidenceBadge(confidence)
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {confidence.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sort By
              </label>
              <div className="flex gap-2">
                {[
                  { value: "date", label: "Date" },
                  { value: "impact", label: "Impact" },
                  { value: "citations", label: "Citations" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (sortBy === option.value) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy(option.value as any);
                        setSortOrder("desc");
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      sortBy === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label} {sortBy === option.value && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {filteredSources.length > 0 && (
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <input
            type="checkbox"
            checked={selectedSourceIds.length === filteredSources.length}
            onChange={handleSelectAll}
            className="rounded border-border"
          />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>
      )}

      {/* Source Table */}
      <div className="space-y-2">
        {filteredSources.map((source) => {
          const isSelected = selectedSourceIds.includes(source.id);
          const isHighlighted = highlightedEvidenceIds.includes(source.id);

          return (
            <div
              key={source.id}
              className={`p-4 rounded-lg border transition-all ${
                isHighlighted
                  ? "bg-primary/5 border-primary ring-2 ring-primary/30"
                  : isSelected
                  ? "bg-muted/50 border-muted-foreground/30"
                  : "bg-card border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSourceClick(source.id)}
                  className="mt-1 rounded border-border"
                />

                {/* Icon */}
                <div className={`mt-1 ${getSourceColor(source.type)}`}>
                  {getSourceIcon(source.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        {source.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                        {source.organization && (
                          <span>{source.organization}</span>
                        )}
                        {source.authors && source.authors.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{source.authors.join(", ")}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(source.date)}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getConfidenceBadge(
                          source.confidence
                        )}`}
                      >
                        {source.confidence.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {source.type}
                      </span>
                    </div>
                  </div>

                  {/* Abstract */}
                  {source.abstract && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {source.abstract}
                    </p>
                  )}

                  {/* Metrics */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${source.impactScore}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">
                        Impact: {source.impactScore}
                      </span>
                    </div>

                    {source.citationCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {source.citationCount} citations
                      </span>
                    )}

                    {source.usedInForecast && (
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>
                          Used in forecast ({Math.round((source.forecastWeight || 0) * 100)}%
                          weight)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {source.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {source.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {source.tags.length > 5 && (
                        <span className="px-2 py-0.5 text-xs text-muted-foreground">
                          +{source.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        View Source
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {source.rawDocumentUrl && (
                      <a
                        href={source.rawDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Download Raw
                        <Download className="h-3 w-3" />
                      </a>
                    )}
                    <button className="text-xs text-primary hover:underline">
                      Generate Citation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No sources match your filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTypes([]);
                setSelectedConfidence([]);
              }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}