import { Button } from "@/components/ui/Button";
import type { GeofenceSyncButtonProps } from "@/features/geofences/types/geofence-types";

export function GeofenceSyncButton({
  isSyncing,
  onSync,
}: GeofenceSyncButtonProps) {
  return (
    <Button type="button" onClick={onSync} disabled={isSyncing}>
      {isSyncing ? "Sincronizando..." : "Sincronizar"}
    </Button>
  );
}
