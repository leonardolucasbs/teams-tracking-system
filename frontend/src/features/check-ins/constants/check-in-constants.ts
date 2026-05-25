import type {
  CheckInFilters,
  CheckInFormValues,
  CheckInOrigin,
  CheckInType,
} from "@/features/check-ins/types/check-in-types";

export const CHECK_INS_QUERY_KEY = ["check-ins"];

export const checkInTypeOptions: CheckInType[] = [
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
];

export const checkInTypeLabels: Record<CheckInType, string> = {
  CHECKIN: "Check-in",
  CHECKOUT: "Check-out",
  VISIT_COMPLETED: "Visita concluída",
  STOP_DETECTED: "Parada detectada",
  STOP_ENDED: "Parada finalizada",
  SIGNAL_LOST: "Sinal perdido",
  SIGNAL_RESTORED: "Sinal restaurado",
  LOW_BATTERY: "Bateria baixa",
  GEOFENCE_ENTER: "Entrada em área operacional",
  GEOFENCE_EXIT: "Saída de área operacional",
};

export const checkInOriginLabels: Record<CheckInOrigin, string> = {
  LOCAL: "Local",
  EXTERNAL_API: "API externa",
};

export const defaultCheckInFilters: CheckInFilters = {
  agentId: "",
  type: "ALL",
  todayOnly: false,
};

export const defaultCheckInFormValues: CheckInFormValues = {
  agentId: "",
  type: "CHECKIN",
  latitude: 0,
  longitude: 0,
  address: "",
  accuracy: undefined,
  speed: undefined,
  notes: "",
  occurredAt: "",
};

export const CHECK_IN_VALIDATION_MESSAGES = {
  agentIdRequired: "Agente é obrigatório.",
  typeRequired: "Tipo é obrigatório.",
  latitudeRequired: "Latitude é obrigatória.",
  latitudeMin: "Latitude não pode ser menor que -90.",
  latitudeMax: "Latitude não pode ser maior que 90.",
  longitudeRequired: "Longitude é obrigatória.",
  longitudeMin: "Longitude não pode ser menor que -180.",
  longitudeMax: "Longitude não pode ser maior que 180.",
  occurredAtInvalid: "Informe a data e hora no formato dd/mm/aaaa hh:mm.",
  occurredAtFuture: "A data e hora do check-in não podem ser futuras.",
};

export const CHECK_IN_MESSAGES = {
  loading: "Carregando check-ins...",
  error: "Não foi possível carregar os check-ins.",
  empty: "Nenhum check-in encontrado.",
};
