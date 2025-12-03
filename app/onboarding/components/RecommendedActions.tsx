"use client";

export default function RecommendedActions() {
  const actions = [
    {
      title: "Complete Your Profile",
      description: "Add your organization details and preferences",
      progress: 60,
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      title: "Enable Data Sources",
      description: "3 recommended connectors pending setup",
      progress: 40,
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    },
    {
      title: "Build Your Watchlist",
      description: "Add 5+ items to track important technologies",
      progress: 20,
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    },
  ];

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Recommended Actions</h2>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-50 dark:bg-zinc-900/20 text-zinc-900 dark:text-zinc-200 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-black dark:text-white">{action.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{action.description}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Progress</span>
                    <span className="text-xs text-black dark:text-white">{action.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-zinc-800 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${action.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <button className="px-3 py-1 text-sm bg-white dark:bg-black text-black dark:text-white border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
