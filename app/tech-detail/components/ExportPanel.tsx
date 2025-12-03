"use client";

import { useState } from "react";
import { Download, FileText, FileType, Presentation, Code } from "lucide-react";

interface ExportPanelProps {
  techId: string;
  techName: string;
}

export default function ExportPanel({ techId, techName }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "pptx" | "docx" | "json">("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeForecast, setIncludeForecast] = useState(true);
  const [maxSources, setMaxSources] = useState(20);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      value: "pdf" as const,
      label: "PDF Report",
      icon: FileText,
      description: "Comprehensive PDF document",
    },
    {
      value: "pptx" as const,
      label: "PowerPoint",
      icon: Presentation,
      description: "Presentation slides",
    },
    {
      value: "docx" as const,
      label: "Word Document",
      icon: FileType,
      description: "Editable Word document",
    },
    {
      value: "json" as const,
      label: "JSON Data",
      icon: Code,
      description: "Raw data export",
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would call the export API
    console.log("Exporting with options:", {
      techId,
      format: selectedFormat,
      includeCharts,
      includeSources,
      includeTimeline,
      includeForecast,
      maxSources,
    });

    setIsExporting(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Export Report</h2>
          <p className="text-sm text-muted-foreground">
            Download comprehensive technology intelligence report
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isExporting
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </>
          )}
        </button>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-foreground block mb-3">
          Export Format
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {formatOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedFormat(option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedFormat === option.value
                    ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                    : "bg-card border-border hover:border-muted-foreground/30"
                }`}
              >
                <Icon
                  className={`h-6 w-6 mb-2 ${
                    selectedFormat === option.value ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div className="font-medium text-foreground text-sm mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4 mb-6">
        <label className="text-sm font-semibold text-foreground block">
          Include in Export
        </label>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <div>
              <div className="font-medium text-foreground text-sm">Charts & Visualizations</div>
              <div className="text-xs text-muted-foreground">
                S-curve, hype cycle, and analytics charts
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <div>
              <div className="font-medium text-foreground text-sm">Evidence Timeline</div>
              <div className="text-xs text-muted-foreground">
                Historical events and milestones
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeTimeline}
              onChange={(e) => setIncludeTimeline(e.target.checked)}
              className="rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <div>
              <div className="font-medium text-foreground text-sm">Forecast & Predictions</div>
              <div className="text-xs text-muted-foreground">
                Model predictions and scenarios
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeForecast}
              onChange={(e) => setIncludeForecast(e.target.checked)}
              className="rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <div>
              <div className="font-medium text-foreground text-sm">Source List</div>
              <div className="text-xs text-muted-foreground">
                Detailed source citations and provenance
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeSources}
              onChange={(e) => setIncludeSources(e.target.checked)}
              className="rounded border-border"
            />
          </label>

          {/* Max Sources Slider */}
          {includeSources && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-foreground text-sm">
                  Maximum Sources
                </label>
                <span className="text-sm text-muted-foreground">{maxSources}</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxSources}
                onChange={(e) => setMaxSources(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Export Preview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Document Name:</span>
            <span className="text-foreground font-medium">{techName}_Report</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format:</span>
            <span className="text-foreground font-medium uppercase">{selectedFormat}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Size:</span>
            <span className="text-foreground font-medium">
              {includeCharts && includeSources && includeForecast
                ? "~8-12 MB"
                : includeCharts || includeSources
                ? "~4-6 MB"
                : "~1-2 MB"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sections:</span>
            <span className="text-foreground font-medium">
              {[
                "Overview",
                includeTimeline && "Timeline",
                includeCharts && "Analytics",
                includeForecast && "Forecast",
                includeSources && "Sources",
              ]
                .filter(Boolean)
                .length}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          <strong>Note:</strong> Exported reports include metadata, timestamps, and full
          provenance tracking for audit purposes. All data is current as of export time.
        </p>
      </div>
    </div>
  );
}