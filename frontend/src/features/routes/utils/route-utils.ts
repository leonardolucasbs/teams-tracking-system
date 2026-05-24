import type {
  RouteSearch,
  RouteStatus,
} from "@/features/routes/types/route-types";

export function canFetchRoute(search: RouteSearch) {
  return search.agentId.trim().length > 0;
}

export function normalizeRouteAgentId(agentId: string) {
  return agentId.trim();
}

export function formatRouteDate(value: string | null | undefined) {
  if (!value) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatRouteDateTime(value: string | null | undefined) {
  if (!value) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDistance(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "0 km";
  }

  return `${value.toFixed(2)} km`;
}

export function formatCoordinate(value: number) {
  return value.toFixed(6);
}

export function formatOptionalNumber(
  value: number | null | undefined,
  suffix: string,
) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return `${value}${suffix}`;
}

export function getRouteStatusBadgeClassName(status: RouteStatus) {
  const baseClassName =
    "inline-flex rounded-md border px-2 py-1 text-xs font-medium";

  if (status === "ONLINE") {
    return `${baseClassName} border-green-200 bg-green-50 text-green-700`;
  }

  if (status === "PAUSED") {
    return `${baseClassName} border-yellow-200 bg-yellow-50 text-yellow-700`;
  }

  if (status === "SIGNAL_LOST") {
    return `${baseClassName} border-orange-200 bg-orange-50 text-orange-700`;
  }

  return `${baseClassName} border-zinc-200 bg-zinc-50 text-zinc-700`;
}
