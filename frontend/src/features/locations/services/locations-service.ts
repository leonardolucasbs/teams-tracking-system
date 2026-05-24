import { AxiosError } from "axios";
import { httpClient } from "@/services/http-client";
import type { AgentLocation } from "@/features/locations/types/location-types";

export async function findLocationsByAgent(agentId: string) {
  try {
    const response = await httpClient.get<AgentLocation[]>(
      `/api/location/agents/${agentId}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function syncLocations() {
  await httpClient.post("/api/location/sync");
}
