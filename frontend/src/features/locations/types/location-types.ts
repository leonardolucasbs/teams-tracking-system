export type LocationStatus =
  | "ONLINE"
  | "PAUSED"
  | "SIGNAL_LOST"
  | "OFFLINE";

export type AgentLocation = {
  id: string;
  agentId: string;
  externalId: string;
  agentName: string;
  latitude: number;
  longitude: number;
  currentAddress: string | null;
  accuracy: number | null;
  speed: number | null;
  battery: number | null;
  status: LocationStatus;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
};

export type LocationFilters = {
  agentId: string;
};

export type LocationsTableProps = {
  locations: AgentLocation[];
};

export type LocationFiltersProps = {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
  onSubmit: () => void;
};

export type LocationSyncButtonProps = {
  isSyncing: boolean;
  onSync: () => void;
};

export type LocationStatusBadgeProps = {
  status: LocationStatus;
};
