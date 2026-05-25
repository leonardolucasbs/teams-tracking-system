import { SyncStatusBadge } from "@/features/sync/components/SyncStatusBadge";
import { syncTypeLabels } from "@/features/sync/constants/sync-constants";
import type { SyncSummaryCardsProps } from "@/features/sync/types/sync-types";
import {
  formatSyncDateTime,
  formatSyncValue,
} from "@/features/sync/utils/sync-utils";

export function SyncSummaryCards({ items }: SyncSummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.syncType}
          className="rounded-lg border border-border bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {syncTypeLabels[item.syncType]}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Última execução
              </p>
            </div>
            <SyncStatusBadge status={item.lastStatus} />
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Início</dt>
              <dd className="text-right text-foreground">
                {formatSyncDateTime(item.lastStartedAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Fim</dt>
              <dd className="text-right text-foreground">
                {formatSyncDateTime(item.lastFinishedAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Itens</dt>
              <dd className="text-right text-foreground">
                {formatSyncValue(item.lastItemsProcessed)}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </section>
  );
}
