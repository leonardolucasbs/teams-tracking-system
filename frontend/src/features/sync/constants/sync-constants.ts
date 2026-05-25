import type {
  SyncFilters,
  SyncStatus,
  SyncType,
  SyncTypeFilter,
} from "@/features/sync/types/sync-types";

export const SYNC_SUMMARY_QUERY_KEY = ["sync-summary"];
export const SYNC_EXECUTIONS_QUERY_KEY = ["sync-executions"];

export const syncTypeOptions: SyncType[] = [
  "AGENTS",
  "LOCATIONS",
  "CHECK_INS",
  "GEOFENCES",
  "ALL",
];

export const syncTypeFilterOptions: SyncTypeFilter[] = [
  "ALL_TYPES",
  ...syncTypeOptions,
];

export const syncTypeLabels: Record<SyncType, string> = {
  AGENTS: "Agentes",
  LOCATIONS: "Localizações",
  CHECK_INS: "Check-ins",
  GEOFENCES: "Geofences",
  ALL: "Todas",
};

export const syncTypeFilterLabels: Record<SyncTypeFilter, string> = {
  ALL_TYPES: "Todos os tipos",
  ...syncTypeLabels,
};

export const syncStatusLabels: Record<SyncStatus, string> = {
  RUNNING: "Em execução",
  SUCCESS: "Sucesso",
  FAILED: "Falha",
  PARTIAL: "Parcial",
};

export const defaultSyncFilters: SyncFilters = {
  syncType: "ALL_TYPES",
};

export const SYNC_MESSAGES = {
  loading: "Carregando monitoramento...",
  error: "Não foi possível carregar o monitoramento.",
  emptyExecutions: "Nenhuma execução de sincronização encontrada.",
  emptySummary: "Nenhum resumo de sincronização encontrado.",
  manualActions:
    "Ações manuais disponíveis para fluxos que possuem endpoint interno.",
};
