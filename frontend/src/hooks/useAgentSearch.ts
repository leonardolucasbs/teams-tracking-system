"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AGENTS_QUERY_KEY } from "@/features/agents/constants/agent-constants";
import { findAgents } from "@/features/agents/services/agents-service";
import type { Agent } from "@/features/agents/types/agent-types";
import { normalizeAgent } from "@/features/agents/utils/agent-utils";
import { filterAgentsByName } from "@/utils/agent-search-utils";

export function useAgentSearch(initialAgentId = "") {
  const [searchText, setSearchText] = useState("");
  const [selectedAgentOverride, setSelectedAgentOverride] =
    useState<Agent | null>(null);
  const [isInitialSelectionCleared, setIsInitialSelectionCleared] =
    useState(false);

  const agentsQuery = useQuery({
    queryKey: AGENTS_QUERY_KEY,
    queryFn: findAgents,
    select: (agents) => agents.map(normalizeAgent),
  });

  const agents = useMemo(() => agentsQuery.data ?? [], [agentsQuery.data]);
  const matchingAgents = useMemo(
    () => filterAgentsByName(agents, searchText),
    [agents, searchText],
  );
  const initialAgent = useMemo(
    () => agents.find((agent) => agent.id === initialAgentId) ?? null,
    [agents, initialAgentId],
  );
  const selectedAgent =
    selectedAgentOverride ??
    (!isInitialSelectionCleared ? initialAgent : null);

  function selectAgent(agent: Agent) {
    setSelectedAgentOverride(agent);
    setIsInitialSelectionCleared(false);
    setSearchText(agent.name);
  }

  function clearSelectedAgent() {
    setSelectedAgentOverride(null);
    setIsInitialSelectionCleared(true);
    setSearchText("");
  }

  return {
    searchText,
    selectedAgent,
    matchingAgents,
    isLoading: agentsQuery.isLoading,
    setSearchText,
    selectAgent,
    clearSelectedAgent,
  };
}
