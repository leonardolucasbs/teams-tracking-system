"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ROUTE_QUERY_KEY,
  defaultRouteSearch,
} from "@/features/routes/constants/route-constants";
import { routeSearchSchema } from "@/features/routes/schemas/route-search-schema";
import { findTodayRouteByAgent } from "@/features/routes/services/routes-service";
import type { RouteSearch } from "@/features/routes/types/route-types";
import { normalizeRouteAgentId } from "@/features/routes/utils/route-utils";
import { useAgentSearch } from "@/hooks/useAgentSearch";

export function useRoute() {
  const [search, setSearch] = useState<RouteSearch>(defaultRouteSearch);
  const agentSearch = useAgentSearch();
  const normalizedAgentId = normalizeRouteAgentId(agentSearch.selectedAgent?.id ?? "");

  const routeQuery = useQuery({
    queryKey: [...ROUTE_QUERY_KEY, normalizedAgentId],
    queryFn: () => findTodayRouteByAgent(normalizedAgentId),
    enabled: normalizedAgentId.length > 0,
  });

  return {
    search,
    agentSearch,
    route: routeQuery.data,
    hasAgentSearch: normalizedAgentId.length > 0,
    isLoading: routeQuery.isLoading,
    isError: routeQuery.isError,
    setSearch,
    submitSearch,
  };

  function submitSearch() {
    const parsedSearch = routeSearchSchema.safeParse(search);

    if (parsedSearch.success) {
      setSearch(parsedSearch.data);
    }
  }
}
