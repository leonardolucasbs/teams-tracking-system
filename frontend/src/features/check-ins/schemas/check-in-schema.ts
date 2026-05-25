import { z } from "zod";
import { CHECK_IN_VALIDATION_MESSAGES } from "@/features/check-ins/constants/check-in-constants";

const checkInTypeValues = [
  "CHECKIN",
  "CHECKOUT",
  "VISIT_COMPLETED",
  "STOP_DETECTED",
  "STOP_ENDED",
  "SIGNAL_LOST",
  "SIGNAL_RESTORED",
  "LOW_BATTERY",
  "GEOFENCE_ENTER",
  "GEOFENCE_EXIT",
] as const;

const optionalNumber = z.number().optional();

export const checkInSchema = z.object({
  agentId: z.string().trim().min(1, CHECK_IN_VALIDATION_MESSAGES.agentIdRequired),
  type: z.enum(checkInTypeValues, {
    message: CHECK_IN_VALIDATION_MESSAGES.typeRequired,
  }),
  latitude: z
    .number({ message: CHECK_IN_VALIDATION_MESSAGES.latitudeRequired })
    .min(-90, CHECK_IN_VALIDATION_MESSAGES.latitudeMin)
    .max(90, CHECK_IN_VALIDATION_MESSAGES.latitudeMax),
  longitude: z
    .number({ message: CHECK_IN_VALIDATION_MESSAGES.longitudeRequired })
    .min(-180, CHECK_IN_VALIDATION_MESSAGES.longitudeMin)
    .max(180, CHECK_IN_VALIDATION_MESSAGES.longitudeMax),
  address: z.string().trim(),
  accuracy: optionalNumber,
  speed: optionalNumber,
  notes: z.string().trim(),
  occurredAt: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 ||
        /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01]\d|2[0-3]):[0-5]\d$/.test(
          value,
        ),
      CHECK_IN_VALIDATION_MESSAGES.occurredAtInvalid,
    ),
});

export const checkInFiltersSchema = z.object({
  agentId: z.string().trim(),
  type: z.union([z.literal("ALL"), z.enum(checkInTypeValues)]),
  todayOnly: z.boolean(),
});
