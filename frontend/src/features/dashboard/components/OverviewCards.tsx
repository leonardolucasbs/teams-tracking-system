import type { OverviewCardsProps } from "@/features/dashboard/types/dashboard-types";

export function OverviewCards({ items }: OverviewCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <article
          key={item.key}
          className="rounded-lg border border-border bg-white p-5"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {item.label}
          </p>
          <strong className="mt-3 block text-2xl font-semibold text-foreground">
            {item.value}
          </strong>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>
        </article>
      ))}
    </section>
  );
}
