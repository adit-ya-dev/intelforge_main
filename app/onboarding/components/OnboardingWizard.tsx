"use client";

import { useState } from "react";
import DomainSelection from "./DomainSelection";
import ConnectorConfiguration from "./ConnectorConfiguration";
import WatchlistBuilder from "./WatchlistBuilder";
import AlertSetup from "./AlertSetup";

interface OnboardingWizardProps {
  onClose: () => void;
}

export default function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DomainSelection />;
      case 2:
        return <ConnectorConfiguration />;
      case 3:
        return <WatchlistBuilder />;
      case 4:
        return <AlertSetup />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">Setup Wizard</h2>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex-1 relative">
                <div
                  className={`h-2 rounded-full transition-colors ${index + 1 <= currentStep ? "bg-zinc-800" : "bg-zinc-200 dark:bg-zinc-800"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">{getStepContent()}</div>

        {/* Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-black">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg transition-colors ${
                currentStep === 1 ? "text-zinc-400 cursor-not-allowed opacity-50" : "text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              {currentStep === totalSteps ? "Complete" : "Next"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
