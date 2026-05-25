 "use client";

import { TablePagination } from "@/components/shared/TablePagination";
import { RouteStatusBadge } from "@/features/routes/components/RouteStatusBadge";
import type { RoutePointsTableProps } from "@/features/routes/types/route-types";
import {
  formatCoordinate,
  formatOptionalNumber,
  formatRouteDateTime,
} from "@/features/routes/utils/route-utils";
import { usePagination } from "@/hooks/usePagination";

export function RoutePointsTable({ points }: RoutePointsTableProps) {
  const pagination = usePagination(points);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Localização</th>
              <th className="px-4 py-3 font-medium">Latitude</th>
              <th className="px-4 py-3 font-medium">Longitude</th>
              <th className="px-4 py-3 font-medium">Endereço</th>
              <th className="px-4 py-3 font-medium">Precisão</th>
              <th className="px-4 py-3 font-medium">Velocidade</th>
              <th className="px-4 py-3 font-medium">Bateria</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Último sinal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((point) => (
              <tr key={point.locationId} className="text-foreground">
                <td className="px-4 py-3 font-mono text-xs">
                  {point.locationId}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(point.latitude)}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(point.longitude)}
                </td>
                <td className="px-4 py-3">
                  {point.currentAddress ?? "Não informado"}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(point.accuracy, " m")}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(point.speed, " km/h")}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(point.battery, "%")}
                </td>
                <td className="px-4 py-3">
                  <RouteStatusBadge status={point.status} />
                </td>
                <td className="px-4 py-3">
                  {formatRouteDateTime(point.lastSeen)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        startItem={pagination.startItem}
        endItem={pagination.endItem}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
