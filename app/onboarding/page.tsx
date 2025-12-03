// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import OnboardingWizard from "./components/OnboardingWizard";
import QuickStart from "./components/QuickStart";
import GuidedTour from "./components/GuidedTour";
import SampleDataExplorer from "./components/SampleDataExplorer";
import TeamSetup from "./components/TeamSetup";
import OnboardingProgress from "./components/OnboardingProgress";
import ChecklistPanel from "./components/ChecklistPanel";
import RecommendedActions from "./components/RecommendedActions";

export default function OnboardingPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [activeView, setActiveView] =
    useState<"overview" | "quickstart" | "samples" | "team">("overview");

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Onboarding
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Let's get you set up to start discovering technology intelligence
            </p>
          </div>

          <div className="flex gap-3">
            {/* Take a Tour Button */}
            <button
              onClick={() => setShowTour(true)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 text-zinc-800 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Take a Tour
            </button>

            {/* Setup Wizard Button (was blue → now black/white) */}
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg
                className="w-5 h-5 text-white dark:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Setup Wizard
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <OnboardingProgress />

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
          {[
            {
              id: "overview",
              label: "Overview",
              icon:
                "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              id: "quickstart",
              label: "Quick Start",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              id: "samples",
              label: "Sample Data",
              icon:
                "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              id: "team",
              label: "Team Setup",
              icon:
                "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                activeView === tab.id
                  ? "border-black dark:border-white text-black dark:text-white" // ← replaced blue
                  : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4 text-current"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={tab.icon}
                />
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeView === "overview" && (
              <>
                <QuickStart />
                <RecommendedActions />
              </>
            )}
            {activeView === "quickstart" && <QuickStart detailed />}
            {activeView === "samples" && <SampleDataExplorer />}
            {activeView === "team" && <TeamSetup />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ChecklistPanel />

            {/* Help & Resources */}
            <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Help & Resources
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: "Documentation",
                    icon:
                      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                  },
                  {
                    label: "Video Tutorials",
                    icon:
                      "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
                  },
                  {
                    label: "Support Chat",
                    icon:
                      "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                  },
                  {
                    label: "Community Forum",
                    icon:
                      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className="flex items-center gap-3 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-current"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWizard && (
        <OnboardingWizard onClose={() => setShowWizard(false)} />
      )}
      {showTour && <GuidedTour onClose={() => setShowTour(false)} />}
    </div>
  );
}
