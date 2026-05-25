import type { Agent } from "@/features/agents/types/agent-types";

export type AgentSearchProps = {
  searchText: string;
  selectedAgent: Agent | null;
  matchingAgents: Agent[];
  isLoading: boolean;
  onSearchTextChange: (value: string) => void;
  onSelectAgent: (agent: Agent) => void;
  onClear: () => void;
};

export type AgentSearchState = {
  searchText: string;
  selectedAgent: Agent | null;
  matchingAgents: Agent[];
  isLoading: boolean;
  setSearchText: (value: string) => void;
  selectAgent: (agent: Agent) => void;
  clearSelectedAgent: () => void;
};
