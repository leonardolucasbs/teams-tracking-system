import type { LoadingStateProps } from "@/types/component-props";

export function LoadingState({
  message = "Carregando dados...",
}: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
