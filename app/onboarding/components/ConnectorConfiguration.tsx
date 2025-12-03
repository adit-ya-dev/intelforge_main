"use client";

import { useState } from "react";
import { mockConnectorPresets } from "@/lib/onboarding-mock-data";
import { ConnectorPreset } from "@/types/onboarding";

export default function ConnectorConfiguration() {
  const [connectors, setConnectors] = useState<ConnectorPreset[]>(
    mockConnectorPresets
  );

  const handleToggleConnector = (connectorId: string) => {
    setConnectors(
      connectors.map((c) =>
        c.id === connectorId ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  const enabledCount = connectors.filter((c) => c.enabled).length;
  const recommendedConnectors = connectors.filter((c) => c.recommended);

  const getCategoryIcon = (category: string) => {
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Data Sources Enabled
            </p>
            <p className="text-2xl font-bold text-black dark:text-white mt-1">
              {enabledCount} / {connectors.length}
            </p>
          </div>
          <button className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Enable All Recommended
          </button>
        </div>
      </div>

      {/* Recommended Connectors */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-zinc-900 dark:text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          Recommended Connectors
        </h3>
        <div className="space-y-3">
          {recommendedConnectors.map((connector) => (
            <div
              key={connector.id}
              className={`bg-white dark:bg-black border rounded-lg transition-all ${
                connector.enabled
                  ? "border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        connector.enabled
                          ? "text-black dark:text-white"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {getCategoryIcon(connector.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white">
                        {connector.name}
                      </h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {connector.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {connector.requiresAuth && (
                      <span className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700">
                        API Key Required
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleConnector(connector.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        connector.enabled ? "bg-zinc-800" : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          connector.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {connector.enabled && connector.requiresAuth && (
                  <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter your API key"
                        className="flex-1 px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      />
                      <button className="px-3 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors">
                        Validate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Connectors */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Additional Connectors</h3>
        <div className="space-y-3">
          {connectors
            .filter((c) => !c.recommended)
            .map((connector) => (
              <div
                key={connector.id}
                className={`bg-white dark:bg-black border rounded-lg p-4 transition-all ${
                  connector.enabled ? "border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20" : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${connector.enabled ? "text-black dark:text-white" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"}`}>
                      {getCategoryIcon(connector.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white">{connector.name}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{connector.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleConnector(connector.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${connector.enabled ? "bg-zinc-800" : "bg-zinc-300 dark:bg-zinc-700"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${connector.enabled ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-zinc-900 dark:text-zinc-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-zinc-900 dark:text-zinc-200 font-medium">About Data Connectors</p>
            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1">
              Data connectors automatically sync information from external sources. You can always add more connectors later from the Admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
