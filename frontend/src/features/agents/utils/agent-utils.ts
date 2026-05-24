import type {
  Agent,
  AgentFilters,
  AgentFormValues,
  AgentResponse,
  AgentStatus,
} from "@/features/agents/types/agent-types";
import { defaultAgentFormValues } from "@/features/agents/constants/agent-constants";

export function normalizeAgent(agent: AgentResponse): Agent {
  return {
    ...agent,
    normalizedRole: agent.role ?? agent.Role ?? "TECHNICIAN",
  };
}

export function filterAgents(agents: Agent[], filters: AgentFilters) {
  return agents.filter((agent) => {
    const matchesStatus =
      filters.status === "ALL" || agent.status === filters.status;
    const matchesTeam =
      !filters.team ||
      agent.team.toLowerCase().includes(filters.team.toLowerCase());
    const matchesActive =
      filters.active === "ALL" || String(agent.active) === filters.active;

    return matchesStatus && matchesTeam && matchesActive;
  });
}

export function getAgentTeams(agents: Agent[]) {
  return Array.from(new Set(agents.map((agent) => agent.team))).sort();
}

export function getAgentFormValues(agent: Agent | null): AgentFormValues {
  if (!agent) {
    return defaultAgentFormValues;
  }

  return {
    name: agent.name,
    role: agent.normalizedRole,
    team: agent.team,
    phone: agent.phone,
    email: agent.email ?? "",
    active: agent.active,
    status: agent.status,
    battery: agent.battery,
  };
}

export function getAgentStatusBadgeClassName(status: AgentStatus) {
  const baseClassName =
    "inline-flex rounded-md border px-2 py-1 text-xs font-medium";

  if (status === "ONLINE") {
    return `${baseClassName} border-green-200 bg-green-50 text-green-700`;
  }

  if (status === "PAUSED") {
    return `${baseClassName} border-yellow-200 bg-yellow-50 text-yellow-700`;
  }

  if (status === "SIGNAL_LOST") {
    return `${baseClassName} border-orange-200 bg-orange-50 text-orange-700`;
  }

  return `${baseClassName} border-zinc-200 bg-zinc-50 text-zinc-700`;
}

export function formatAgentDate(value?: string | null) {
  if (!value) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
