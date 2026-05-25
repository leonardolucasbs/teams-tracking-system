"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SyncActions } from "@/features/sync/components/SyncActions";
import { SyncExecutionsTable } from "@/features/sync/components/SyncExecutionsTable";
import { SyncFilters } from "@/features/sync/components/SyncFilters";
import { SyncSummaryCards } from "@/features/sync/components/SyncSummaryCards";
import { SYNC_MESSAGES } from "@/features/sync/constants/sync-constants";
import { useSync } from "@/features/sync/hooks/useSync";

export function SyncPage() {
  const {
    summary,
    executions,
    filters,
    isLoading,
    isError,
    isSyncingLocations,
    isSyncingCheckIns,
    isSyncingGeofences,
    setFilters,
    syncLocations,
    syncCheckIns,
    syncGeofences,
  } = useSync();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoramento"
        description="Acompanhe o resumo e o histórico das sincronizações."
      />

      <SyncActions
        isSyncingLocations={isSyncingLocations}
        isSyncingCheckIns={isSyncingCheckIns}
        isSyncingGeofences={isSyncingGeofences}
        onSyncLocations={syncLocations}
        onSyncCheckIns={syncCheckIns}
        onSyncGeofences={syncGeofences}
      />

      {isLoading ? <LoadingState message={SYNC_MESSAGES.loading} /> : null}
      {isError ? <ErrorState message={SYNC_MESSAGES.error} /> : null}

      {!isLoading && !isError ? (
        <div className="space-y-6">
          {summary?.items.length ? (
            <SyncSummaryCards items={summary.items} />
          ) : (
            <EmptyState message={SYNC_MESSAGES.emptySummary} />
          )}

          <SyncFilters filters={filters} onFiltersChange={setFilters} />

          {executions.length ? (
            <SyncExecutionsTable executions={executions} />
          ) : (
            <EmptyState message={SYNC_MESSAGES.emptyExecutions} />
          )}
        </div>
      ) : null}
    </div>
  );
}
