"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { GeofenceFilters } from "@/features/geofences/components/GeofenceFilters";
import { GeofenceSyncButton } from "@/features/geofences/components/GeofenceSyncButton";
import { GeofencesTable } from "@/features/geofences/components/GeofencesTable";
import { GEOFENCE_MESSAGES } from "@/features/geofences/constants/geofence-constants";
import { useGeofences } from "@/features/geofences/hooks/useGeofences";

export function GeofencesPage() {
  const {
    geofences,
    filters,
    isLoading,
    isError,
    isSyncing,
    setFilters,
    syncGeofences,
  } = useGeofences();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Área Operacional"
        description="Consulte as áreas operacionais e acompanhe suas regras de alerta."
        actions={
          <GeofenceSyncButton
            isSyncing={isSyncing}
            onSync={() => syncGeofences()}
          />
        }
      />
      <GeofenceFilters filters={filters} onFiltersChange={setFilters} />
      {isLoading ? <LoadingState message={GEOFENCE_MESSAGES.loading} /> : null}
      {isError ? <ErrorState message={GEOFENCE_MESSAGES.error} /> : null}
      {!isLoading && !isError && geofences.length === 0 ? (
        <EmptyState message={GEOFENCE_MESSAGES.empty} />
      ) : null}
      {!isLoading && !isError && geofences.length > 0 ? (
        <GeofencesTable geofences={geofences} />
      ) : null}
    </div>
  );
}
