import {
  geofenceTypeFilterLabels,
  geofenceTypeFilterOptions,
} from "@/features/geofences/constants/geofence-constants";
import type { GeofenceFiltersProps } from "@/features/geofences/types/geofence-types";

export function GeofenceFilters({
  filters,
  onFiltersChange,
}: GeofenceFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Tipo</span>
        <select
          value={filters.type}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              type: event.target.value as typeof filters.type,
            })
          }
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm md:max-w-xs"
        >
          {geofenceTypeFilterOptions.map((type) => (
            <option key={type} value={type}>
              {geofenceTypeFilterLabels[type]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
