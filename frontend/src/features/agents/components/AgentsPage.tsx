"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { AgentFilters } from "@/features/agents/components/AgentFilters";
import { AgentForm } from "@/features/agents/components/AgentForm";
import { AgentsTable } from "@/features/agents/components/AgentsTable";
import { useAgents } from "@/features/agents/hooks/useAgents";

export function AgentsPage() {
  const {
    agents,
    filters,
    teams,
    selectedAgent,
    isFormOpen,
    isLoading,
    isError,
    isSubmitting,
    isDeactivating,
    setFilters,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    handleDeactivate,
  } = useAgents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agentes"
        description="Gerencie agentes locais e agentes sincronizados pelo backend."
        actions={<Button onClick={openCreateForm}>Criar agente</Button>}
      />

      <AgentFilters
        filters={filters}
        teams={teams}
        onFiltersChange={setFilters}
      />

      {isLoading ? <LoadingState message="Carregando agentes..." /> : null}

      {isError ? (
        <ErrorState
          title="Ocorreu um erro"
          message="Não foi possível carregar os agentes."
        />
      ) : null}

      {!isLoading && !isError && agents.length === 0 ? (
        <EmptyState
          title="Nenhum agente encontrado"
          message="Ajuste os filtros ou crie um novo agente."
        />
      ) : null}

      {agents.length > 0 ? (
        <AgentsTable
          agents={agents}
          onEdit={openEditForm}
          onDeactivate={handleDeactivate}
          isDeactivating={isDeactivating}
        />
      ) : null}

      <AgentForm
        agent={selectedAgent}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={submitForm}
      />
    </div>
  );
}
