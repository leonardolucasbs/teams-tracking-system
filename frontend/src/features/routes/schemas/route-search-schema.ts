import { z } from "zod";
import { ROUTE_VALIDATION_MESSAGES } from "@/features/routes/constants/route-constants";

export const routeSearchSchema = z.object({
  agentId: z.string().trim().min(1, ROUTE_VALIDATION_MESSAGES.agentIdRequired),
});
