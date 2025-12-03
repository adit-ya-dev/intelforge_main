"use client";

import { useState } from "react";
import { mockWatchlistSuggestions } from "@/lib/onboarding-mock-data";
import { WatchlistItem } from "@/types/onboarding";

export default function WatchlistBuilder() {
  const [suggestions] = useState<WatchlistItem[]>(mockWatchlistSuggestions);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [customItem, setCustomItem] = useState("");
  const [customType, setCustomType] = useState<"technology" | "organization" | "keyword">("technology");

  const handleAddToWatchlist = (item: WatchlistItem) => {
    if (!watchlist.find((w) => w.id === item.id)) {
      setWatchlist([...watchlist, item]);
    }
  };

  const handleRemoveFromWatchlist = (itemId: string) => {
    setWatchlist(watchlist.filter((w) => w.id !== itemId));
  };

  const handleAddCustom = () => {
    if (customItem.trim()) {
      const newItem: WatchlistItem = {
        id: `custom-${Date.now()}`,
        name: customItem,
        type: customType,
        description: `Custom ${customType} to track`,
        addedAt: new Date(),
        lastActivity: new Date(),
        activityCount: 0,
      };
      setWatchlist([...watchlist, newItem]);
      setCustomItem("");
    }
  };

  const getTypeIcon = (type: string) => {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Watchlist */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Your Watchlist</h3>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {watchlist.length} items
          </span>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 dark:text-zinc-600">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No items in your watchlist yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {watchlist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-200">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{item.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  className="p-1 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Item */}
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-black dark:text-white mb-3">Add Custom Item</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter technology, organization, or keyword"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="technology">Technology</option>
            <option value="organization">Organization</option>
            <option value="keyword">Keyword</option>
          </select>
          <button
            onClick={handleAddCustom}
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Suggested Items */}
      <div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Suggested Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.filter((s) => !watchlist.find((w) => w.id === s.id)).map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded mt-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-white">{suggestion.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{suggestion.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToWatchlist(suggestion)}
                  className="p-1 text-zinc-800 dark:text-zinc-200 hover:opacity-90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips (Monochrome) */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <p className="text-sm text-black dark:text-white font-medium">Pro Tip</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Add both broad topics and specific technologies to get comprehensive coverage. You can always refine your watchlist later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
