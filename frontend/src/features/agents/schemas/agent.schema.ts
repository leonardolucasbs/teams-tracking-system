import { z } from "zod";
import { AGENT_VALIDATION_MESSAGES } from "@/features/agents/constants/agent.constants";

export const agentSchema = z.object({
  name: z.string().min(1, AGENT_VALIDATION_MESSAGES.nameRequired),
  role: z.enum(["INSTALLER", "TECHNICIAN", "VENDOR", "MAINTENANCE"], {
    message: AGENT_VALIDATION_MESSAGES.roleRequired,
  }),
  team: z.string().min(1, AGENT_VALIDATION_MESSAGES.teamRequired),
  phone: z.string().min(1, AGENT_VALIDATION_MESSAGES.phoneRequired),
  email: z
    .string()
    .refine(
      (value) => value.length === 0 || z.email().safeParse(value).success,
      AGENT_VALIDATION_MESSAGES.emailInvalid,
    ),
  active: z.boolean(),
  status: z.enum(["ONLINE", "PAUSED", "SIGNAL_LOST", "OFFLINE"], {
    message: AGENT_VALIDATION_MESSAGES.statusRequired,
  }),
  battery: z
    .number()
    .min(0, AGENT_VALIDATION_MESSAGES.batteryMin)
    .max(100, AGENT_VALIDATION_MESSAGES.batteryMax),
});
