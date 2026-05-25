"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AGENTS_QUERY_KEY } from "@/features/agents/constants/agent-constants";
import { findAgents } from "@/features/agents/services/agents-service";
import type { Agent } from "@/features/agents/types/agent-types";
import { normalizeAgent } from "@/features/agents/utils/agent-utils";
import { filterAgentsByName } from "@/utils/agent-search-utils";

export function useAgentSearch() {
  const [searchText, setSearchText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

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

  function selectAgent(agent: Agent) {
    setSelectedAgent(agent);
    setSearchText(agent.name);
  }

  function clearSelectedAgent() {
    setSelectedAgent(null);
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
