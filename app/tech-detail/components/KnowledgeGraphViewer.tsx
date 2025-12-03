"use client";

import { useState } from "react";
import { KnowledgeGraph, KnowledgeGraphNode } from "@/types/tech-detail";
import {
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Info,
  Cpu,
  Building2,
  User,
  Wallet,
  Landmark,
  FileText,
} from "lucide-react";

interface KnowledgeGraphViewerProps {
  graph: KnowledgeGraph;
  techId: string;
}

export default function KnowledgeGraphViewer({
  graph,
  techId,
}: KnowledgeGraphViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "technology",
    "company",
    "author",
    "funder",
    "institution",
  ]);

  // --- SVG icon replacements ---
  const getNodeIcon = (type: string): JSX.Element => {
    switch (type) {
      case "technology":
        return <Cpu className="h-6 w-6" />;
      case "company":
        return <Building2 className="h-6 w-6" />;
      case "author":
        return <User className="h-6 w-6" />;
      case "funder":
        return <Wallet className="h-6 w-6" />;
      case "institution":
        return <Landmark className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getNodeTypeName = (type: string) => {
    const names: Record<string, string> = {
      technology: "Technology",
      company: "Company",
      author: "Researcher",
      funder: "Investor",
      institution: "Institution",
    };
    return names[type] || type;
  };

  const getRelationshipLabel = (type: string) => {
    const labels: Record<string, string> = {
      cites: "Cites",
      funds: "Funds",
      collaborates: "Collaborates with",
      develops: "Develops",
      related: "Related to",
    };
    return labels[type] || type;
  };

  const filteredNodes = graph.nodes.filter((node) => {
    const matchesType = selectedTypes.includes(node.type);
    const matchesSearch =
      searchQuery === "" ||
      node.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getConnectedNodes = (nodeId: string) => {
    return graph.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source));
  };

  const getNodeRelationships = (nodeId: string) => {
    return graph.edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Group nodes by type
  const nodesByType = filteredNodes.reduce((acc, node) => {
    if (!acc[node.type]) {
      acc[node.type] = [];
    }
    acc[node.type].push(node);
    return acc;
  }, {} as Record<string, KnowledgeGraphNode[]>);

  return (
    <div
      className={`bg-card border border-border rounded-lg transition-all ${
        isExpanded ? "fixed inset-4 z-50" : "p-6"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Knowledge Graph
          </h2>
          <p className="text-sm text-muted-foreground">
            Interconnected ecosystem of organizations, researchers, and
            technologies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {["technology", "company", "author", "funder", "institution"].map(
            (type) => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="inline-flex items-center mr-2">
                  {getNodeIcon(type)}
                </span>
                {getNodeTypeName(type)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Graph Visualization */}
      <div
        className={`${
          isExpanded ? "h-[calc(100vh-250px)]" : "h-[500px]"
        } overflow-y-auto`}
      >
        {/* Center Node */}
        <div className="mb-6">
          {graph.nodes
            .filter((node) => node.id === graph.centerNodeId)
            .map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-center p-6 bg-primary/10 border-2 border-primary rounded-lg"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 inline-flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                      {getNodeIcon(node.type)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {node.label}
                  </h3>
                  {node.description && (
                    <p className="text-sm text-muted-foreground">
                      {node.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Connected Nodes */}
        <div className="space-y-6">
          {Object.entries(nodesByType).map(([type, nodes]) => {
            if (type === "technology" && nodes.length === 1) return null;

            const displayNodes =
              type === "technology"
                ? nodes.filter((n) => n.id !== graph.centerNodeId)
                : nodes;

            if (displayNodes.length === 0) return null;

            return (
              <div key={type}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-xl">{getNodeIcon(type)}</span>
                  {getNodeTypeName(type)}s ({displayNodes.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const relationships = getNodeRelationships(node.id);

                    return (
                      <button
                        key={node.id}
                        onClick={() =>
                          setSelectedNode(isSelected ? null : node)
                        }
                        className={`text-left p-4 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                            : "bg-card border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0"
                            style={{
                              borderColor: node.color,
                              backgroundColor: `${node.color}20`,
                            }}
                          >
                            {/* node type icon */}
                            {getNodeIcon(node.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm mb-1 truncate">
                              {node.label}
                            </h4>

                            {node.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {node.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{relationships.length} connections</span>
                            </div>
                          </div>
                        </div>

                        {isSelected && relationships.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border space-y-1">
                            {relationships.slice(0, 5).map((rel, idx) => {
                              const otherNodeId =
                                rel.source === node.id
                                  ? rel.target
                                  : rel.source;
                              const otherNode = graph.nodes.find(
                                (n) => n.id === otherNodeId
                              );

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <span className="text-muted-foreground">
                                    {getRelationshipLabel(rel.type)}
                                  </span>
                                  <span className="text-foreground font-medium truncate">
                                    {otherNode?.label}
                                  </span>
                                </div>
                              );
                            })}

                            {relationships.length > 5 && (
                              <div className="text-xs text-muted-foreground">
                                +{relationships.length - 5} more
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-muted-foreground">
              No nodes match your filters
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {graph.nodes.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Nodes</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {graph.edges.length}
            </div>
            <div className="text-xs text-muted-foreground">Connections</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {graph.nodes.filter((n) => n.type === "company").length}
            </div>
            <div className="text-xs text-muted-foreground">Organizations</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {graph.nodes.filter((n) => n.type === "author").length}
            </div>
            <div className="text-xs text-muted-foreground">Researchers</div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Click on any node to view its connections and relationships. The
          knowledge graph is automatically generated from patent citations,
          research collaborations, and funding relationships.
        </p>
      </div>
    </div>
  );
}
