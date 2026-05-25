import { formatBrazilianDateTime } from "@/utils/format-date";

export function formatGeofenceDate(value?: string | null) {
  return formatBrazilianDateTime(value);
}

export function formatBooleanLabel(value: boolean) {
  return value ? "Sim" : "Não";
}

export function formatOptionalText(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

export function formatCoordinatesJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}
