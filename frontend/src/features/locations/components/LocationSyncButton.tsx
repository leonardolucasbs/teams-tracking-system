import { Button } from "@/components/ui/Button";
import type { LocationSyncButtonProps } from "@/features/locations/types/location-types";

export function LocationSyncButton({
  isSyncing,
  onSync,
}: LocationSyncButtonProps) {
  return (
    <Button type="button" onClick={onSync} disabled={isSyncing}>
      {isSyncing ? "Sincronizando..." : "Sincronizar"}
    </Button>
  );
}
