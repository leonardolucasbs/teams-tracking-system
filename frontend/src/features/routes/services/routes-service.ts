import { httpClient } from "@/services/http-client";
import type { RouteSummary } from "@/features/routes/types/route-types";

export async function findTodayRouteByAgent(agentId: string) {
  const response = await httpClient.get<RouteSummary>(
    `/api/routes/agents/${agentId}/today`,
  );

  return response.data;
}
