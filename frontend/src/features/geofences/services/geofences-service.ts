import { AxiosError } from "axios";
import { httpClient } from "@/services/http-client";
import type {
  Geofence,
  GeofenceFilters,
} from "@/features/geofences/types/geofence-types";

export async function findGeofences(filters: GeofenceFilters) {
  try {
    const response = await httpClient.get<Geofence[]>(getGeofencesPath(filters));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function syncGeofences() {
  await httpClient.post("/api/geofences/sync");
}

function getGeofencesPath(filters: GeofenceFilters) {
  if (filters.type === "ALL") {
    return "/api/geofences";
  }

  return `/api/geofences/type/${filters.type}`;
}
