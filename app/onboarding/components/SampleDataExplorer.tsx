"use client";

import { useState } from "react";

interface SampleSearch {
  id: string;
  category: string;
  query: string;
  resultCount: string;
  description: string;
  tags: string[];
}

const mockSampleSearches: SampleSearch[] = [
  {
    id: "1",
    category: "Artificial Intelligence",
    query: "Generative Adversarial Networks",
    resultCount: "1,240",
    description: "Recent advancements in GAN architecture for image synthesis and data augmentation.",
    tags: ["AI", "Computer Vision", "Deep Learning"],
  },
  {
    id: "2",
    category: "Clean Energy",
    query: "Solid State Batteries",
    resultCount: "856",
    description: "Patents and research papers regarding electrolyte stability and manufacturing.",
    tags: ["Energy", "Batteries", "Materials"],
  },
  {
    id: "3",
    category: "Biotechnology",
    query: "CRISPR-Cas9 Delivery",
    resultCount: "3,402",
    description: "Novel viral and non-viral vectors for gene editing applications.",
    tags: ["Genomics", "CRISPR", "Pharma"],
  },
  {
    id: "4",
    category: "Quantum Computing",
    query: "Error Correction Codes",
    resultCount: "420",
    description: "Topological codes and surface codes for fault-tolerant quantum computing.",
    tags: ["Quantum", "Physics", "Algorithms"],
  },
];

export default function SampleDataExplorer() {
  const [searches] = useState(mockSampleSearches);
  const [activeView, setActiveView] = useState<"searches" | "charts" | "insights">("searches");

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">Explore Sample Data</h2>
          <div className="flex gap-2">
            {[
              { id: "searches", label: "Sample Searches", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { id: "charts", label: "Visualizations", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { id: "insights", label: "Key Insights", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${activeView === view.id ? "bg-zinc-800 text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={view.icon} />
                </svg>
                <span className="text-sm">{view.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Searches View */}
        {activeView === "searches" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searches.map((search) => (
              <div key={search.id} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-500 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium uppercase tracking-wide">{search.category}</span>
                    <h3 className="font-medium text-black dark:text-white mt-1 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">{search.query}</h3>
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {search.resultCount} results
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{search.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {search.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="px-3 py-1 text-xs bg-zinc-50 dark:bg-zinc-900/20 text-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                    Try Search
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts View */}
        {activeView === "charts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium text-black dark:text-white mb-3">Technology Adoption S-Curve</h3>
              <div className="h-48 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  <path d="M 10 140 Q 50 140 100 75 T 290 10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                  <path d="M 10 140 Q 50 140 100 75 T 200 30" stroke="#111827" strokeWidth="3" fill="none" />
                </svg>
              </div>
            </div>

            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium text-black dark:text-white mb-3">Patent Filing Timeline</h3>
              <div className="h-48 flex items-end justify-between gap-2 px-4">
                {[40, 60, 45, 70, 85, 95, 80].map((height, i) => (
                  <div key={i} className="flex-1 group">
                    <div
                      className="bg-zinc-800/80 dark:bg-zinc-700/60 rounded-t group-hover:opacity-90 transition-colors"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights View */}
        {activeView === "insights" && (
          <div className="space-y-3">
            {[
              { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Trend Analysis", value: "AI patents up 45% YoY" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time to Market", value: "18-24 months average" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "Key Players", value: "127 active organizations" },
            ].map((insight, index) => (
              <div key={index} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-200 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={insight.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{insight.label}</p>
                    <p className="text-lg font-semibold text-black dark:text-white">{insight.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
