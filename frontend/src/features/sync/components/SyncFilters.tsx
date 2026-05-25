import {
  syncTypeFilterLabels,
  syncTypeFilterOptions,
} from "@/features/sync/constants/sync-constants";
import type {
  SyncFiltersProps,
  SyncTypeFilter,
} from "@/features/sync/types/sync-types";

export function SyncFilters({ filters, onFiltersChange }: SyncFiltersProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Tipo de sincronização</span>
        <select
          value={filters.syncType}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              syncType: event.target.value as SyncTypeFilter,
            })
          }
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm md:max-w-xs"
        >
          {syncTypeFilterOptions.map((syncType) => (
            <option key={syncType} value={syncType}>
              {syncTypeFilterLabels[syncType]}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
