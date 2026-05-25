import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import type { agentSchema } from "@/features/agents/schemas/agent-schema";

export type AgentRole = "INSTALLER" | "TECHNICIAN" | "VENDOR" | "MAINTENANCE";

export type AgentStatus = "ONLINE" | "PAUSED" | "SIGNAL_LOST" | "OFFLINE";

export type AgentResponse = {
  id: string;
  externalId?: string | null;
  name: string;
  role?: AgentRole;
  Role?: AgentRole;
  team: string;
  phone: string;
  email?: string | null;
  active: boolean;
  status: AgentStatus;
  battery: number;
  lastSeen?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type Agent = AgentResponse & {
  normalizedRole: AgentRole;
};

export type AgentFormValues = z.infer<typeof agentSchema>;

export type AgentFilters = {
  status: AgentStatus | "ALL";
  team: string;
  active: "ALL" | "true" | "false";
};

export type AgentsTableProps = {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDeactivate: (agent: Agent) => void;
  isDeactivating: boolean;
};

export type AgentActionsProps = {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDeactivate: (agent: Agent) => void;
  isDeactivating: boolean;
};

export type AgentStatusBadgeProps = {
  status: AgentStatus;
};

export type AgentFiltersProps = {
  filters: AgentFilters;
  teams: string[];
  onFiltersChange: (filters: AgentFilters) => void;
};

export type AgentFormProps = {
  agent: Agent | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: AgentFormValues) => void;
};

export type AgentTextFieldProps = {
  id: keyof AgentFormValues;
  label: string;
  placeholder: string;
  register: UseFormRegister<AgentFormValues>;
  error?: string;
  type?: string;
};
