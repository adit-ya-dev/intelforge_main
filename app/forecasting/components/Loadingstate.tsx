"use client";

import React from "react";

interface SimpleLoadingStateProps {
  message?: string;
  subtext?: string;
  steps?: string[];
  showSteps?: boolean;
  onCancel?: () => void;
  zIndex?: number;
}

export default function SimpleLoadingState({
  message = "Loading Technology Intelligence",
  subtext = "Gathering insights and evidence...",
  steps = [
    "Loading technology metadata",
    "Fetching TRL history",
    "Analyzing signals",
    "Building knowledge graph",
  ],
  showSteps = true,
  onCancel,
  zIndex = 50,
}: SimpleLoadingStateProps) {
  return (
    <div
      className="fixed inset-0 w-full h-full min-h-screen flex items-center justify-center p-4"
      style={{
        zIndex,
        background: "rgba(0,0,0,0.45)", // high contrast backdrop so loader is visible in any theme
        WebkitBackdropFilter: "blur(4px)",
        backdropFilter: "blur(4px)",
      }}
      role="status"
      aria-busy="true"
      aria-label={message}
    >
      <div className="text-center space-y-4 sm:space-y-6 max-w-md w-full">
        {/* Animated Loader (double ring) */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto" aria-hidden>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "4px solid rgba(255,255,255,0.08)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              borderTop: "4px solid var(--primary-color, #60a5fa)",
              borderRight: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "4px solid transparent",
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {message}
          </h3>
          <p className="text-xs sm:text-sm text-white/70">{subtext}</p>
        </div>

        {/* Progress Steps */}
        {showSteps && (
          <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 max-w-xs mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 text-xs text-white/70"
                style={{
                  animation: `fadeInUp 0.36s cubic-bezier(.2,.9,.3,1) ${index * 0.08}s both`,
                }}
              >
                <div className="w-4 h-4 rounded-full border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full bg-white animate-pulse"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                <span className="text-left">{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Optional cancel button */}
        {onCancel && (
          <div className="mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-md border border-white/10 bg-white/5 text-white/90 hover:bg-white/6 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* make sure the default --primary-color can be overridden by your theme */
        :global(:root) {
          --primary-color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
