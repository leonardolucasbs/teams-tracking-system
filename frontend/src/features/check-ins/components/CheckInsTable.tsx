 "use client";

import { TablePagination } from "@/components/shared/TablePagination";
import { checkInOriginLabels } from "@/features/check-ins/constants/check-in-constants";
import { CheckInTypeBadge } from "@/features/check-ins/components/CheckInTypeBadge";
import type { CheckInsTableProps } from "@/features/check-ins/types/check-in-types";
import {
  formatCheckInDate,
  formatCoordinate,
  formatOptionalNumber,
} from "@/features/check-ins/utils/check-in-utils";
import { usePagination } from "@/hooks/usePagination";

export function CheckInsTable({ checkIns }: CheckInsTableProps) {
  const pagination = usePagination(checkIns);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Agente</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Fonte</th>
              <th className="px-4 py-3 font-medium">Latitude</th>
              <th className="px-4 py-3 font-medium">Longitude</th>
              <th className="px-4 py-3 font-medium">Endereço</th>
              <th className="px-4 py-3 font-medium">Precisão</th>
              <th className="px-4 py-3 font-medium">Velocidade</th>
              <th className="px-4 py-3 font-medium">Observações</th>
              <th className="px-4 py-3 font-medium">Distância anterior</th>
              <th className="px-4 py-3 font-medium">Ocorrido em</th>
              <th className="px-4 py-3 font-medium">Sincronizado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((checkIn) => (
              <tr key={checkIn.id} className="text-foreground">
                <td className="px-4 py-3 font-medium">
                  {checkIn.agentName}
                </td>
                <td className="px-4 py-3">
                  <CheckInTypeBadge type={checkIn.type} />
                </td>
                <td className="px-4 py-3">
                  {checkInOriginLabels[checkIn.origin]}
                </td>
                <td className="px-4 py-3">
                  {checkIn.source ?? "Não informado"}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(checkIn.latitude)}
                </td>
                <td className="px-4 py-3">
                  {formatCoordinate(checkIn.longitude)}
                </td>
                <td className="px-4 py-3">
                  {checkIn.address ?? "Não informado"}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(checkIn.accuracy, " m")}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(checkIn.speed, " km/h")}
                </td>
                <td className="px-4 py-3">
                  {checkIn.notes ?? "Não informado"}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalNumber(checkIn.distanceFromPrevious, " km")}
                </td>
                <td className="px-4 py-3">
                  {formatCheckInDate(checkIn.occurredAt)}
                </td>
                <td className="px-4 py-3">
                  {formatCheckInDate(checkIn.syncedAt)}
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
