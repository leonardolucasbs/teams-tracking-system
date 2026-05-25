import type { RegisterOptions } from "react-hook-form";
import { formatBrazilianDateTime } from "@/utils/format-date";
import type { CheckInFormValues } from "@/features/check-ins/types/check-in-types";
import type { CheckInType } from "@/features/check-ins/types/check-in-types";

const optionalNumberFields: Array<keyof CheckInFormValues> = [
  "accuracy",
  "speed",
];

const brazilianDateTimeRegex =
  /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01]\d|2[0-3]):[0-5]\d$/;

export function formatCheckInDate(value: string | null | undefined) {
  return formatBrazilianDateTime(value);
}

export function isBrazilianDateTime(value: string) {
  return brazilianDateTimeRegex.test(value.trim()) && parseBrazilianDateTime(value) !== null;
}

export function isBrazilianDateTimeNotInFuture(value: string) {
  const parsedDate = parseBrazilianDateTime(value);

  if (!parsedDate) {
    return true;
  }

  return parsedDate.getTime() <= Date.now();
}

export function parseBrazilianDateTimeToIso(value: string) {
  const parsedDate = parseBrazilianDateTime(value);

  if (!parsedDate) {
    return null;
  }

  return parsedDate.toISOString();
}

function parseBrazilianDateTime(value: string) {
  const [date, time] = value.trim().split(" ");

  if (!date || !time || !brazilianDateTimeRegex.test(value.trim())) {
    return null;
  }

  const [day, month, year] = date.split("/");
  const [hour, minute] = time.split(":");
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day) ||
    parsedDate.getHours() !== Number(hour) ||
    parsedDate.getMinutes() !== Number(minute)
  ) {
    return null;
  }

  return parsedDate;
}

export function formatCoordinate(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return value.toFixed(6);
}

export function formatOptionalNumber(
  value: number | null | undefined,
  suffix: string,
) {
  if (value === null || value === undefined) {
    return "Não informado";
  }

  return `${value}${suffix}`;
}

export function getCheckInTypeBadgeClassName(type: CheckInType) {
  const baseClassName =
    "inline-flex rounded-md border px-2 py-1 text-xs font-medium";

  if (type === "CHECKIN" || type === "CHECKOUT") {
    return `${baseClassName} border-green-200 bg-green-50 text-green-700`;
  }

  if (type === "LOW_BATTERY" || type === "SIGNAL_LOST") {
    return `${baseClassName} border-orange-200 bg-orange-50 text-orange-700`;
  }

  return `${baseClassName} border-zinc-200 bg-zinc-50 text-zinc-700`;
}

export function getCheckInRegisterOptions(
  id: keyof CheckInFormValues,
  type: string,
): RegisterOptions<CheckInFormValues> {
  if (type !== "number") {
    return {};
  }

  if (optionalNumberFields.includes(id)) {
    return {
      setValueAs: (value) => (value === "" ? undefined : Number(value)),
    };
  }

  return {
    valueAsNumber: true,
  };
}
