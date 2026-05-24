import {
  syncStatusLabels,
  syncTypeLabels,
} from "@/features/dashboard/constants/dashboard.constants";
import { formatDateTime } from "@/features/dashboard/utils/dashboard.utils";
import type { LatestSyncStatusProps } from "@/features/dashboard/types/dashboard.types";

export function LatestSyncStatus({
  latestSync,
  items,
}: LatestSyncStatusProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          Status das sincronizações
        </h2>
        <p className="text-sm text-muted-foreground">
          Último status registrado por tipo de sincronização.
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-border">
        <div className="grid grid-cols-3 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>Tipo</span>
          <span>Status</span>
          <span>Última execução</span>
        </div>
        {items.map((item) => (
          <div
            key={item.syncType}
            className="grid grid-cols-3 px-4 py-3 text-sm text-foreground"
          >
            <span>{syncTypeLabels[item.syncType]}</span>
            <span>{syncStatusLabels[item.lastStatus]}</span>
            <span>{formatDateTime(item.lastStartedAt)}</span>
          </div>
        ))}
      </div>

      {latestSync ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Sincronização mais recente: {syncTypeLabels[latestSync.syncType]}.
        </p>
      ) : null}
    </section>
  );
}
