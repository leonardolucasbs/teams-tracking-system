import type {
  LocationFilters,
  LocationStatus,
} from "@/features/locations/types/location-types";
import { formatBrazilianDateTime } from "@/utils/format-date";

export function canFetchLocations(filters: LocationFilters) {
  return filters.agentId.trim().length > 0;
}

export function normalizeAgentId(agentId: string) {
  return agentId.trim();
}

export function getAgentRouteHref(agentId: string) {
  return `/routes?agentId=${encodeURIComponent(agentId)}`;
}

export function formatLocationDate(value: string | null | undefined) {
  return formatBrazilianDateTime(value);
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

export function getLocationStatusBadgeClassName(status: LocationStatus) {
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
