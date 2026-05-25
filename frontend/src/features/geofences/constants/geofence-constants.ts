import type {
  GeofenceFilters,
  GeofenceType,
  GeofenceTypeFilter,
} from "@/features/geofences/types/geofence-types";

export const GEOFENCES_QUERY_KEY = ["geofences"];

export const geofenceTypeOptions: GeofenceType[] = ["POLYGON", "CIRCLE"];

export const geofenceTypeFilterOptions: GeofenceTypeFilter[] = [
  "ALL",
  ...geofenceTypeOptions,
];

export const geofenceTypeLabels: Record<GeofenceType, string> = {
  POLYGON: "Polígono",
  CIRCLE: "Círculo",
};

export const geofenceTypeFilterLabels: Record<GeofenceTypeFilter, string> = {
  ALL: "Todos os tipos",
  ...geofenceTypeLabels,
};

export const defaultGeofenceFilters: GeofenceFilters = {
  type: "ALL",
};

export const GEOFENCE_MESSAGES = {
  loading: "Carregando geofences...",
  error: "Não foi possível carregar as geofences.",
  empty: "Nenhuma geofence encontrada.",
};
