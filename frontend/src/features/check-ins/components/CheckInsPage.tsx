"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { CheckInFilters } from "@/features/check-ins/components/CheckInFilters";
import { CheckInForm } from "@/features/check-ins/components/CheckInForm";
import { CheckInSyncButton } from "@/features/check-ins/components/CheckInSyncButton";
import { CheckInsTable } from "@/features/check-ins/components/CheckInsTable";
import { CHECK_IN_MESSAGES } from "@/features/check-ins/constants/check-in-constants";
import { useCheckIns } from "@/features/check-ins/hooks/useCheckIns";

export function CheckInsPage() {
  const {
    checkIns,
    filters,
    filterAgentSearch,
    formAgentSearch,
    isFormOpen,
    isLoading,
    isError,
    isSubmitting,
    isSyncing,
    setFilters,
    submitFilters,
    openForm,
    closeForm,
    createCheckIn,
    syncCheckIns,
  } = useCheckIns();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-ins"
        description="Registre check-ins manuais e consulte eventos sincronizados."
        actions={
          <>
            <CheckInSyncButton isSyncing={isSyncing} onSync={syncCheckIns} />
            <Button onClick={openForm}>Criar check-in</Button>
          </>
        }
      />

      <CheckInFilters
        filters={filters}
        agentSearch={filterAgentSearch}
        onFiltersChange={setFilters}
        onSubmit={submitFilters}
      />

      {isLoading ? <LoadingState message={CHECK_IN_MESSAGES.loading} /> : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message={CHECK_IN_MESSAGES.error}
        />
      ) : null}

      {!isLoading && !isError && checkIns.length === 0 ? (
        <EmptyState
          title="Nenhum check-in encontrado"
          message={CHECK_IN_MESSAGES.empty}
        />
      ) : null}

      {checkIns.length > 0 ? <CheckInsTable checkIns={checkIns} /> : null}

      <CheckInForm
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        agentSearch={formAgentSearch}
        onClose={closeForm}
        onSubmit={createCheckIn}
      />
    </div>
  );
}
