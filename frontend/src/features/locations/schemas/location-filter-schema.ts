import { z } from "zod";
import { LOCATION_VALIDATION_MESSAGES } from "@/features/locations/constants/location-constants";

export const locationFiltersSchema = z.object({
  agentId: z.string().trim().min(1, LOCATION_VALIDATION_MESSAGES.agentIdRequired),
});
