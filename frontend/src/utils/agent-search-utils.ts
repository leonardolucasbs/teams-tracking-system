import type { Agent } from "@/features/agents/types/agent-types";

export function filterAgentsByName(agents: Agent[], searchText: string) {
  const normalizedSearch = searchText.trim().toLowerCase();

  if (!normalizedSearch) {
    return [];
  }

  return agents
    .filter((agent) => agent.name.toLowerCase().includes(normalizedSearch))
    .slice(0, 8);
}
