"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { GeofenceMapDetails } from "@/features/geofences/components/GeofenceMapDetails";
import { GeofenceMapWrapper } from "@/features/geofences/components/GeofenceMapWrapper";
import { GEOFENCE_MESSAGES } from "@/features/geofences/constants/geofence-constants";
import { useGeofenceMap } from "@/features/geofences/hooks/useGeofences";
import type { GeofenceMapPageProps } from "@/features/geofences/types/geofence-types";

export function GeofenceMapPage({ id }: GeofenceMapPageProps) {
  const { geofence, isLoading, isError } = useGeofenceMap(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapa da área operacional"
        description="Visualize a área ou localização selecionada."
      />

      {isLoading ? (
        <LoadingState message={GEOFENCE_MESSAGES.loadingMap} />
      ) : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message={GEOFENCE_MESSAGES.mapError}
        />
      ) : null}

      {!isLoading && !isError && !geofence ? (
        <EmptyState
          title="Área operacional não encontrada"
          message={GEOFENCE_MESSAGES.notFound}
        />
      ) : null}

      {geofence ? (
        <>
          <GeofenceMapDetails geofence={geofence} />
          <GeofenceMapWrapper geofence={geofence} />
        </>
      ) : null}
    </div>
  );
}
