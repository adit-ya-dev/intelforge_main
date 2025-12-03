"use client";

import { useState } from "react";
import { mockTeamConfigurations } from "@/lib/onboarding-mock-data";

export default function TeamSetup() {
  const [configurations] = useState(mockTeamConfigurations);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([""]);

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const handleUpdateMember = (index: number, value: string) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Team Configuration Selection */}
      <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Select Your Team Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configurations.map((config) => (
            <div
              key={config.id}
              onClick={() => setSelectedConfig(config.id)}
              className={`bg-white dark:bg-black border rounded-lg p-4 cursor-pointer transition-all ${
                selectedConfig === config.id
                  ? "border-zinc-700 bg-zinc-50 dark:bg-zinc-900/10"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${selectedConfig === config.id ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-400"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-black dark:text-white">{config.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{config.size}</p>
                </div>
                {selectedConfig === config.id && (
                  <svg className="w-5 h-5 text-zinc-900 dark:text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">Invite Team Members</h2>
          <button
            onClick={handleAddMember}
            className="px-3 py-1 text-sm bg-zinc-50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 transition-colors"
          >
            Add Member
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={member}
                onChange={(e) => handleUpdateMember(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <select className="px-3 py-2 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500">
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
          Send Invitations
        </button>
      </div>
    </div>
  );
}
