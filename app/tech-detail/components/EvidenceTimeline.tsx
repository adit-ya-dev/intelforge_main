"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Lightbulb,
  Users,
  DollarSign,
  Award,
  Newspaper,
  Scale,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { TimelineEvent, SourceType } from "@/types/tech-detail";
import { mockTimelineEvents } from "@/lib/tech-detail-mock-data";

interface EvidenceTimelineProps {
  techId: string;
  onEvidenceHighlight: (evidenceIds: string[]) => void;
  highlightedEvidenceIds: string[];
}

export default function EvidenceTimeline({
  techId,
  onEvidenceHighlight,
  highlightedEvidenceIds,
}: EvidenceTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SourceType[]>([
    "patent",
    "paper",
    "demo",
    "startup",
    "funding",
    "news",
  ]);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load timeline events
    setEvents(mockTimelineEvents);
    setFilteredEvents(mockTimelineEvents);
  }, [techId]);

  useEffect(() => {
    // Filter events based on selected types
    const filtered = events.filter((event) => selectedTypes.includes(event.type));
    setFilteredEvents(filtered);
  }, [events, selectedTypes]);

  const getEventIcon = (type: SourceType) => {
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
      case "regulation":
        return <Scale className={iconClass} />;
      case "standard":
        return <BookOpen className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getEventColor = (type: SourceType) => {
    switch (type) {
      case "patent":
        return "bg-blue-500/20 border-blue-500 text-blue-400";
      case "paper":
        return "bg-purple-500/20 border-purple-500 text-purple-400";
      case "demo":
        return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
      case "startup":
        return "bg-green-500/20 border-green-500 text-green-400";
      case "funding":
        return "bg-emerald-500/20 border-emerald-500 text-emerald-400";
      case "news":
        return "bg-orange-500/20 border-orange-500 text-orange-400";
      case "regulation":
        return "bg-red-500/20 border-red-500 text-red-400";
      case "standard":
        return "bg-cyan-500/20 border-cyan-500 text-cyan-400";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const toggleTypeFilter = (type: SourceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    onEvidenceHighlight([event.id]);
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  };

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = 300;
      timelineRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Group events by year for better visualization
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const years = Object.keys(groupedEvents).sort();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Evidence Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Click on events to view source details and evidence links
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTimeline("left")}
            className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTimeline("right")}
            className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Filter by type:</span>
        {(
          ["patent", "paper", "demo", "startup", "funding", "news"] as SourceType[]
        ).map((type) => (
          <button
            key={type}
            onClick={() => toggleTypeFilter(type)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              selectedTypes.includes(type)
                ? getEventColor(type)
                : "bg-background border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {getEventIcon(type)}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          ref={timelineRef}
          className="overflow-x-auto pb-4"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          <div
            className="relative min-w-max"
            style={{
              transform: `scaleX(${zoomLevel})`,
              transformOrigin: "left",
            }}
          >
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />

            {/* Year Sections */}
            <div className="flex gap-8">
              {years.map((year, yearIndex) => (
                <div key={year} className="relative min-w-[200px]">
                  {/* Year Label */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                      <span className="text-sm font-semibold">{year}</span>
                      <span className="text-xs text-muted-foreground">
                        ({groupedEvents[year].length})
                      </span>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="space-y-3 pt-4">
                    {groupedEvents[year].map((event, eventIndex) => {
                      const isHighlighted = highlightedEvidenceIds.includes(event.id);
                      const isHovered = hoveredEvent === event.id;

                      return (
                        <div
                          key={event.id}
                          className="relative"
                          style={{
                            marginLeft: `${eventIndex * 8}px`,
                          }}
                        >
                          {/* Connection Line */}
                          <div className="absolute -top-4 left-6 w-0.5 h-4 bg-border" />

                          {/* Event Card */}
                          <button
                            onClick={() => handleEventClick(event)}
                            onMouseEnter={() => setHoveredEvent(event.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                            className={`relative block w-full text-left p-3 rounded-lg border transition-all ${
                              isHighlighted
                                ? "ring-2 ring-primary bg-primary/5"
                                : isHovered
                                ? "bg-muted border-muted-foreground/30"
                                : "bg-card border-border hover:border-muted-foreground/30"
                            }`}
                          >
                            {/* Icon Badge */}
                            <div
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full border mb-2 ${getEventColor(
                                event.type
                              )}`}
                            >
                              {getEventIcon(event.type)}
                            </div>

                            {/* Content */}
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                                {event.title}
                              </h4>
                              {event.organization && (
                                <p className="text-xs text-muted-foreground">
                                  {event.organization}
                                </p>
                              )}

                              {/* Impact Score */}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${event.impactScore}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {event.impactScore}
                                </span>
                              </div>
                            </div>

                            {/* Hover Preview */}
                            {isHovered && (
                              <div className="absolute bottom-full left-0 mb-2 w-80 bg-popover border border-border rounded-lg shadow-lg p-4 z-50">
                                <div className="flex items-start gap-3 mb-3">
                                  <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border ${getEventColor(
                                      event.type
                                    )}`}
                                  >
                                    {getEventIcon(event.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-foreground mb-1">
                                      {event.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{event.organization}</span>
                                      {event.country && (
                                        <>
                                          <span>•</span>
                                          <span>{event.country}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {event.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {event.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Impact Score:</span>
          <span>0-30: Low</span>
          <span>30-70: Medium</span>
          <span>70-100: High</span>
        </div>
      </div>
    </div>
  );
}