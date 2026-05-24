import type { LocationFiltersProps } from "@/features/locations/types/location-types";

export function LocationFilters({
  filters,
  onFiltersChange,
  onSubmit,
}: LocationFiltersProps) {
  return (
    <form
      className="rounded-lg border border-border bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>ID do agente</span>
        <div className="flex flex-col gap-2 md:max-w-xl md:flex-row">
          <input
            value={filters.agentId}
            onChange={(event) =>
              onFiltersChange({ ...filters, agentId: event.target.value })
            }
            placeholder="Exemplo: seed_agent_002"
            className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-foreground px-4 text-sm font-medium text-background"
          >
            Pesquisar
          </button>
        </div>
      </label>
    </form>
  );
}
