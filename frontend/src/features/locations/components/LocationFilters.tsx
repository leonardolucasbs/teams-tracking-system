import { AgentSearch } from "@/components/shared/AgentSearch";
import type { LocationFiltersProps } from "@/features/locations/types/location-types";

export function LocationFilters({ agentSearch }: LocationFiltersProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <AgentSearch
        searchText={agentSearch.searchText}
        selectedAgent={agentSearch.selectedAgent}
        matchingAgents={agentSearch.matchingAgents}
        isLoading={agentSearch.isLoading}
        onSearchTextChange={agentSearch.setSearchText}
        onSelectAgent={agentSearch.selectAgent}
        onClear={agentSearch.clearSelectedAgent}
      />
    </section>
  );
}
