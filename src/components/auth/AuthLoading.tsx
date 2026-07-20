import { Loader2 } from "lucide-react";

interface AuthLoadingProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * Full-screen (or inline) authentication loading state shown while the
 * better-auth session is being resolved on the client. Keeps a stable
 * layout to avoid hydration/flash between guest and authenticated UI.
 */
export function AuthLoading({
  label = "Authenticating...",
  className,
  fullScreen = true,
}: AuthLoadingProps) {
  const content = (
    <div
      className={
        "flex flex-col items-center justify-center gap-4 text-center " +
        (fullScreen ? "min-h-[60vh]" : "py-16") +
        (className ? ` ${className}` : "")
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-2xl gradient-primary opacity-20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden="true" />
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="sr-only">Please wait while we verify your session.</p>
    </div>
  );

  return content;
}
