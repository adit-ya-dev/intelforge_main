"use client";

import { useState } from "react";
import { mockOnboardingSteps } from "@/lib/onboarding-mock-data";

export default function OnboardingProgress() {
  const [steps] = useState(mockOnboardingSteps);
  const completedSteps = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">Setup Progress</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Complete these steps to get the most out of IntelForge
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black dark:text-white">{Math.round(progressPercentage)}%</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{completedSteps} of {totalSteps} complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 mb-6">
        <div
          className="bg-zinc-800 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              step.completed ? "bg-zinc-50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-700" : "bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className={`mt-0.5 ${step.completed ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-400"}`}>
              {step.completed ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${step.completed ? "text-black dark:text-white" : "text-zinc-900 dark:text-zinc-100"}`}>
                {step.title}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {step.description}
              </p>
              {step.required && !step.completed && (
                <span className="inline-block px-2 py-0.5 mt-2 text-xs bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full">
                  Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
