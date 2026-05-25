"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { LatestSyncStatus } from "@/features/dashboard/components/LatestSyncStatus";
import { OverviewCards } from "@/features/dashboard/components/OverviewCards";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { isDashboardEmpty } from "@/features/dashboard/utils/dashboard-utils";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel"
        description="Visão operacional dos dados sincronizados pelo backend."
      />

      {isLoading ? <LoadingState message="Carregando painel..." /> : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message="Não foi possível carregar os dados do painel."
        />
      ) : null}

      {data && isDashboardEmpty(data) ? (
        <EmptyState
          title="Nenhum dado encontrado"
          message="Sincronize os dados no backend para visualizar o painel."
        />
      ) : null}

      {data && !isDashboardEmpty(data) ? (
        <>
          <OverviewCards items={data.overviewItems} />
          <LatestSyncStatus
            latestSync={data.latestSync}
            items={data.syncItems}
          />
        </>
      ) : null}
    </div>
  );
}
