"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { LatestSyncStatus } from "@/features/dashboard/components/latest-sync-status";
import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { isDashboardEmpty } from "@/features/dashboard/utils/dashboard.utils";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão operacional dos dados sincronizados pelo backend."
      />

      {isLoading ? <LoadingState message="Carregando dashboard..." /> : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message="Não foi possível carregar os dados do dashboard."
        />
      ) : null}

      {data && isDashboardEmpty(data) ? (
        <EmptyState
          title="Nenhum dado encontrado"
          message="Sincronize os dados no backend para visualizar o dashboard."
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
