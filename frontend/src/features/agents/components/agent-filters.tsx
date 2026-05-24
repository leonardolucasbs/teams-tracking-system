import {
  activeFilterOptions,
  agentStatusLabels,
  agentStatusOptions,
} from "@/features/agents/constants/agent.constants";
import type { AgentFiltersProps } from "@/features/agents/types/agent.types";

export function AgentFilters({
  filters,
  teams,
  onFiltersChange,
}: AgentFiltersProps) {
  return (
    <section className="grid gap-4 rounded-lg border border-border bg-white p-4 md:grid-cols-3">
      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Status</span>
        <select
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({ ...filters, status: event.target.value as never })
          }
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="ALL">Todos</option>
          {agentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {agentStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Equipe</span>
        <input
          list="agent-teams"
          value={filters.team}
          onChange={(event) =>
            onFiltersChange({ ...filters, team: event.target.value })
          }
          placeholder="Filtrar por equipe"
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        />
        <datalist id="agent-teams">
          {teams.map((team) => (
            <option key={team} value={team} />
          ))}
        </datalist>
      </label>

      <label className="space-y-2 text-sm font-medium text-foreground">
        <span>Ativo</span>
        <select
          value={filters.active}
          onChange={(event) =>
            onFiltersChange({ ...filters, active: event.target.value as never })
          }
          className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        >
          {activeFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
