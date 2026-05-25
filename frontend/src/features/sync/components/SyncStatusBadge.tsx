import { syncStatusLabels } from "@/features/sync/constants/sync-constants";
import type { SyncStatusBadgeProps } from "@/features/sync/types/sync-types";
import { getSyncStatusBadgeClassName } from "@/features/sync/utils/sync-utils";

export function SyncStatusBadge({ status }: SyncStatusBadgeProps) {
  return (
    <span className={getSyncStatusBadgeClassName(status)}>
      {status ? syncStatusLabels[status] : "Não informado"}
    </span>
  );
}
