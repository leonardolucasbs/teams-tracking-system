import { Button } from "@/components/ui/Button";
import { SYNC_MESSAGES } from "@/features/sync/constants/sync-constants";
import type { SyncActionsProps } from "@/features/sync/types/sync-types";

export function SyncActions({
  isSyncingLocations,
  isSyncingCheckIns,
  isSyncingGeofences,
  onSyncLocations,
  onSyncCheckIns,
  onSyncGeofences,
}: SyncActionsProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          {SYNC_MESSAGES.manualActions}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onSyncLocations} disabled={isSyncingLocations}>
            {isSyncingLocations ? "Sincronizando..." : "Sincronizar localizações"}
          </Button>
          <Button onClick={onSyncCheckIns} disabled={isSyncingCheckIns}>
            {isSyncingCheckIns ? "Sincronizando..." : "Sincronizar check-ins"}
          </Button>
          <Button onClick={onSyncGeofences} disabled={isSyncingGeofences}>
            {isSyncingGeofences ? "Sincronizando..." : "Sincronizar áreas operacionais"}
          </Button>
        </div>
      </div>
    </section>
  );
}
