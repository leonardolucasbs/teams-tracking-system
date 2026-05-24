import type {
  RouteSearch,
  RouteStatus,
} from "@/features/routes/types/route-types";

export const ROUTE_QUERY_KEY = ["route-of-the-day"];

export const defaultRouteSearch: RouteSearch = {
  agentId: "",
};

export const routeStatusLabels: Record<RouteStatus, string> = {
  ONLINE: "Online",
  PAUSED: "Pausado",
  SIGNAL_LOST: "Sinal perdido",
  OFFLINE: "Offline",
};

export const ROUTE_MESSAGES = {
  emptyWithoutAgent: "Informe o ID de um agente para buscar a rota do dia.",
  emptyWithAgent: "Nenhum ponto de rota encontrado para o agente informado.",
  loading: "Carregando rota do dia...",
  error: "Não foi possível carregar a rota do dia.",
};
