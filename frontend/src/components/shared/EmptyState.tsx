import type { StateMessageProps } from "@/types/component-props";

export function EmptyState({
  title = "Nenhum dado encontrado",
  message,
}: StateMessageProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {message ? (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
