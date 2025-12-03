"use client";

import { useState } from "react";
import { mockTourSteps } from "@/lib/onboarding-mock-data";

interface GuidedTourProps {
  onClose: () => void;
}

export default function GuidedTour({ onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = mockTourSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      {/* Tour Tooltip */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{current.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{current.content}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                : "text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-zinc-800" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
