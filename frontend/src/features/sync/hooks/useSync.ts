"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TOAST_MESSAGES } from "@/constants/toast-constants";
import {
  SYNC_EXECUTIONS_QUERY_KEY,
  SYNC_SUMMARY_QUERY_KEY,
  defaultSyncFilters,
} from "@/features/sync/constants/sync-constants";
import {
  findSyncExecutions,
  findSyncSummary,
  syncCheckIns,
  syncGeofences,
  syncLocations,
} from "@/features/sync/services/sync-service";
import type { SyncFilters } from "@/features/sync/types/sync-types";
import { useToast } from "@/hooks/useToast";

export function useSync() {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useToast();
  const [filters, setFilters] = useState<SyncFilters>(defaultSyncFilters);

  const summaryQuery = useQuery({
    queryKey: SYNC_SUMMARY_QUERY_KEY,
    queryFn: findSyncSummary,
  });

  const executionsQuery = useQuery({
    queryKey: [...SYNC_EXECUTIONS_QUERY_KEY, filters],
    queryFn: () => findSyncExecutions(filters),
  });

  const locationsMutation = useMutation({
    mutationFn: syncLocations,
    onSuccess: handleManualSyncSuccess,
  });

  const checkInsMutation = useMutation({
    mutationFn: syncCheckIns,
    onSuccess: handleManualSyncSuccess,
  });

  const geofencesMutation = useMutation({
    mutationFn: syncGeofences,
    onSuccess: handleManualSyncSuccess,
  });

  function handleManualSyncSuccess() {
    queryClient.invalidateQueries({ queryKey: SYNC_SUMMARY_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: SYNC_EXECUTIONS_QUERY_KEY });
    showSuccessToast(TOAST_MESSAGES.success);
  }

  return {
    summary: summaryQuery.data,
    executions: executionsQuery.data ?? [],
    filters,
    isLoading: summaryQuery.isLoading || executionsQuery.isLoading,
    isError:
      summaryQuery.isError ||
      executionsQuery.isError ||
      locationsMutation.isError ||
      checkInsMutation.isError ||
      geofencesMutation.isError,
    isSyncingLocations: locationsMutation.isPending,
    isSyncingCheckIns: checkInsMutation.isPending,
    isSyncingGeofences: geofencesMutation.isPending,
    setFilters,
    syncLocations: locationsMutation.mutate,
    syncCheckIns: checkInsMutation.mutate,
    syncGeofences: geofencesMutation.mutate,
  };
}
