import { geofenceTypeLabels } from "@/features/geofences/constants/geofence-constants";
import type { GeofenceTypeBadgeProps } from "@/features/geofences/types/geofence-types";

export function GeofenceTypeBadge({ type }: GeofenceTypeBadgeProps) {
  return (
    <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700">
      {geofenceTypeLabels[type]}
    </span>
  );
}
