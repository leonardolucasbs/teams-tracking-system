"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TOAST_MESSAGES } from "@/constants/toast-constants";
import {
  SYNC_EXECUTIONS_QUERY_KEY,
  SYNC_SUMMARY_QUERY_KEY,
} from "@/features/sync/constants/sync-constants";
import {
  GEOFENCES_QUERY_KEY,
  defaultGeofenceFilters,
} from "@/features/geofences/constants/geofence-constants";
import {
  findGeofences,
  syncGeofences,
} from "@/features/geofences/services/geofences-service";
import type { GeofenceFilters } from "@/features/geofences/types/geofence-types";
import { useToast } from "@/hooks/useToast";

export function useGeofences() {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useToast();
  const [filters, setFilters] =
    useState<GeofenceFilters>(defaultGeofenceFilters);

  const geofencesQuery = useQuery({
    queryKey: [...GEOFENCES_QUERY_KEY, filters],
    queryFn: () => findGeofences(filters),
  });

  const syncMutation = useMutation({
    mutationFn: syncGeofences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEOFENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SYNC_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SYNC_EXECUTIONS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
    },
  });

  return {
    geofences: geofencesQuery.data ?? [],
    filters,
    isLoading: geofencesQuery.isLoading,
    isError: geofencesQuery.isError || syncMutation.isError,
    isSyncing: syncMutation.isPending,
    setFilters,
    syncGeofences: syncMutation.mutate,
  };
}
