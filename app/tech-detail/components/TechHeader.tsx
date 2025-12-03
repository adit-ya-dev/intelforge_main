"use client";

import { useState } from "react";
import { Eye, EyeOff, Share2, Download, Bell, Clock } from "lucide-react";
import { TechnologyMetadata } from "@/types/tech-detail";

interface TechHeaderProps {
  metadata: TechnologyMetadata;
  onWatchToggle: () => void;
}

export default function TechHeader({ metadata, onWatchToggle }: TechHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const getTRLColor = (trl: number) => {
    if (trl <= 3) return "text-red-400";
    if (trl <= 6) return "text-yellow-400";
    return "text-green-400";
  };

  const formatLastUpdated = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return updated.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Title Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {metadata.name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {metadata.canonicalSummary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onWatchToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
              metadata.isWatched
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            {metadata.isWatched ? (
              <>
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Watching</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="text-sm font-medium">Watch</span>
              </>
            )}
          </button>

          <button
            className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors"
            title="Create Alert"
          >
            <Bell className="h-4 w-4 text-foreground" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4 text-foreground" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <button className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors">
                  Copy Link
                </button>
                <button className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors">
                  Share via Email
                </button>
                <button className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors">
                  Export Summary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Domain Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {metadata.domains.map((domain) => (
            <span
              key={domain}
              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
            >
              {domain}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* TRL Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current TRL:</span>
          <span className={`text-2xl font-bold ${getTRLColor(metadata.currentTRL)}`}>
            {metadata.currentTRL}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getConfidenceBadgeColor(
              metadata.confidence
            )}`}
          >
            {metadata.confidence.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{metadata.sourceCount}</span> sources
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{metadata.relatedTechCount}</span> related
            technologies
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updated {formatLastUpdated(metadata.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}