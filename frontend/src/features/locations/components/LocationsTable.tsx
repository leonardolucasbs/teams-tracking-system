 "use client";

import Link from "next/link";
import { TablePagination } from "@/components/shared/TablePagination";
import { LocationStatusBadge } from "@/features/locations/components/LocationStatusBadge";
import type { LocationsTableProps } from "@/features/locations/types/location-types";
import {
  formatCoordinate,
  formatLocationDate,
  formatOptionalNumber,
  getAgentRouteHref,
} from "@/features/locations/utils/location-utils";
import { usePagination } from "@/hooks/usePagination";

export function LocationsTable({ locations }: LocationsTableProps) {
  const pagination = usePagination(locations);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Agente</th>
              <th className="px-4 py-3 font-medium">Latitude</th>
              <th className="px-4 py-3 font-medium">Longitude</th>
              <th className="px-4 py-3 font-medium">Endereço</th>
              <th className="px-4 py-3 font-medium">Precisão</th>
              <th className="px-4 py-3 font-medium">Velocidade</th>
              <th className="px-4 py-3 font-medium">Bateria</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Último sinal</th>
              <th className="px-4 py-3 font-medium">Rota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((location) => (
              <tr key={location.id} className="text-foreground">
                <td className="px-4 py-3 font-medium">
                  {location.agentName}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(location.latitude)}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(location.longitude)}
                </td>
                <td className="px-4 py-3">
                  {location.currentAddress ?? "Não informado"}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(location.accuracy, " m")}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(location.speed, " km/h")}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(location.battery, "%")}
                </td>
                <td className="px-4 py-3">
                  <LocationStatusBadge status={location.status} />
                </td>
                <td className="px-4 py-3">
                  {formatLocationDate(location.lastSeen)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={getAgentRouteHref(location.agentId)}
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Ver rota
                  </Link>
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
