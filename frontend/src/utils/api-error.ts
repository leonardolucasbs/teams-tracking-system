import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Não foi possível concluir a operação.",
) {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    const apiMessage = responseData?.error?.message ?? responseData?.message;
    const details = formatErrorDetails(responseData?.error?.details);
    const cause = [apiMessage, details].filter(Boolean).join(" ");

    if (cause) {
      return `${fallbackMessage} Motivo: ${cause}`;
    }

    if (error.response?.statusText) {
      return `${fallbackMessage} Motivo: ${error.response.statusText}`;
    }
  }

  if (error instanceof Error && error.message) {
    return `${fallbackMessage} Motivo: ${error.message}`;
  }

  return fallbackMessage;
}

function formatErrorDetails(details: unknown): string {
  if (!details) {
    return "";
  }

  if (typeof details === "string") {
    return details;
  }

  if (Array.isArray(details)) {
    return details.map(formatErrorDetails).filter(Boolean).join(" ");
  }

  if (typeof details === "object") {
    return Object.values(details).map(formatErrorDetails).filter(Boolean).join(" ");
  }

  return String(details);
}
