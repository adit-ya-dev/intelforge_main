"use client";

import { useState } from "react";
import { mockChecklist } from "@/lib/onboarding-mock-data";

export default function ChecklistPanel() {
  const [checklist, setChecklist] = useState(mockChecklist);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleItem = (itemId: string) => {
    const updatedItems = checklist.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedItems.filter((i) => i.completed).length;
    const progress = (completedCount / updatedItems.length) * 100;

    setChecklist({
      ...checklist,
      items: updatedItems,
      progress,
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Getting Started Checklist
        </h3>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {Math.round(checklist.progress)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-6">
        <div
          className="bg-zinc-800 h-2 rounded-full transition-all duration-500"
          style={{ width: `${checklist.progress}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.items.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border transition-all ${
              item.completed
                ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                : "bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleItem(item.id)}
                  className={`mt-0.5 flex-shrink-0 ${
                    item.completed ? "text-zinc-800" : "text-zinc-400"
                  }`}
                >
                  {item.completed ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="2" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      item.completed
                        ? "text-zinc-500 dark:text-zinc-500 line-through"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {item.label}
                  </p>

                  {item.helpText && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="text-xs text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white mt-1 flex items-center gap-1"
                    >
                      <svg
                        className="w-3 h-3"
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
                      {expandedItems.includes(item.id) ? "Hide" : "Learn more"}
                    </button>
                  )}

                  {expandedItems.includes(item.id) && item.helpText && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">{item.helpText}</p>
                  )}

                  {item.optional && !item.completed && (
                    <span className="inline-block px-2 py-0.5 mt-2 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full">
                      Optional
                    </span>
                  )}
                </div>

                {item.action && !item.completed && (
                  <button className="px-3 py-1 text-xs bg-zinc-50 dark:bg-zinc-900/20 text-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                    Start
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {checklist.progress === 100 && (
        <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
            Setup complete.
          </p>
        </div>
      )}
    </div>
  );
}
