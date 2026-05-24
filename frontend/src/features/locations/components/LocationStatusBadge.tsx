import { locationStatusLabels } from "@/features/locations/constants/location-constants";
import type { LocationStatusBadgeProps } from "@/features/locations/types/location-types";
import { getLocationStatusBadgeClassName } from "@/features/locations/utils/location-utils";

export function LocationStatusBadge({ status }: LocationStatusBadgeProps) {
  return (
    <span className={getLocationStatusBadgeClassName(status)}>
      {locationStatusLabels[status]}
    </span>
  );
}
