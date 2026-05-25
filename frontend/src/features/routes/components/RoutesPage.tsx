"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { RouteAgentSearch } from "@/features/routes/components/RouteAgentSearch";
import { RoutePointsTable } from "@/features/routes/components/RoutePointsTable";
import { RouteSummaryCards } from "@/features/routes/components/RouteSummaryCards";
import { ROUTE_MESSAGES } from "@/features/routes/constants/route-constants";
import { useRoute } from "@/features/routes/hooks/useRoute";

export function RoutesPage() {
  const {
    agentSearch,
    route,
    hasAgentSearch,
    isLoading,
    isError,
  } = useRoute();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rotas"
        description="Consulte a rota do dia calculada."
      />

      <RouteAgentSearch
        agentSearch={agentSearch}
      />

      {isLoading ? <LoadingState message={ROUTE_MESSAGES.loading} /> : null}

      {isError ? (
        <ErrorState title="Ocorreu um erro" message={ROUTE_MESSAGES.error} />
      ) : null}

      {!hasAgentSearch ? (
        <EmptyState
          title="Informe um agente"
          message={ROUTE_MESSAGES.emptyWithoutAgent}
        />
      ) : null}

      {route && route.points.length === 0 ? (
        <EmptyState
          title="Nenhum ponto encontrado"
          message={ROUTE_MESSAGES.emptyWithAgent}
        />
      ) : null}

      {route ? <RouteSummaryCards summary={route} /> : null}

      {route && route.points.length > 0 ? (
        <RoutePointsTable points={route.points} />
      ) : null}
    </div>
  );
}
