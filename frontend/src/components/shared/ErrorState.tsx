import type { StateMessageProps } from "@/types/component-props";

export function ErrorState({
  title = "Algo deu errado",
  message = "Tente novamente em alguns instantes.",
}: StateMessageProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-white p-6">
      <h3 className="text-sm font-semibold text-destructive">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
