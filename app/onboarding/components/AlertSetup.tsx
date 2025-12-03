"use client";

import { useState } from "react";

export default function AlertSetup() {
  const [alertTypes, setAlertTypes] = useState({
    newPatents: true,
    fundingRounds: true,
    researchPapers: false,
    newsArticles: true,
    technologyBreakthroughs: true,
  });

  const [frequency, setFrequency] = useState("daily");
  const [channels, setChannels] = useState({
    email: true,
    inApp: true,
    slack: false,
  });

  const handleToggleAlertType = (type: keyof typeof alertTypes) => {
    setAlertTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleToggleChannel = (channel: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
  };

  return (
    <div className="space-y-6">
      {/* Alert Types */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          What would you like to be notified about?
        </h3>
        <div className="space-y-3">
          {[
            {
              id: "newPatents",
              label: "New Patents",
              description: "Patent filings in your watched domains",
              icon:
                "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            },
            {
              id: "fundingRounds",
              label: "Funding Rounds",
              description: "Investment activities and acquisitions",
              icon:
                "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              id: "researchPapers",
              label: "Research Papers",
              description: "New academic publications",
              icon:
                "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
            },
            {
              id: "newsArticles",
              label: "News & Media",
              description: "Industry news and press releases",
              icon:
                "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
            },
            {
              id: "technologyBreakthroughs",
              label: "Technology Breakthroughs",
              description: "Major advances and milestones",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
          ].map((alertType) => (
            <div
              key={alertType.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                alertTypes[alertType.id as keyof typeof alertTypes]
                  ? "border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20"
                  : "bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 hover:border-zinc-500"
              }`}
              onClick={() =>
                handleToggleAlertType(alertType.id as keyof typeof alertTypes)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      alertTypes[alertType.id as keyof typeof alertTypes]
                        ? "text-black dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
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
                        d={alertType.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {alertType.label}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {alertType.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    alertTypes[alertType.id as keyof typeof alertTypes]
                      ? "bg-zinc-800 border-zinc-800"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {alertTypes[alertType.id as keyof typeof alertTypes] && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Frequency */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          How often would you like to receive alerts?
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: "realtime", label: "Real-time" },
            { value: "daily", label: "Daily Digest" },
            { value: "weekly", label: "Weekly Summary" },
            { value: "monthly", label: "Monthly Report" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFrequency(option.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                frequency === option.value
                  ? "bg-zinc-50 dark:bg-zinc-900/20 border-zinc-700 text-black dark:text-white"
                  : "bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <p className="text-sm font-medium">{option.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Where should we send your alerts?
        </h3>
        <div className="space-y-3">
          {[
            {
              id: "email",
              label: "Email",
              description: "Send to your registered email",
              icon:
                "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            },
            {
              id: "inApp",
              label: "In-App Notifications",
              description: "Show in the notification center",
              icon:
                "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
            },
            {
              id: "slack",
              label: "Slack Integration",
              description: "Send to your team Slack channel",
              icon:
                "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
            },
          ].map((channel) => (
            <div
              key={channel.id}
              className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400">
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
                        d={channel.icon}
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-white">
                      {channel.label}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleChannel(channel.id as keyof typeof channels)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    channels[channel.id as keyof typeof channels]
                      ? "bg-zinc-800"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      channels[channel.id as keyof typeof channels]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {channel.id === "slack" && channels.slack && (
                <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <input
                    type="text"
                    placeholder="Enter Slack webhook URL"
                    className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 mb-2">
          Your Alert Configuration
        </h4>
        <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
          <li>
            • {Object.values(alertTypes).filter(Boolean).length} alert types
            enabled
          </li>
          <li>• Receiving {frequency} updates</li>
          <li>
            • Notifications via{" "}
            {Object.entries(channels)
              .filter(([_, v]) => v)
              .map(([k]) => k)
              .join(", ")}
          </li>
        </ul>
      </div>
    </div>
  );
}
