export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-2xl gradient-primary opacity-20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-foreground">
            ResearchPilot
          </p>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
