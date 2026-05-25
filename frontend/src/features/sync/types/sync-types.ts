export type SyncType = "AGENTS" | "LOCATIONS" | "CHECK_INS" | "GEOFENCES" | "ALL";

export type SyncStatus = "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";

export type SyncExecution = {
  id: string;
  syncType: SyncType;
  status: SyncStatus;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  itemsProcessed: number | null;
  syncToken: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SyncTypeSummary = {
  syncType: SyncType;
  lastStatus: SyncStatus | null;
  lastStartedAt: string | null;
  lastFinishedAt: string | null;
  lastItemsProcessed: number | null;
  lastErrorMessage: string | null;
  lastSyncToken: string | null;
};

export type SyncSummary = {
  items: SyncTypeSummary[];
};

export type SyncTypeFilter = SyncType | "ALL_TYPES";

export type SyncFilters = {
  syncType: SyncTypeFilter;
};

export type SyncPageData = {
  summary: SyncSummary;
  executions: SyncExecution[];
};

export type SyncSummaryCardsProps = {
  items: SyncTypeSummary[];
};

export type SyncExecutionsTableProps = {
  executions: SyncExecution[];
};

export type SyncStatusBadgeProps = {
  status: SyncStatus | null;
};

export type SyncFiltersProps = {
  filters: SyncFilters;
  onFiltersChange: (filters: SyncFilters) => void;
};

export type SyncActionsProps = {
  isSyncingLocations: boolean;
  isSyncingCheckIns: boolean;
  isSyncingGeofences: boolean;
  onSyncLocations: () => void;
  onSyncCheckIns: () => void;
  onSyncGeofences: () => void;
};
