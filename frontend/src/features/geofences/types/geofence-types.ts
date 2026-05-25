import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

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

export type GeofenceSyncButtonProps = {
  isSyncing: boolean;
  onSync: () => void;
};

export type GeofenceMapPageProps = {
  id: string;
};

export type GeofenceMapDetailsProps = {
  geofence: Geofence;
};

export type GeofenceMapWrapperProps = {
  geofence: Geofence;
};

export type GeofenceMapClientProps = {
  geofence: Geofence;
};

export type ParsedGeofenceCoordinates = {
  type: "POLYGON" | "CIRCLE" | "POINT" | "INVALID";
  center: LatLngExpression | null;
  bounds: LatLngBoundsExpression | null;
  polygon: LatLngExpression[] | null;
  radius: number | null;
  message: string | null;
};
