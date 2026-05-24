import { routeStatusLabels } from "@/features/routes/constants/route-constants";
import type { RouteStatusBadgeProps } from "@/features/routes/types/route-types";
import { getRouteStatusBadgeClassName } from "@/features/routes/utils/route-utils";

export function RouteStatusBadge({ status }: RouteStatusBadgeProps) {
  return (
    <span className={getRouteStatusBadgeClassName(status)}>
      {routeStatusLabels[status]}
    </span>
  );
}
