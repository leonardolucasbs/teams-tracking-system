export type GeofenceType = "POLYGON" | "CIRCLE";

export type GeofenceTypeFilter = GeofenceType | "ALL";

export type Geofence = {
  id: string;
  externalId: string;
  name: string;
  type: GeofenceType;
  coordinatesJson: string;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  assignedTeams?: string | null;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type GeofenceFilters = {
  type: GeofenceTypeFilter;
};

export type GeofencesTableProps = {
  geofences: Geofence[];
};

export type GeofenceFiltersProps = {
  filters: GeofenceFilters;
  onFiltersChange: (filters: GeofenceFilters) => void;
};

export type GeofenceTypeBadgeProps = {
  type: GeofenceType;
};

export type CoordinatesJsonBlockProps = {
  value: string;
};

export type GeofenceSyncButtonProps = {
  isSyncing: boolean;
  onSync: () => void;
};
