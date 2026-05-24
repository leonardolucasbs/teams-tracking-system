import type {
  LocationFilters,
  LocationStatus,
} from "@/features/locations/types/location-types";

export const LOCATIONS_QUERY_KEY = ["locations"];

export const defaultLocationFilters: LocationFilters = {
  agentId: "",
};

export const locationStatusLabels: Record<LocationStatus, string> = {
  ONLINE: "Online",
  PAUSED: "Pausado",
  SIGNAL_LOST: "Sinal perdido",
  OFFLINE: "Offline",
};

export const LOCATION_MESSAGES = {
  emptyWithoutAgent: "Informe o ID de um agente para carregar o histórico.",
  emptyWithAgent: "Nenhuma localização encontrada para o agente informado.",
  loading: "Carregando localizações...",
  error: "Não foi possível carregar as localizações.",
};
