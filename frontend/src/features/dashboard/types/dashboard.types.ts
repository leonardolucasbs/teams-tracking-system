import type { LucideIcon } from "lucide-react";

export type AgentStatus =
  | "ONLINE"
  | "PAUSED"
  | "SIGNAL_LOST"
  | "OFFLINE";

export type SyncStatus = "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";

export type SyncType =
  | "AGENTS"
  | "LOCATIONS"
  | "CHECK_INS"
  | "GEOFENCES"
  | "ALL";

export type AgentResponse = {
  id: string;
  name: string;
  active: boolean;
  status: AgentStatus;
};

export type CheckInResponse = {
  id: string;
};

export type GeofenceResponse = {
  id: string;
};

export type SyncTypeSummaryResponse = {
  syncType: SyncType;
  lastStatus: SyncStatus;
  lastStartedAt: string | null;
  lastFinishedAt: string | null;
  lastItemsProcessed: number | null;
  lastErrorMessage: string | null;
  lastSyncToken: string | null;
};

export type SyncSummaryResponse = {
  items: SyncTypeSummaryResponse[];
};

export type DashboardServiceData = {
  agents: AgentResponse[];
  checkIns: CheckInResponse[];
  geofences: GeofenceResponse[];
  syncSummary: SyncSummaryResponse;
};

export type DashboardOverviewItem = {
  key: string;
  label: string;
  value: string;
  description: string;
};

export type QuickNavigationItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type DashboardData = {
  overviewItems: DashboardOverviewItem[];
  latestSync: SyncTypeSummaryResponse | null;
  syncItems: SyncTypeSummaryResponse[];
};

export type OverviewCardsProps = {
  items: DashboardOverviewItem[];
};

export type LatestSyncStatusProps = {
  latestSync: SyncTypeSummaryResponse | null;
  items: SyncTypeSummaryResponse[];
};
