import { httpClient } from "@/services/http-client";
import type {
  CheckIn,
  CheckInFilters,
  CheckInFormValues,
} from "@/features/check-ins/types/check-in-types";
import { parseBrazilianDateTimeToIso } from "@/features/check-ins/utils/check-in-utils";

export async function findCheckIns(filters: CheckInFilters) {
  if (filters.todayOnly && filters.agentId.trim()) {
    const response = await httpClient.get<CheckIn[]>(
      `/api/check-ins/agents/${filters.agentId.trim()}/today`,
    );
    return response.data;
  }

  const response = await httpClient.get<CheckIn[]>("/api/check-ins", {
    params: {
      agentId: filters.agentId.trim() || undefined,
      type: filters.type === "ALL" ? undefined : filters.type,
    },
  });
  return response.data;
}

export async function createCheckIn(values: CheckInFormValues) {
  const response = await httpClient.post<CheckIn>(
    "/api/check-ins",
    toCheckInPayload(values),
  );
  return response.data;
}

export async function syncCheckIns() {
  await httpClient.post("/api/check-ins/sync");
}

function toCheckInPayload(values: CheckInFormValues) {
  return {
    ...values,
    address: values.address || null,
    accuracy: toOptionalNumber(values.accuracy),
    speed: toOptionalNumber(values.speed),
    notes: values.notes || null,
    occurredAt: toOptionalInstant(values.occurredAt),
  };
}

function toOptionalNumber(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return null;
  }

  return value;
}

function toOptionalInstant(value: string) {
  if (!value) {
    return null;
  }

  return parseBrazilianDateTimeToIso(value);
}
