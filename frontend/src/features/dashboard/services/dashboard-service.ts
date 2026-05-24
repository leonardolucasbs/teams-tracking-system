import { httpClient } from "@/services/http-client";
import type {
  AgentResponse,
  CheckInResponse,
  DashboardServiceData,
  GeofenceResponse,
  SyncSummaryResponse,
} from "@/features/dashboard/types/dashboard-types";

export async function getDashboardData(): Promise<DashboardServiceData> {
  const [agents, checkIns, geofences, syncSummary] = await Promise.all([
    getAgents(),
    getCheckIns(),
    getGeofences(),
    getSyncSummary(),
  ]);

  return {
    agents,
    checkIns,
    geofences,
    syncSummary,
  };
}

async function getAgents() {
  const response = await httpClient.get<AgentResponse[]>("/api/agents");
  return response.data;
}

async function getCheckIns() {
  const response = await httpClient.get<CheckInResponse[]>("/api/check-ins");
  return response.data;
}

async function getGeofences() {
  const response = await httpClient.get<GeofenceResponse[]>("/api/geofences");
  return response.data;
}

async function getSyncSummary() {
  const response = await httpClient.get<SyncSummaryResponse>("/api/sync/summary");
  return response.data;
}
