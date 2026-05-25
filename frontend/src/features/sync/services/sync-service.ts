import { httpClient } from "@/services/http-client";
import type {
  SyncExecution,
  SyncFilters,
  SyncSummary,
} from "@/features/sync/types/sync-types";

export async function findSyncSummary() {
  const response = await httpClient.get<SyncSummary>("/api/sync/summary");

  return response.data;
}

export async function findSyncExecutions(filters: SyncFilters) {
  if (filters.syncType !== "ALL_TYPES") {
    const response = await httpClient.get<SyncExecution[]>(
      `/api/sync/executions/type/${filters.syncType}`,
    );

    return response.data;
  }

  const response = await httpClient.get<SyncExecution[]>(
    "/api/sync/executions",
  );

  return response.data;
}

export async function syncLocations() {
  await httpClient.post("/api/location/sync");
}

export async function syncCheckIns() {
  await httpClient.post("/api/check-ins/sync");
}

export async function syncGeofences() {
  await httpClient.post("/api/geofences/sync");
}
