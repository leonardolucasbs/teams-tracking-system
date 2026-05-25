"use client";

import Link from "next/link";
import { TablePagination } from "@/components/shared/TablePagination";
import { Button } from "@/components/ui/Button";
import { GeofenceTypeBadge } from "@/features/geofences/components/GeofenceTypeBadge";
import type { GeofencesTableProps } from "@/features/geofences/types/geofence-types";
import {
  formatBooleanLabel,
  formatGeofenceDate,
  formatOptionalText,
} from "@/features/geofences/utils/geofence-utils";
import { usePagination } from "@/hooks/usePagination";

export function GeofencesTable({ geofences }: GeofencesTableProps) {
  const pagination = usePagination(geofences);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Entrada</th>
              <th className="px-4 py-3 font-medium">Saída</th>
              <th className="px-4 py-3 font-medium">Equipes</th>
              <th className="px-4 py-3 font-medium">Coordenadas</th>
              <th className="px-4 py-3 font-medium">Sincronizado em</th>
              <th className="px-4 py-3 font-medium">Criado em</th>
              <th className="px-4 py-3 font-medium">Atualizado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagination.paginatedItems.map((geofence) => (
              <tr key={geofence.id} className="text-foreground">
                <td className="px-4 py-3 font-medium">{geofence.name}</td>
                <td className="px-4 py-3">
                  <GeofenceTypeBadge type={geofence.type} />
                </td>
                <td className="px-4 py-3">
                  {formatBooleanLabel(geofence.alertOnEnter)}
                </td>
                <td className="px-4 py-3">
                  {formatBooleanLabel(geofence.alertOnExit)}
                </td>
                <td className="px-4 py-3">
                  {formatOptionalText(geofence.assignedTeams)}
                </td>
                <td className="px-4 py-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/geofences/${geofence.id}/map`}>
                      Ver coordenadas
                    </Link>
                  </Button>
                </td>
                <td className="px-4 py-3">
                  {formatGeofenceDate(geofence.syncedAt)}
                </td>
                <td className="px-4 py-3">
                  {formatGeofenceDate(geofence.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {formatGeofenceDate(geofence.updatedAt)}
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
