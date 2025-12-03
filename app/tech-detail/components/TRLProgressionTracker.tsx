"use client";

import { Check, Info, ChevronRight } from "lucide-react";
import { TRLHistoryEntry } from "@/types/tech-detail";
import { useState } from "react";

interface TRLProgressionTrackerProps {
  trlHistory: TRLHistoryEntry[];
  onTRLClick: (entry: TRLHistoryEntry) => void;
  highlightedEvidenceIds: string[];
}

export default function TRLProgressionTracker({
  trlHistory,
  onTRLClick,
  highlightedEvidenceIds,
}: TRLProgressionTrackerProps) {
  const [expandedTRL, setExpandedTRL] = useState<number | null>(null);

  const getTRLLabel = (trl: number): string => {
    const labels: Record<number, string> = {
      1: "Basic Principles",
      2: "Concept Formulated",
      3: "Proof of Concept",
      4: "Lab Validation",
      5: "Relevant Environment",
      6: "Prototype Demo",
      7: "Operational Demo",
      8: "System Complete",
      9: "Proven System",
    };
    return labels[trl] || "Unknown";
  };

  const getTRLDescription = (trl: number): string => {
    const descriptions: Record<number, string> = {
      1: "Basic principles observed and reported",
      2: "Technology concept and/or application formulated",
      3: "Analytical and experimental critical function proof-of-concept",
      4: "Component and/or breadboard validation in laboratory environment",
      5: "Component validation in relevant environment",
      6: "System/subsystem model or prototype demonstration in relevant environment",
      7: "System prototype demonstration in operational environment",
      8: "Actual system completed and qualified through test and demonstration",
      9: "Actual system proven through successful mission operations",
    };
    return descriptions[trl] || "No description available";
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Sort TRL history by date
  const sortedHistory = [...trlHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Check if any evidence in this TRL entry is highlighted
  const isEntryHighlighted = (entry: TRLHistoryEntry): boolean => {
    return entry.evidenceIds.some((id) => highlightedEvidenceIds.includes(id));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">TRL Progression</h2>
          <p className="text-sm text-muted-foreground">
            Technology Readiness Level advancement with supporting evidence
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-primary hover:underline">
          <Info className="h-4 w-4" />
          About TRL Scale
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* TRL Entries */}
        <div className="space-y-6">
          {sortedHistory.map((entry, index) => {
            const isExpanded = expandedTRL === entry.trl;
            const isHighlighted = isEntryHighlighted(entry);
            const isLatest = index === sortedHistory.length - 1;

            return (
              <div key={`${entry.trl}-${entry.date}`} className="relative pl-16">
                {/* TRL Badge */}
                <div
                  className={`absolute left-0 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isLatest
                      ? "bg-primary text-primary-foreground border-primary"
                      : isHighlighted
                      ? "bg-primary/20 text-primary border-primary ring-2 ring-primary/30"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  <span className="text-lg font-bold">{entry.trl}</span>
                </div>

                {/* Content Card */}
                <button
                  onClick={() => {
                    setExpandedTRL(isExpanded ? null : entry.trl);
                    onTRLClick(entry);
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isHighlighted
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">
                          TRL {entry.trl}: {getTRLLabel(entry.trl)}
                        </h3>
                        {isLatest && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getTRLDescription(entry.trl)}
                      </p>
                    </div>

                    <ChevronRight
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Achieved:</span>
                      <span className="font-medium text-foreground">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getConfidenceBadgeColor(
                        entry.confidence
                      )}`}
                    >
                      {entry.confidence.toUpperCase()} Confidence
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Check className="h-4 w-4" />
                      <span>{entry.evidenceIds.length} evidence sources</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      {/* Reasoning */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Assessment Reasoning
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entry.reasoning}
                        </p>
                      </div>

                      {/* Key Milestones */}
                      {entry.keyMilestones.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            Key Milestones
                          </h4>
                          <ul className="space-y-2">
                            {entry.keyMilestones.map((milestone, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Evidence Links */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Supporting Evidence
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.evidenceIds.map((evidenceId) => {
                            const isHighlighted = highlightedEvidenceIds.includes(evidenceId);
                            return (
                              <span
                                key={evidenceId}
                                className={`px-2 py-1 text-xs rounded border ${
                                  isHighlighted
                                    ? "bg-primary/20 text-primary border-primary"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                {evidenceId}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-2">
                        <button className="text-sm text-primary hover:underline">
                          View All Evidence Sources →
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRL Scale Reference */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Research Phase (TRL 1-3)
            </h4>
            <p className="text-xs text-muted-foreground">
              Basic research and proof of concept
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Development Phase (TRL 4-6)
            </h4>
            <p className="text-xs text-muted-foreground">
              Technology validation and prototype testing
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Deployment Phase (TRL 7-9)
            </h4>
            <p className="text-xs text-muted-foreground">
              System demonstration and commercialization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}