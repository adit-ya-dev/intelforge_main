"use client";

import { useState } from "react";

interface QuickStartProps {
  detailed?: boolean;
}

export default function QuickStart({ detailed = false }: QuickStartProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const quickActions = [
    {
      id: 1,
      title: "Search Technologies",
      description: "Start exploring with our intelligent search",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
    {
      id: 2,
      title: "View Dashboard",
      description: "Get an overview of technology trends",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      id: 3,
      title: "Explore Technologies",
      description: "Browse our technology database",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      id: 4,
      title: "Generate Report",
      description: "Create your first intelligence report",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];

  const detailedSteps = [
    {
      title: "Step 1: Configure Your Profile",
      content:
        "Set up your organization details and preferences to personalize your experience.",
      tasks: ["Add organization information", "Select your role", "Set notification preferences"],
    },
    {
      title: "Step 2: Connect Data Sources",
      content:
        "Enable connectors to start ingesting technology intelligence data.",
      tasks: ["Enable USPTO patent connector", "Configure arXiv feed", "Set up funding data sources"],
    },
  ];

  // Use neutral card + hover styles
  const cardClass =
    "bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg";
  const hoverClass = "hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/10";

  if (detailed) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Getting Started Guide</h2>

          <div className="space-y-4">
            {detailedSteps.map((step, index) => (
              <div key={index} className={`${cardClass} overflow-hidden`}>
                <button
                  onClick={() => setActiveStep(activeStep === index ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-black dark:text-white">{step.title}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-zinc-400 transition-transform ${activeStep === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeStep === index && (
                  <div className="px-4 pb-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 mb-4">{step.content}</p>
                    <div className="space-y-2">
                      {step.tasks.map((task, taskIndex) => (
                        <label key={taskIndex} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded" />
                          <span className="text-sm text-black dark:text-white">{task}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={`p-4 transition-all text-left ${cardClass} ${hoverClass}`}
          >
            <div className="mb-3">
              <svg className="w-8 h-8 text-zinc-800 dark:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <h3 className="font-medium text-sm mb-1 text-black dark:text-white">{action.title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
