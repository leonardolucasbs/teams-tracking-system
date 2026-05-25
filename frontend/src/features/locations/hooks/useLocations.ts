"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LOCATIONS_QUERY_KEY,
  defaultLocationFilters,
} from "@/features/locations/constants/location-constants";
import {
  findLocationsByAgent,
  syncLocations,
} from "@/features/locations/services/locations-service";
import { locationFiltersSchema } from "@/features/locations/schemas/location-filter-schema";
import type { LocationFilters } from "@/features/locations/types/location-types";
import { normalizeAgentId } from "@/features/locations/utils/location-utils";
import { TOAST_MESSAGES } from "@/constants/toast-constants";
import { useToast } from "@/hooks/useToast";
import { useAgentSearch } from "@/hooks/useAgentSearch";
import { getApiErrorMessage } from "@/utils/api-error";

export function useLocations() {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();
  const agentSearch = useAgentSearch();
  const [filters, setFilters] = useState<LocationFilters>(
    defaultLocationFilters,
  );
  const normalizedAgentId = normalizeAgentId(agentSearch.selectedAgent?.id ?? "");
  const locationsQuery = useQuery({
    queryKey: [...LOCATIONS_QUERY_KEY, normalizedAgentId],
    queryFn: () => findLocationsByAgent(normalizedAgentId),
    enabled: normalizedAgentId.length > 0,
  });

  const syncMutation = useMutation({
    mutationFn: syncLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.locationsSynced);
    },
    onError: (error) => {
      showErrorToast(getApiErrorMessage(error, "Não foi possível sincronizar as localizações."));
    },
  });

  return {
    locations: locationsQuery.data ?? [],
    filters,
    agentSearch,
    hasAgentFilter: normalizedAgentId.length > 0,
    isLoading: locationsQuery.isLoading,
    isError: locationsQuery.isError || syncMutation.isError,
    isSyncing: syncMutation.isPending,
    setFilters,
    submitFilters,
    syncLocations: syncMutation.mutate,
  };

  function submitFilters() {
    const parsedFilters = locationFiltersSchema.safeParse(filters);

    if (parsedFilters.success) {
      setFilters(parsedFilters.data);
    }
  }
}
