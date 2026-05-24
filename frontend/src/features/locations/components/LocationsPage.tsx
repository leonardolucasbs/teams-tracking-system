"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { LocationFilters } from "@/features/locations/components/LocationFilters";
import { LocationSyncButton } from "@/features/locations/components/LocationSyncButton";
import { LocationsTable } from "@/features/locations/components/LocationsTable";
import { LOCATION_MESSAGES } from "@/features/locations/constants/location-constants";
import { useLocations } from "@/features/locations/hooks/useLocations";

export function LocationsPage() {
  const {
    locations,
    filters,
    hasAgentFilter,
    isLoading,
    isError,
    isSyncing,
    setFilters,
    submitFilters,
    syncLocations,
  } = useLocations();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Localizações"
        description="Consulte o histórico persistido de localizações dos agentes."
        actions={
          <LocationSyncButton isSyncing={isSyncing} onSync={syncLocations} />
        }
      />

      <LocationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSubmit={submitFilters}
      />

      {isLoading ? <LoadingState message={LOCATION_MESSAGES.loading} /> : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message={LOCATION_MESSAGES.error}
        />
      ) : null}

      {!hasAgentFilter ? (
        <EmptyState
          title="Informe um agente"
          message={LOCATION_MESSAGES.emptyWithoutAgent}
        />
      ) : null}

      {hasAgentFilter && !isLoading && !isError && locations.length === 0 ? (
        <EmptyState
          title="Nenhuma localização encontrada"
          message={LOCATION_MESSAGES.emptyWithAgent}
        />
      ) : null}

      {locations.length > 0 ? <LocationsTable locations={locations} /> : null}
    </div>
  );
}
