"use client";

import { useState } from "react";
import { mockDomains } from "@/lib/onboarding-mock-data";
import { Domain } from "@/types/onboarding";

export default function DomainSelection() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleDomain = (domainId: string) => {
    setDomains(
      domains.map((d) => (d.id === domainId ? { ...d, selected: !d.selected } : d))
    );
  };

  const selectedCount = domains.filter((d) => d.selected).length;
  const filteredDomains = domains.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Selected</p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {selectedCount}/{domains.length}
          </p>
        </div>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDomains.map((domain) => (
          <div
            key={domain.id}
            onClick={() => handleToggleDomain(domain.id)}
            className={`bg-white dark:bg-black border rounded-xl p-6 cursor-pointer transition-all ${
              domain.selected
                ? "border-zinc-700 bg-zinc-50 dark:bg-zinc-900/10 text-black dark:text-white"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  domain.selected
                    ? "bg-zinc-100 dark:bg-zinc-900/30 text-zinc-900 dark:text-zinc-200"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{domain.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{domain.category}</p>
                  </div>
                  {domain.selected && (
                    <svg className="w-6 h-6 text-zinc-900 dark:text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{domain.description}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                  {domain.technologyCount.toLocaleString()} technologies
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {selectedCount < 3 && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-black dark:text-white font-medium">Recommendation</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Select at least 3 domains to get comprehensive technology coverage. This helps us provide better insights and recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
