 "use client";

import { TablePagination } from "@/components/shared/TablePagination";
import { SyncStatusBadge } from "@/features/sync/components/SyncStatusBadge";
import { syncTypeLabels } from "@/features/sync/constants/sync-constants";
import type { SyncExecutionsTableProps } from "@/features/sync/types/sync-types";
import {
  formatDuration,
  formatSyncDateTime,
  formatSyncValue,
} from "@/features/sync/utils/sync-utils";
import { usePagination } from "@/hooks/usePagination";

export function SyncExecutionsTable({ executions }: SyncExecutionsTableProps) {
  const pagination = usePagination(executions);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-zinc-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Início</th>
              <th className="px-4 py-3">Fim</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Itens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((execution) => (
              <tr key={execution.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  {syncTypeLabels[execution.syncType]}
                </td>
                <td className="px-4 py-3">
                  <SyncStatusBadge status={execution.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatSyncDateTime(execution.startedAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatSyncDateTime(execution.finishedAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDuration(execution.durationMs)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatSyncValue(execution.itemsProcessed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        startItem={pagination.startItem}
        endItem={pagination.endItem}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
