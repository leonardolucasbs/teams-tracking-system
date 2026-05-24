import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import type { checkInSchema } from "@/features/check-ins/schemas/checkInSchema";

export type CheckInType =
  | "CHECKIN"
  | "CHECKOUT"
  | "VISIT_COMPLETED"
  | "STOP_DETECTED"
  | "STOP_ENDED"
  | "SIGNAL_LOST"
  | "SIGNAL_RESTORED"
  | "LOW_BATTERY"
  | "GEOFENCE_ENTER"
  | "GEOFENCE_EXIT";

export type CheckInOrigin = "LOCAL" | "EXTERNAL_API";

export type CheckIn = {
  id: string;
  agentId: string;
  agentName: string;
  externalCheckInId: string | null;
  externalEventId: string | null;
  type: CheckInType;
  origin: CheckInOrigin;
  source: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  accuracy: number | null;
  speed: number | null;
  notes: string | null;
  distanceFromPrevious: number | null;
  occurredAt: string;
  syncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CheckInFilters = {
  agentId: string;
  type: CheckInType | "ALL";
  todayOnly: boolean;
};

export type CheckInFormValues = z.infer<typeof checkInSchema>;

export type CheckInsTableProps = {
  checkIns: CheckIn[];
};

export type CheckInFiltersProps = {
  filters: CheckInFilters;
  onFiltersChange: (filters: CheckInFilters) => void;
  onSubmit: () => void;
};

export type CheckInTypeBadgeProps = {
  type: CheckInType;
};

export type CheckInSyncButtonProps = {
  isSyncing: boolean;
  onSync: () => void;
};

export type CheckInFormProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CheckInFormValues) => void;
};

export type CheckInTextFieldProps = {
  id: keyof CheckInFormValues;
  label: string;
  placeholder: string;
  register: UseFormRegister<CheckInFormValues>;
  error?: string;
  type?: string;
};
