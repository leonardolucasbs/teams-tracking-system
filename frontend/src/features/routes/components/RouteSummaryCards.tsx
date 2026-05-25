import type { RouteSummaryCardsProps } from "@/features/routes/types/route-types";
import {
  formatDistance,
  formatRouteDate,
  formatRouteDateTime,
} from "@/features/routes/utils/route-utils";

export function RouteSummaryCards({ summary }: RouteSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">Agente</p>
        <strong className="mt-3 block text-lg font-semibold text-foreground">
          {summary.agentName}
        </strong>
      </article>

      <article className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">Data</p>
        <strong className="mt-3 block text-lg font-semibold text-foreground">
          {formatRouteDate(summary.date)}
        </strong>
        <p className="mt-2 text-sm text-muted-foreground">
          {summary.totalPoints} pontos registrados
        </p>
      </article>

      <article className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">
          Distância total
        </p>
        <strong className="mt-3 block text-lg font-semibold text-foreground">
          {formatDistance(summary.totalDistanceInKm)}
        </strong>
        <p className="mt-2 text-sm text-muted-foreground">
          Calculada com Haversine
        </p>
      </article>

      <article className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">Início</p>
        <strong className="mt-3 block text-lg font-semibold text-foreground">
          {formatRouteDateTime(summary.startTime)}
        </strong>
      </article>

      <article className="rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">Fim</p>
        <strong className="mt-3 block text-lg font-semibold text-foreground">
          {formatRouteDateTime(summary.endTime)}
        </strong>
      </article>
    </section>
  );
}
