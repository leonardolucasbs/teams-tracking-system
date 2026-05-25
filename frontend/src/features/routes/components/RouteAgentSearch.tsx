import { AgentSearch } from "@/components/shared/AgentSearch";
import type { RouteAgentSearchProps } from "@/features/routes/types/route-types";

export function RouteAgentSearch({ agentSearch }: RouteAgentSearchProps) {
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
