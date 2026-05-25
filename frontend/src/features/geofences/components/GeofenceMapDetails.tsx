import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GeofenceTypeBadge } from "@/features/geofences/components/GeofenceTypeBadge";
import type { GeofenceMapDetailsProps } from "@/features/geofences/types/geofence-types";
import {
  formatBooleanLabel,
  formatGeofenceDate,
  formatOptionalText,
} from "@/features/geofences/utils/geofence-utils";

export function GeofenceMapDetails({ geofence }: GeofenceMapDetailsProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {geofence.name}
          </h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/geofences">Voltar para Área Operacional</Link>
        </Button>
      </div>

      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="mt-1">
            <GeofenceTypeBadge type={geofence.type} />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Equipes</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatOptionalText(geofence.assignedTeams)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Alerta de entrada</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatBooleanLabel(geofence.alertOnEnter)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Alerta de saída</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatBooleanLabel(geofence.alertOnExit)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Sincronizado em</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatGeofenceDate(geofence.syncedAt)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
