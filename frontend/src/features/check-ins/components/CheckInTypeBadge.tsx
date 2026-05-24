import { checkInTypeLabels } from "@/features/check-ins/constants/check-in-constants";
import type { CheckInTypeBadgeProps } from "@/features/check-ins/types/check-in-types";
import { getCheckInTypeBadgeClassName } from "@/features/check-ins/utils/check-in-utils";

export function CheckInTypeBadge({ type }: CheckInTypeBadgeProps) {
  return (
    <span className={getCheckInTypeBadgeClassName(type)}>
      {checkInTypeLabels[type]}
    </span>
  );
}
