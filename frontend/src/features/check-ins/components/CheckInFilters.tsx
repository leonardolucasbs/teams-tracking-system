import {
  checkInTypeLabels,
  checkInTypeOptions,
} from "@/features/check-ins/constants/check-in-constants";
import type { CheckInFiltersProps } from "@/features/check-ins/types/check-in-types";

export function CheckInFilters({
  filters,
  onFiltersChange,
  onSubmit,
}: CheckInFiltersProps) {
  return (
    <form
      className="grid gap-4 rounded-lg border border-border bg-white p-4 md:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>ID do agente</span>
        <input
          value={filters.agentId}
          onChange={(event) =>
            onFiltersChange({ ...filters, agentId: event.target.value })
          }
          placeholder="Exemplo: seed_agent_002"
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Tipo</span>
        <select
          value={filters.type}
          onChange={(event) =>
            onFiltersChange({ ...filters, type: event.target.value as never })
          }
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="ALL">Todos</option>
          {checkInTypeOptions.map((type) => (
            <option key={type} value={type}>
              {checkInTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 pt-7 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          checked={filters.todayOnly}
          onChange={(event) =>
            onFiltersChange({ ...filters, todayOnly: event.target.checked })
          }
          className="size-4 rounded border-input"
        />
        Somente hoje
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          className="h-10 w-full rounded-md bg-foreground px-4 text-sm font-medium text-background"
        >
          Pesquisar
        </button>
      </div>
    </form>
  );
}
