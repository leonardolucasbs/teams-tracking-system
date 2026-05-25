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
  loading: "Carregando áreas operacionais...",
  loadingMap: "Carregando mapa da área operacional...",
  error: "Não foi possível carregar as áreas operacionais.",
  mapError: "Não foi possível carregar o mapa da área operacional.",
  empty: "Nenhuma área operacional encontrada.",
  notFound: "Área operacional não encontrada.",
  invalidCoordinates: "Não foi possível interpretar as coordenadas desta área operacional.",
  missingRadius: "Raio não informado para esta área operacional.",
};

export const DEFAULT_GEOFENCE_MAP_CENTER: [number, number] = [-23.5505, -46.6333];

export const DEFAULT_GEOFENCE_MAP_ZOOM = 13;

export const GEOFENCE_MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const GEOFENCE_MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const GEOFENCE_AREA_PATH_OPTIONS = {
  color: "#111827",
  fillColor: "#6b7280",
  fillOpacity: 0.25,
};

export const GEOFENCE_POINT_PATH_OPTIONS = {
  color: "#111827",
  fillColor: "#111827",
  fillOpacity: 0.8,
};
