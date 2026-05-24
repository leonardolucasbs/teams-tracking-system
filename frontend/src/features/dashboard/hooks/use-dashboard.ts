import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { mapDashboardData } from "@/features/dashboard/utils/dashboard.utils";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    select: mapDashboardData,
  });
}
