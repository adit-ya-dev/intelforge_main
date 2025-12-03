"use client";

export default function LoadingState() {
  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-background flex items-center justify-center p-4 z-50">
      <div className="text-center space-y-4 sm:space-y-6 max-w-md w-full">
        {/* Animated Loader */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Loading Technology Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gathering insights and evidence...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 max-w-xs mx-auto">
          {[
            "Loading technology metadata",
            "Fetching TRL history",
            "Analyzing signals",
            "Building knowledge graph",
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground"
              style={{
                animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-left">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}