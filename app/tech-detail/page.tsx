"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import TechHeader from "./components/TechHeader";
import EvidenceTimeline from "./components/EvidenceTimeline";
import TRLProgressionTracker from "./components/TRLProgressionTracker";
import ChartsArea from "./components/ChartsArea";
import KnowledgeGraphViewer from "./components/KnowledgeGraphViewer";
import SourceList from "./components/SourceList";
import ForecastControls from "./components/ForecastControls";
import NotesCollaboration from "./components/NotesCollaboration";
import ExportPanel from "./components/ExportPanel";
import LoadingState from "./components/LoadingState";

// Inline minimal type definitions
type TechnologyMetadata = {
  id: string;
  name: string;
  canonicalSummary: string;
  domains: string[];
  currentTRL: number;
  confidence: string;
  lastUpdated: string;
  isWatched: boolean;
  relatedTechCount: number;
  sourceCount: number;
};

type TRLHistoryEntry = {
  trl: number;
  date: string;
  confidence: string;
  evidenceIds: string[];
  reasoning: string;
  keyMilestones: string[];
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  attachedSourceIds?: string[];
  replies?: Comment[];
};

export default function TechDetailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<TechnologyMetadata | null>(null);
  const [trlHistory, setTrlHistory] = useState<TRLHistoryEntry[]>([]);
  const [signals, setSignals] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState<any>(null);
  const [sCurveData, setSCurveData] = useState<any>(null);
  const [hypeCurveData, setHypeCurveData] = useState<any>(null);
  const [forecastModel, setForecastModel] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [highlightedEvidenceIds, setHighlightedEvidenceIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        // Dynamic import to load mock data
        const mockDataModule = await import("@/lib/tech-detail-mock-data");

        const techDetail = mockDataModule.getMockTechDetail("tech-001");
        const techSignals = mockDataModule.getMockTechSignals("tech-001");
        const techSources = mockDataModule.getMockTechSources("tech-001");
        const graphData = mockDataModule.getMockKnowledgeGraph("tech-001");
        const forecastData = mockDataModule.getMockForecast("tech-001");

        setMetadata(techDetail.metadata);
        setTrlHistory(techDetail.trlHistory);
        setSignals(techSignals.signals);
        setSources(techSources.sources);
        setKnowledgeGraph(graphData.graph);
        setSCurveData(forecastData.sCurve);
        setHypeCurveData(forecastData.hypeCurve);
        setForecastModel(forecastData.model);
        setComments(mockDataModule.mockComments || []);
      } catch (error) {
        console.error("Error loading mock data:", error);
        // Fallback data for demonstration if mock fails
        setMetadata({
          id: "tech-001",
          name: "Solid-State Battery Technology",
          canonicalSummary: "Next-generation battery technology using solid electrolytes.",
          domains: ["Clean Energy", "Advanced Materials"],
          currentTRL: 6,
          confidence: "high",
          lastUpdated: new Date().toISOString(),
          isWatched: false,
          relatedTechCount: 23,
          sourceCount: 487,
        });
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleWatchToggle = () => {
    if (metadata) {
      setMetadata({
        ...metadata,
        isWatched: !metadata.isWatched,
      });
    }
  };

  const handleSourceSelect = (sourceIds: string[]) => {
    setSelectedSourceIds(sourceIds);
  };

  const handleEvidenceHighlight = (evidenceIds: string[]) => {
    setHighlightedEvidenceIds(evidenceIds);

    // Scroll to the source list when evidence is highlighted
    if (evidenceIds.length > 0) {
      const sourceListElement = document.getElementById("source-list");
      if (sourceListElement) {
        sourceListElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleTRLClick = (trlEntry: TRLHistoryEntry) => {
    setHighlightedEvidenceIds(trlEntry.evidenceIds);
    handleEvidenceHighlight(trlEntry.evidenceIds);
  };

  const handleForecastRun = async (model: string, scenario: string) => {
    // In a real application, this would call an API to run the forecast
    console.log("Running forecast with model:", model, "scenario:", scenario);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!metadata) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            Technology Not Found
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            The requested technology could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation - Sticky on mobile and desktop for persistent access */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            {/* Optimized for responsiveness: full text on medium/larger screens, shorter on small screens */}
            <span className="hidden md:inline">Back to Tech Explorer</span>
            <span className="md:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Summary */}
        <TechHeader
          metadata={metadata}
          onWatchToggle={handleWatchToggle}
        />

        {/* TRL Progression Tracker */}
        {trlHistory.length > 0 && (
          <TRLProgressionTracker
            trlHistory={trlHistory}
            onTRLClick={handleTRLClick}
            highlightedEvidenceIds={highlightedEvidenceIds}
          />
        )}

        {/* Evidence Timeline */}
        <EvidenceTimeline
          techId="tech-001"
          onEvidenceHighlight={handleEvidenceHighlight}
          highlightedEvidenceIds={highlightedEvidenceIds}
        />

        {/* Charts Area */}
        {signals && sCurveData && hypeCurveData && (
          <ChartsArea
            signals={signals}
            sCurveData={sCurveData}
            hypeCurveData={hypeCurveData}
          />
        )}

        {/* Knowledge Graph Viewer */}
        {knowledgeGraph && (
          <KnowledgeGraphViewer
            graph={knowledgeGraph}
            techId="tech-001"
          />
        )}

        {/* Forecast Controls */}
        {forecastModel && (
          <ForecastControls
            model={forecastModel}
            onForecastRun={handleForecastRun}
          />
        )}

        {/* Source List */}
        {sources.length > 0 && (
          <SourceList
            sources={sources}
            selectedSourceIds={selectedSourceIds}
            highlightedEvidenceIds={highlightedEvidenceIds}
            onSourceSelect={handleSourceSelect}
          />
        )}

        {/* Notes & Collaboration */}
        <NotesCollaboration
          comments={comments}
          techId="tech-001"
        />

        {/* Export Panel */}
        <ExportPanel
          techId="tech-001"
          techName={metadata.name}
        />

        {/* Bottom Spacing for Mobile */}
        <div className="h-8 sm:h-0" />
      </div>
    </div>
  );
}