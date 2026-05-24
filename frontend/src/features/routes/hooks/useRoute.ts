"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ROUTE_QUERY_KEY,
  defaultRouteSearch,
} from "@/features/routes/constants/route-constants";
import { findTodayRouteByAgent } from "@/features/routes/services/routes-service";
import type { RouteSearch } from "@/features/routes/types/route-types";
import {
  canFetchRoute,
  normalizeRouteAgentId,
} from "@/features/routes/utils/route-utils";

export function useRoute() {
  const [search, setSearch] = useState<RouteSearch>(defaultRouteSearch);
  const [submittedAgentId, setSubmittedAgentId] = useState("");
  const normalizedAgentId = normalizeRouteAgentId(submittedAgentId);

  const routeQuery = useQuery({
    queryKey: [...ROUTE_QUERY_KEY, normalizedAgentId],
    queryFn: () => findTodayRouteByAgent(normalizedAgentId),
    enabled: normalizedAgentId.length > 0,
  });

  return {
    search,
    route: routeQuery.data,
    hasAgentSearch: normalizedAgentId.length > 0,
    isLoading: routeQuery.isLoading,
    isError: routeQuery.isError,
    setSearch,
    submitSearch,
  };

  function submitSearch() {
    if (canFetchRoute(search)) {
      setSubmittedAgentId(normalizeRouteAgentId(search.agentId));
    }
  }
}
