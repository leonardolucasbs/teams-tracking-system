import type {
  AgentFilters,
  AgentFormValues,
  AgentRole,
  AgentStatus,
} from "@/features/agents/types/agent-types";

export const AGENTS_QUERY_KEY = ["agents"];

export const agentRoleOptions: AgentRole[] = [
  "INSTALLER",
  "TECHNICIAN",
  "VENDOR",
  "MAINTENANCE",
];

export const agentStatusOptions: AgentStatus[] = [
  "ONLINE",
  "PAUSED",
  "SIGNAL_LOST",
  "OFFLINE",
];

export const agentRoleLabels: Record<AgentRole, string> = {
  INSTALLER: "Instalador",
  TECHNICIAN: "Técnico",
  VENDOR: "Vendedor",
  MAINTENANCE: "Manutenção",
};

export const agentStatusLabels: Record<AgentStatus, string> = {
  ONLINE: "Online",
  PAUSED: "Pausado",
  SIGNAL_LOST: "Sinal perdido",
  OFFLINE: "Offline",
};

export const activeFilterOptions = [
  { value: "ALL", label: "Todos" },
  { value: "true", label: "Ativos" },
  { value: "false", label: "Inativos" },
] as const;

export const defaultAgentFilters: AgentFilters = {
  status: "ALL",
  team: "",
  active: "ALL",
};

export const defaultAgentFormValues: AgentFormValues = {
  name: "",
  role: "TECHNICIAN",
  team: "",
  phone: "",
  email: "",
  active: true,
  status: "ONLINE",
  battery: 100,
};

export const AGENT_VALIDATION_MESSAGES = {
  nameRequired: "Nome é obrigatório.",
  roleRequired: "Função é obrigatória.",
  teamRequired: "Equipe é obrigatória.",
  phoneRequired: "Telefone é obrigatório.",
  emailInvalid: "Informe um e-mail válido.",
  statusRequired: "Status é obrigatório.",
  batteryRequired: "Bateria é obrigatória.",
  batteryMin: "A bateria não pode ser menor que 0.",
  batteryMax: "A bateria não pode ser maior que 100.",
};

export const AGENT_CONFIRM_MESSAGES = {
  deactivate: "Deseja desativar este agente?",
};
