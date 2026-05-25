"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  AGENT_CONFIRM_MESSAGES,
  AGENTS_QUERY_KEY,
  defaultAgentFilters,
} from "@/features/agents/constants/agent-constants";
import {
  createAgent,
  deactivateAgent,
  findAgents,
  updateAgent,
} from "@/features/agents/services/agents-service";
import { agentFiltersSchema } from "@/features/agents/schemas/agent-schema";
import type {
  Agent,
  AgentFilters,
  AgentFormValues,
} from "@/features/agents/types/agent-types";
import {
  filterAgents,
  getAgentTeams,
  normalizeAgent,
} from "@/features/agents/utils/agent-utils";
import { TOAST_MESSAGES } from "@/constants/toast-constants";
import { useToast } from "@/hooks/useToast";

export function useAgents() {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useToast();
  const [filters, setFilters] = useState<AgentFilters>(defaultAgentFilters);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const agentsQuery = useQuery({
    queryKey: AGENTS_QUERY_KEY,
    queryFn: findAgents,
    select: (agents) => agents.map(normalizeAgent),
  });

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: AgentFormValues) => {
      if (!selectedAgent) {
        throw new Error("Agent not selected");
      }

      return updateAgent(selectedAgent.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
      closeForm();
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
    },
  });

  const agents = useMemo(() => agentsQuery.data ?? [], [agentsQuery.data]);
  const filteredAgents = useMemo(
    () => filterAgents(agents, filters),
    [agents, filters],
  );
  const teams = useMemo(() => getAgentTeams(agents), [agents]);

  function openCreateForm() {
    setSelectedAgent(null);
    setIsFormOpen(true);
  }

  function openEditForm(agent: Agent) {
    setSelectedAgent(agent);
    setIsFormOpen(true);
  }

  function closeForm() {
    setSelectedAgent(null);
    setIsFormOpen(false);
  }

  function submitForm(values: AgentFormValues) {
    if (selectedAgent) {
      updateMutation.mutate(values);
      return;
    }

    createMutation.mutate(values);
  }

  function handleDeactivate(agent: Agent) {
    if (window.confirm(AGENT_CONFIRM_MESSAGES.deactivate)) {
      deactivateMutation.mutate(agent.id);
    }
  }

  function setValidatedFilters(nextFilters: AgentFilters) {
    const parsedFilters = agentFiltersSchema.safeParse(nextFilters);

    if (parsedFilters.success) {
      setFilters(parsedFilters.data);
    }
  }

  return {
    agents: filteredAgents,
    allAgents: agents,
    filters,
    teams,
    selectedAgent,
    isFormOpen,
    isLoading: agentsQuery.isLoading,
    isError: agentsQuery.isError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    setFilters: setValidatedFilters,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    handleDeactivate,
  };
}
