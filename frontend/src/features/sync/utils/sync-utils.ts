import type { SyncStatus } from "@/features/sync/types/sync-types";
import { formatBrazilianDateTime } from "@/utils/format-date";

export function formatSyncDateTime(value: string | null | undefined) {
  return formatBrazilianDateTime(value);
}

export function formatDuration(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(value / 1000).toFixed(1)} s`;
}

export function formatSyncValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }

  return String(value);
}

export function getSyncStatusBadgeClassName(status: SyncStatus | null) {
  const baseClassName =
    "inline-flex rounded-md border px-2 py-1 text-xs font-medium";

  if (status === "SUCCESS") {
    return `${baseClassName} border-green-200 bg-green-50 text-green-700`;
  }

  if (status === "FAILED") {
    return `${baseClassName} border-red-200 bg-red-50 text-red-700`;
  }

  if (status === "PARTIAL") {
    return `${baseClassName} border-orange-200 bg-orange-50 text-orange-700`;
  }

  if (status === "RUNNING") {
    return `${baseClassName} border-blue-200 bg-blue-50 text-blue-700`;
  }

  return `${baseClassName} border-zinc-200 bg-zinc-50 text-zinc-700`;
}
