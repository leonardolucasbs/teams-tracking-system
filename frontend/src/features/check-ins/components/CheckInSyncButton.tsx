import { Button } from "@/components/ui/Button";
import type { CheckInSyncButtonProps } from "@/features/check-ins/types/check-in-types";

export function CheckInSyncButton({
  isSyncing,
  onSync,
}: CheckInSyncButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onSync} disabled={isSyncing}>
      {isSyncing ? "Sincronizando..." : "Sincronizar"}
    </Button>
  );
}
